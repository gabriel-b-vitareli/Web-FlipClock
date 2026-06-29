/* ═══════════════════════════════════════════════════════
   FLIP CLOCK — script.js
   ═══════════════════════════════════════════════════════ */

/* ─── UTILS ─── */
function pad(n) { return String(n).padStart(2, '0'); }

function buildUnit(el) {
  if (!el) return [];
  el.innerHTML = '';
  return [0, 1].map(() => {
    const c = document.createElement('div');
    c.className = 'card';
    window.currentSkin.buildDigit(c);
    window.currentSkin.setDigit(c, '0'); // Garante que inicializa mostrando '0'
    el.appendChild(c);
    return c;
  });
}

function flipDigit(card, from, to) {
  window.currentSkin.updateDigit(card, from, to);
}

function updateDigits(unitMap, stateMap, vals) {
  for (const k in vals) {
    if (!unitMap[k]) continue;
    vals[k].forEach((digit, i) => {
      if (digit !== stateMap[k][i]) {
        flipDigit(unitMap[k][i], stateMap[k][i] === -1 ? digit : stateMap[k][i], digit);
        stateMap[k][i] = digit;
      }
    });
  }
}

/* ─── TOAST ─── */
let toastTimer = null;
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), duration);
}

/* ═══════════════════════════════════════════════════════
   SISTEMA DE SKINS (LAYOUTS DO RELÓGIO)
   ═══════════════════════════════════════════════════════ */
function rebuildAllDigits() {
  const clockUnitsContainer = {
    h: document.getElementById('h'),
    m: document.getElementById('m'),
    s: document.getElementById('s')
  };
  const swUnitsContainer = {
    m: document.getElementById('sw-m'),
    s: document.getElementById('sw-s'),
    cs: document.getElementById('sw-cs')
  };
  const tmUnitsContainer = {
    h: document.getElementById('tm-h'),
    m: document.getElementById('tm-m'),
    s: document.getElementById('tm-s')
  };

  // Re-cria os cards com a estrutura da nova skin
  for (const k in clockUnits) {
    clockUnits[k] = buildUnit(clockUnitsContainer[k]);
    clockState[k] = [-1, -1];
  }
  for (const k in swUnits) {
    swUnits[k] = buildUnit(swUnitsContainer[k]);
    swState[k] = [-1, -1];
  }
  for (const k in tmUnits) {
    tmUnits[k] = buildUnit(tmUnitsContainer[k]);
    tmState[k] = [-1, -1];
  }

  // Atualiza imediatamente
  tickClock();
  
  const swTotal = swElapsed + (swRunning ? (performance.now() - swStartTime) : 0);
  updateDigits(swUnits, swState, {
    m:  pad(Math.floor(swTotal / 60000) % 100).split(''),
    s:  pad(Math.floor(swTotal / 1000) % 60).split(''),
    cs: pad(Math.floor(swTotal / 10) % 100).split('')
  });

  const tmLeft = tmRunning ? (tmEndTime - performance.now()) : tmRemaining;
  tmRenderMs(Math.max(0, tmLeft));
}

function buildSkinsPanel() {
  const grid = document.getElementById('skins-grid');
  grid.innerHTML = '';
  const skins = SkinsEngine.getSkins();
  const currentId = SkinsEngine.getCurrentId();

  skins.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = 'theme-swatch';
    btn.classList.toggle('active', skin.id === currentId);
    btn.dataset.skinId = skin.id;
    btn.title = skin.name;

    btn.innerHTML = `
      <div class="swatch-preview" style="background: var(--card); color: var(--text); font-size: 20px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-mid);">
        ${skin.icon}
      </div>
      <div class="swatch-name">${skin.name}</div>`;

    btn.addEventListener('click', () => {
      SkinsEngine.apply(skin.id);
      buildSkinsPanel();
      rebuildAllDigits();
      closeSkinsPanel();
      showToast(`Interface: ${skin.name}`);
    });
    grid.appendChild(btn);
  });
}

function openSkinsPanel() {
  document.getElementById('skins-panel').classList.add('open');
  closeThemePanel();
}
function closeSkinsPanel() {
  document.getElementById('skins-panel').classList.remove('open');
}
function toggleSkinsPanel() {
  document.getElementById('skins-panel').classList.toggle('open');
  closeThemePanel();
}

/* ═══════════════════════════════════════════════════════
   SISTEMA DE TEMAS
   ═══════════════════════════════════════════════════════ */
const STORAGE_THEME_KEY = 'flipclock-theme';

function applyTheme(themeId) {
  // Carrega temas customizados se existirem
  CustomThemesEngine.loadThemes(window.THEMES);
  
  const theme = window.THEMES.find(t => t.id === themeId) || window.THEMES[0];
  const root  = document.documentElement;
  
  for (const [prop, val] of Object.entries(theme.vars)) {
    root.style.setProperty(prop, val);
  }
  
  // Marca o botão ativo no painel
  document.querySelectorAll('.theme-swatch[data-theme-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.themeId === theme.id);
  });
  
  localStorage.setItem(STORAGE_THEME_KEY, theme.id);

  // Efeitos animados
  const hasCustomBg = localStorage.getItem('custom-bg-data');
  if (theme.animated && theme.effect && !hasCustomBg) {
    EffectsEngine.start(theme.effect);
  } else {
    EffectsEngine.stop();
  }
}

function buildThemePanel() {
  const grid = document.getElementById('theme-grid');
  grid.innerHTML = '';
  
  // Carrega temas atualizados
  CustomThemesEngine.loadThemes(window.THEMES);

  window.THEMES.forEach(theme => {
    const swatch = document.createElement('button');
    swatch.className = 'theme-swatch';
    swatch.dataset.themeId = theme.id;
    swatch.title = theme.name;

    const [c1, c2, c3] = theme.preview;
    swatch.innerHTML = `
      <div class="swatch-preview" style="background:${c1}">
        <div class="swatch-card" style="background:${c2}">
          <span style="color:${c3}">8</span>
        </div>
      </div>
      <div class="swatch-name">${theme.name}</div>`;

    // Botão de deletar se for customizado
    if (theme.isCustom) {
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-delete-theme';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Excluir tema';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Deseja excluir o tema "${theme.name}"?`)) {
          const activeThemeId = localStorage.getItem(STORAGE_THEME_KEY);
          CustomThemesEngine.deleteTheme(theme.id);
          buildThemePanel();
          if (activeThemeId === theme.id) {
            applyTheme('obsidian');
          }
          showToast(`Tema "${theme.name}" removido`);
        }
      });
      swatch.appendChild(delBtn);
    }

    swatch.addEventListener('click', () => {
      applyTheme(theme.id);
      closeThemePanel();
      showToast(`Tema: ${theme.name}`);
    });
    grid.appendChild(swatch);
  });

  // Marca ativo
  const savedThemeId = localStorage.getItem(STORAGE_THEME_KEY) || window.THEMES[0].id;
  document.querySelectorAll('.theme-swatch[data-theme-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.themeId === savedThemeId);
  });
}

function openThemePanel() {
  document.getElementById('theme-panel').classList.add('open');
  closeSkinsPanel();
}
function closeThemePanel() {
  document.getElementById('theme-panel').classList.remove('open');
}
function toggleThemePanel() {
  document.getElementById('theme-panel').classList.toggle('open');
  closeSkinsPanel();
}

// Fechar painéis clicando fora
document.addEventListener('click', (e) => {
  const tPanel  = document.getElementById('theme-panel');
  const btnThm = document.getElementById('btn-theme');
  const sPanel  = document.getElementById('skins-panel');
  const btnSkin = document.getElementById('btn-skin');

  if (tPanel.classList.contains('open') && !tPanel.contains(e.target) && e.target !== btnThm && !btnThm.contains(e.target)) {
    closeThemePanel();
  }
  if (sPanel.classList.contains('open') && !sPanel.contains(e.target) && e.target !== btnSkin && !btnSkin.contains(e.target)) {
    closeSkinsPanel();
  }
});

/* ═══════════════════════════════════════════════════════
   SISTEMA DE BACKGROUND PERSONALIZADO
   ═══════════════════════════════════════════════════════ */
function updateCustomBackground() {
  const bgData = localStorage.getItem('custom-bg-data');
  const opacity = localStorage.getItem('custom-bg-opacity') || '0.5';
  const blur = localStorage.getItem('custom-bg-blur') || '0';

  const bgEl = document.getElementById('custom-bg');
  const overlayEl = document.getElementById('custom-bg-overlay');
  
  if (bgData) {
    bgEl.style.backgroundImage = `url(${bgData})`;
    bgEl.style.filter = `blur(${blur}px)`;
    bgEl.style.display = 'block';
    overlayEl.style.opacity = opacity;
    overlayEl.style.display = 'block';
    
    // Desativa animações de fundo para não cobrir a imagem
    EffectsEngine.stop();
  } else {
    bgEl.style.backgroundImage = 'none';
    bgEl.style.display = 'none';
    overlayEl.style.display = 'none';
    
    // Re-inicia animação se o tema atual a exigir
    const savedThemeId = localStorage.getItem(STORAGE_THEME_KEY) || window.THEMES[0].id;
    const theme = window.THEMES.find(t => t.id === savedThemeId);
    if (theme && theme.animated && theme.effect) {
      EffectsEngine.start(theme.effect);
    }
  }

  // Sincroniza controles
  const opacityInput = document.getElementById('bg-opacity');
  const blurInput = document.getElementById('bg-blur');
  const opacityVal = document.getElementById('val-bg-opacity');
  const blurVal = document.getElementById('val-bg-blur');
  
  if (opacityInput) {
    opacityInput.value = opacity;
    opacityVal.textContent = Math.round(opacity * 100) + '%';
  }
  if (blurInput) {
    blurInput.value = blur;
    blurVal.textContent = blur + 'px';
  }
}

function initCustomBackgroundEvents() {
  const bgUpload = document.getElementById('bg-upload');
  const bgRemove = document.getElementById('bg-remove');
  const bgOpacity = document.getElementById('bg-opacity');
  const bgBlur = document.getElementById('bg-blur');

  bgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4.5 * 1024 * 1024) {
      showToast('Erro: Imagem muito grande (máx 4.5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        localStorage.setItem('custom-bg-data', event.target.result);
        updateCustomBackground();
        showToast('Background personalizado aplicado!');
      } catch (err) {
        showToast('Erro ao salvar (limite local excedido)');
      }
    };
    reader.readAsDataURL(file);
  });

  bgRemove.addEventListener('click', () => {
    localStorage.removeItem('custom-bg-data');
    updateCustomBackground();
    showToast('Background personalizado removido');
  });

  bgOpacity.addEventListener('input', (e) => {
    localStorage.setItem('custom-bg-opacity', e.target.value);
    updateCustomBackground();
  });

  bgBlur.addEventListener('input', (e) => {
    localStorage.setItem('custom-bg-blur', e.target.value);
    updateCustomBackground();
  });
}

/* ═══════════════════════════════════════════════════════
   CRIADOR DE TEMAS PERSONALIZADOS
   ═══════════════════════════════════════════════════════ */
function initThemeCreatorEvents() {
  const modal = document.getElementById('theme-modal');
  const btnCreate = document.getElementById('btn-create-theme');
  const btnClose = document.getElementById('modal-close-btn');
  const btnCancel = document.getElementById('theme-cancel-btn');
  const btnSave = document.getElementById('theme-save-btn');
  const nameInput = document.getElementById('theme-name-input');

  const pBg = document.getElementById('pick-bg');
  const pCard = document.getElementById('pick-card');
  const pCardBot = document.getElementById('pick-card-bot');
  const pText = document.getElementById('pick-text');
  const pMuted = document.getElementById('pick-muted');
  const pAccent = document.getElementById('pick-accent');

  function updatePreview() {
    const box = document.querySelector('.theme-preview-box');
    box.style.backgroundColor = pBg.value;
    
    document.querySelectorAll('.mini-card-container').forEach(card => {
      card.style.color = pText.value;
    });
    document.querySelectorAll('.mini-card-top').forEach(el => {
      el.style.backgroundColor = pCard.value;
      el.style.borderBottomColor = pMuted.value + '26';
    });
    document.querySelectorAll('.mini-card-bot').forEach(el => {
      el.style.backgroundColor = pCardBot.value;
      el.style.borderTopColor = pMuted.value + '26';
    });
    document.querySelectorAll('.mini-label, .mini-sep').forEach(el => {
      el.style.color = pMuted.value;
    });
  }

  btnCreate.addEventListener('click', () => {
    closeThemePanel();
    modal.classList.remove('hidden');
    nameInput.value = '';
    updatePreview();
  });

  const closeMod = () => modal.classList.add('hidden');
  btnClose.addEventListener('click', closeMod);
  btnCancel.addEventListener('click', closeMod);

  [pBg, pCard, pCardBot, pText, pMuted, pAccent].forEach(picker => {
    picker.addEventListener('input', updatePreview);
  });

  btnSave.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      showToast('Insira um nome para o tema');
      return;
    }

    const vars = {
      '--bg':          pBg.value,
      '--card':        pCard.value,
      '--card-bot':    pCardBot.value,
      '--border':      pMuted.value + '15',
      '--border-mid':  pMuted.value + '26',
      '--text':        pText.value,
      '--muted':       pMuted.value,
      '--accent':      pAccent.value,
      '--accent-glow': pAccent.value + '59'
    };

    try {
      const theme = CustomThemesEngine.saveTheme(name, vars);
      buildThemePanel();
      closeMod();
      applyTheme(theme.id);
      showToast(`Tema "${name}" criado!`);
    } catch(err) {
      showToast(err.message);
    }
  });
}

/* ═══════════════════════════════════════════════════════
   MODO ZEN (clean mode)
   ═══════════════════════════════════════════════════════ */
let zenMode = false;

function setZen(on) {
  zenMode = on;
  document.body.classList.toggle('zen', on);
  const hint = document.getElementById('zen-hint');
  if (on) {
    hint.classList.add('visible');
    setTimeout(() => hint.classList.remove('visible'), 3000);
  } else {
    hint.classList.remove('visible');
  }
}

function toggleZen() { setZen(!zenMode); }

/* ═══════════════════════════════════════════════════════
   NAVEGAÇÃO
   ═══════════════════════════════════════════════════════ */
const PAGES = ['clock', 'stopwatch', 'timer'];
let currentPage = 'clock';

function showPage(name) {
  if (!PAGES.includes(name)) return;
  PAGES.forEach(p => {
    document.getElementById(`page-${p}`).classList.toggle('hidden', p !== name);
  });
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === name);
  });
  currentPage = name;
}

// Sidebar nav buttons
document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

document.getElementById('btn-theme').addEventListener('click', toggleThemePanel);
document.getElementById('btn-skin').addEventListener('click', toggleSkinsPanel);
document.getElementById('btn-clean').addEventListener('click', toggleZen);

/* ═══════════════════════════════════════════════════════
   ATALHOS DE TECLADO
   ═══════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;

  switch (e.key) {
    case '1': showPage('clock');      break;
    case '2': showPage('stopwatch');  break;
    case '3': showPage('timer');      break;
    case 'z':
    case 'Z':
    case 'f':
    case 'F': toggleZen();            break;
    case 't':
    case 'T': toggleThemePanel();     break;
    case 's':
    case 'S': toggleSkinsPanel();     break;
    case 'Escape':
      if (zenMode) setZen(false);
      closeThemePanel();
      closeSkinsPanel();
      document.getElementById('theme-modal').classList.add('hidden');
      break;
  }
});

/* ═══════════════════════════════════════════════════════
   INICIALIZAÇÃO DO MOTOR DE SKINS E UNIDADES
   ═══════════════════════════════════════════════════════ */
// 1. Aplica a skin ativa
const activeSkinId = SkinsEngine.getCurrentId();
SkinsEngine.apply(activeSkinId);

// 2. Inicializa o canvas de efeitos
EffectsEngine.init('fx-canvas');

// 3. Inicializa as unidades dos relógios
const clockState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const clockUnits = {
  h: buildUnit(document.getElementById('h')),
  m: buildUnit(document.getElementById('m')),
  s: buildUnit(document.getElementById('s'))
};

const swState = { m: [-1,-1], s: [-1,-1], cs: [-1,-1] };
const swUnits = {
  m:  buildUnit(document.getElementById('sw-m')),
  s:  buildUnit(document.getElementById('sw-s')),
  cs: buildUnit(document.getElementById('sw-cs'))
};

const tmState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const tmUnits = {
  h: buildUnit(document.getElementById('tm-h')),
  m: buildUnit(document.getElementById('tm-m')),
  s: buildUnit(document.getElementById('tm-s'))
};

/* ═══════════════════════════════════════════════════════
   RELÓGIO LOGIC
   ═══════════════════════════════════════════════════════ */
const dateEl = document.getElementById('date-display');
const DAYS   = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
let lastDate = -1;

function tickClock() {
  const now = new Date();
  updateDigits(clockUnits, clockState, {
    h: pad(now.getHours()).split(''),
    m: pad(now.getMinutes()).split(''),
    s: pad(now.getSeconds()).split('')
  });
  const day = now.getDate();
  if (day !== lastDate && dateEl) {
    lastDate = day;
    dateEl.textContent = `${DAYS[now.getDay()]} , ${day} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  }
}
tickClock();
setInterval(tickClock, 1000);

/* ═══════════════════════════════════════════════════════
   CRONÔMETRO LOGIC
   ═══════════════════════════════════════════════════════ */
let swRunning = false, swStartTime = 0, swElapsed = 0, swRaf = null;
const btnSwStart = document.getElementById('sw-startstop');
const btnSwReset = document.getElementById('sw-reset');

function tickStopwatch() {
  const total = swElapsed + (performance.now() - swStartTime);
  updateDigits(swUnits, swState, {
    m:  pad(Math.floor(total / 60000) % 100).split(''),
    s:  pad(Math.floor(total / 1000) % 60).split(''),
    cs: pad(Math.floor(total / 10) % 100).split('')
  });
  swRaf = requestAnimationFrame(tickStopwatch);
}

btnSwStart.addEventListener('click', () => {
  if (!swRunning) {
    swStartTime = performance.now();
    swRaf = requestAnimationFrame(tickStopwatch);
    btnSwStart.textContent = 'pausar';
    btnSwStart.classList.add('running');
  } else {
    cancelAnimationFrame(swRaf);
    swElapsed += performance.now() - swStartTime;
    btnSwStart.textContent = 'continuar';
    btnSwStart.classList.remove('running');
  }
  swRunning = !swRunning;
});

btnSwReset.addEventListener('click', () => {
  cancelAnimationFrame(swRaf);
  swRunning = false; swElapsed = 0;
  btnSwStart.textContent = 'iniciar';
  btnSwStart.classList.remove('running');
  for (const k in swState) swState[k] = [-1,-1];
  updateDigits(swUnits, swState, { m: ['0','0'], s: ['0','0'], cs: ['0','0'] });
  for (const k in swState) swState[k] = ['0','0'];
});

/* ═══════════════════════════════════════════════════════
   TEMPORIZADOR + ALARME LOGIC
   ═══════════════════════════════════════════════════════ */
const tmSetup    = document.getElementById('tm-setup');
const tmInputH   = document.getElementById('tm-input-h');
const tmInputM   = document.getElementById('tm-input-m');
const tmInputS   = document.getElementById('tm-input-s');
const btnTmStart = document.getElementById('tm-startstop');
const btnTmReset = document.getElementById('tm-reset');

let tmRunning = false, tmRaf = null, tmEndTime = 0, tmRemaining = 0, tmDone = false;
let alarmInterval = null;

// Áudio sintetizado via Web Audio API
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playBeep(freq = 880, duration = 0.15, gain = 0.4) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* silencia se Web Audio não disponível */ }
}

function playAlarmPattern() {
  playBeep(880, 0.12, 0.5);
  setTimeout(() => playBeep(880, 0.12, 0.5), 180);
  setTimeout(() => playBeep(1100, 0.25, 0.6), 360);
}

function triggerAlarm() {
  const overlay = document.getElementById('alarm-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('ringing');

  playAlarmPattern();
  alarmInterval = setInterval(playAlarmPattern, 1800);

  if (zenMode) setZen(false);
  showPage('timer');

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('⏰ Flip Clock', { body: 'Seu temporizador chegou ao fim!' });
  }
}

function dismissAlarm() {
  clearInterval(alarmInterval);
  document.getElementById('alarm-overlay').classList.add('hidden');
  document.getElementById('alarm-overlay').classList.remove('ringing');
}

document.getElementById('alarm-dismiss').addEventListener('click', dismissAlarm);
document.getElementById('alarm-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) dismissAlarm();
});

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

function tmTotalFromInputs() {
  const h = Math.max(0, parseInt(tmInputH.value) || 0);
  const m = Math.max(0, parseInt(tmInputM.value) || 0);
  const s = Math.max(0, parseInt(tmInputS.value) || 0);
  return (h * 3600 + m * 60 + s) * 1000;
}

function tmRenderMs(ms) {
  const totalS = Math.ceil(ms / 1000);
  updateDigits(tmUnits, tmState, {
    h: pad(Math.floor(totalS / 3600) % 100).split(''),
    m: pad(Math.floor(totalS / 60) % 60).split(''),
    s: pad(totalS % 60).split('')
  });
}

function tmTick() {
  const left = tmEndTime - performance.now();
  if (left <= 0) {
    tmRenderMs(0);
    tmDone    = true;
    tmRunning = false;
    btnTmStart.textContent = 'iniciar';
    btnTmStart.classList.remove('running');
    document.querySelectorAll('#page-timer .card .slot-digit, #page-timer .card span, #page-timer .card .neon-digit, #page-timer .card .term-digit, #page-timer .card .seg.on').forEach(el => el.classList.add('done'));
    triggerAlarm();
    return;
  }
  tmRenderMs(left);
  tmRaf = requestAnimationFrame(tmTick);
}

[tmInputH, tmInputM, tmInputS].forEach(inp => {
  inp.addEventListener('input', () => {
    if (!tmRunning && !tmDone) {
      for (const k in tmState) tmState[k] = [-1,-1];
      tmRenderMs(tmTotalFromInputs());
    }
  });
});

btnTmStart.addEventListener('click', () => {
  if (tmDone) return;
  if (!tmRunning) {
    if (tmRemaining === 0) {
      tmRemaining = tmTotalFromInputs();
      if (tmRemaining <= 0) return;
    }
    tmSetup.classList.add('hidden');
    [tmInputH, tmInputM, tmInputS].forEach(i => i.disabled = true);
    tmEndTime = performance.now() + tmRemaining;
    tmRaf = requestAnimationFrame(tmTick);
    btnTmStart.textContent = 'pausar';
    btnTmStart.classList.add('running');
    document.querySelectorAll('#page-timer .card .slot-digit, #page-timer .card span, #page-timer .card .neon-digit, #page-timer .card .term-digit, #page-timer .card .seg.on').forEach(el => el.classList.remove('done'));
  } else {
    cancelAnimationFrame(tmRaf);
    tmRemaining = tmEndTime - performance.now();
    btnTmStart.textContent = 'continuar';
    btnTmStart.classList.remove('running');
  }
  tmRunning = !tmRunning;
});

btnTmReset.addEventListener('click', () => {
  cancelAnimationFrame(tmRaf);
  dismissAlarm();
  tmRunning = false; tmDone = false; tmRemaining = 0;
  btnTmStart.textContent = 'iniciar';
  btnTmStart.classList.remove('running');
  [tmInputH, tmInputM, tmInputS].forEach(i => { i.disabled = false; i.value = 0; });
  tmSetup.classList.remove('hidden');
  document.querySelectorAll('#page-timer .card .slot-digit, #page-timer .card span, #page-timer .card .neon-digit, #page-timer .card .term-digit, #page-timer .card .seg.on').forEach(el => el.classList.remove('done'));
  for (const k in tmState) tmState[k] = [-1,-1];
  tmRenderMs(0);
});

tmRenderMs(0);

/* ═══════════════════════════════════════════════════════
   INICIALIZAÇÃO DO PAINEL E APLICAÇÃO DE TEMAS
   ═══════════════════════════════════════════════════════ */
buildThemePanel();
buildSkinsPanel();
initCustomBackgroundEvents();
initThemeCreatorEvents();

// Aplica fundo customizado do localStorage
updateCustomBackground();

// Carrega e aplica tema salvo
const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || window.THEMES[0].id;
applyTheme(savedTheme);
