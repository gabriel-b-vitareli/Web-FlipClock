/* ═══════════════════════════════════════════════════════
   FLIP CLOCK — script.js
   ═══════════════════════════════════════════════════════ */

/* ─── UTILS ─── */
function pad(n) { return String(n).padStart(2, '0'); }

function buildUnit(el) {
  el.innerHTML = '';
  return [0, 1].map(() => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `
      <div class="card-top"><span>0</span></div>
      <div class="card-bot"><span>0</span></div>
      <div class="flip-top"><span>0</span></div>
      <div class="flip-bot"><span>0</span></div>`;
    el.appendChild(c);
    return c;
  });
}

function flipDigit(card, from, to) {
  const top = card.querySelector('.card-top span');
  const bot = card.querySelector('.card-bot span');
  const ft  = card.querySelector('.flip-top');
  const fb  = card.querySelector('.flip-bot');

  top.textContent = to;
  bot.textContent = to;
  ft.querySelector('span').textContent = from;
  fb.querySelector('span').textContent = to;

  ft.style.transition = 'none';
  fb.style.transition = 'none';
  ft.style.transform  = 'rotateX(0deg)';
  fb.style.transform  = 'rotateX(90deg)';

  ft.offsetHeight; // reflow

  ft.style.transition = 'transform 0.25s ease-in';
  fb.style.transition = 'transform 0.25s ease-out 0.12s';
  ft.style.transform  = 'rotateX(-90deg)';
  fb.style.transform  = 'rotateX(0deg)';
}

function updateDigits(unitMap, stateMap, vals) {
  for (const k in vals) {
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
   SISTEMA DE TEMAS
   ═══════════════════════════════════════════════════════ */
const STORAGE_THEME_KEY = 'flipclock-theme';

function applyTheme(themeId) {
  const theme = window.THEMES.find(t => t.id === themeId) || window.THEMES[0];
  const root  = document.documentElement;
  for (const [prop, val] of Object.entries(theme.vars)) {
    root.style.setProperty(prop, val);
  }
  // Marca o botão ativo no painel
  document.querySelectorAll('.theme-swatch').forEach(el => {
    el.classList.toggle('active', el.dataset.themeId === theme.id);
  });
  localStorage.setItem(STORAGE_THEME_KEY, theme.id);
}

function buildThemePanel() {
  const grid = document.getElementById('theme-grid');
  grid.innerHTML = '';
  window.THEMES.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'theme-swatch';
    btn.dataset.themeId = theme.id;
    btn.title = theme.name;

    // Preview de 3 cores (bg, card, text)
    const [c1, c2, c3] = theme.preview;
    btn.innerHTML = `
      <div class="swatch-preview" style="background:${c1}">
        <div class="swatch-card" style="background:${c2}">
          <span style="color:${c3}">8</span>
        </div>
      </div>
      <div class="swatch-name">${theme.name}</div>`;

    btn.addEventListener('click', () => {
      applyTheme(theme.id);
      closeThemePanel();
      showToast(`Tema: ${theme.name}`);
    });
    grid.appendChild(btn);
  });
}

function openThemePanel() {
  document.getElementById('theme-panel').classList.add('open');
}
function closeThemePanel() {
  document.getElementById('theme-panel').classList.remove('open');
}
function toggleThemePanel() {
  document.getElementById('theme-panel').classList.toggle('open');
}

// Fechar clicando fora
document.addEventListener('click', (e) => {
  const panel  = document.getElementById('theme-panel');
  const btnThm = document.getElementById('btn-theme');
  if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btnThm && !btnThm.contains(e.target)) {
    closeThemePanel();
  }
});

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
document.getElementById('btn-clean').addEventListener('click', toggleZen);

/* ═══════════════════════════════════════════════════════
   ATALHOS DE TECLADO
   ═══════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Ignora se estiver digitando num input
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
    case 'Escape':
      if (zenMode) setZen(false);
      closeThemePanel();
      break;
  }
});

/* ═══════════════════════════════════════════════════════
   RELÓGIO
   ═══════════════════════════════════════════════════════ */
const clockState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const clockUnits = {
  h: buildUnit(document.getElementById('h')),
  m: buildUnit(document.getElementById('m')),
  s: buildUnit(document.getElementById('s'))
};

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
  if (day !== lastDate) {
    lastDate = day;
    dateEl.textContent = `${DAYS[now.getDay()]}, ${day} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  }
}
tickClock();
setInterval(tickClock, 1000);

/* ═══════════════════════════════════════════════════════
   CRONÔMETRO
   ═══════════════════════════════════════════════════════ */
const swState = { m: [-1,-1], s: [-1,-1], cs: [-1,-1] };
const swUnits = {
  m:  buildUnit(document.getElementById('sw-m')),
  s:  buildUnit(document.getElementById('sw-s')),
  cs: buildUnit(document.getElementById('sw-cs'))
};

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
   TEMPORIZADOR + ALARME
   ═══════════════════════════════════════════════════════ */
const tmState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const tmUnits = {
  h: buildUnit(document.getElementById('tm-h')),
  m: buildUnit(document.getElementById('tm-m')),
  s: buildUnit(document.getElementById('tm-s'))
};

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
  // Toca um padrão de 3 bips
  playBeep(880, 0.12, 0.5);
  setTimeout(() => playBeep(880, 0.12, 0.5), 180);
  setTimeout(() => playBeep(1100, 0.25, 0.6), 360);
}

function triggerAlarm() {
  const overlay = document.getElementById('alarm-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('ringing');

  // Toca o padrão e repete enquanto o overlay estiver aberto
  playAlarmPattern();
  alarmInterval = setInterval(playAlarmPattern, 1800);

  // Se estiver em zen mode, sai pra mostrar o overlay
  if (zenMode) setZen(false);

  // Navega pra página do timer caso o usuário esteja em outra
  showPage('timer');

  // Notificação de sistema (se permitido)
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

// Pede permissão de notificação ao carregar
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
    document.querySelectorAll('#page-timer .card span').forEach(el => el.classList.add('done'));
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
    document.querySelectorAll('#page-timer .card span').forEach(el => el.classList.remove('done'));
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
  document.querySelectorAll('#page-timer .card span').forEach(el => el.classList.remove('done'));
  for (const k in tmState) tmState[k] = [-1,-1];
  tmRenderMs(0);
});

tmRenderMs(0);

/* ═══════════════════════════════════════════════════════
   INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════ */
buildThemePanel();
const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || window.THEMES[0].id;
applyTheme(savedTheme);
