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
  const top   = card.querySelector('.card-top span');
  const bot   = card.querySelector('.card-bot span');
  const ft    = card.querySelector('.flip-top');
  const fb    = card.querySelector('.flip-bot');

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

/* ─── RELÓGIO ─── */
const clockState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const clockUnits = {
  h:  buildUnit(document.getElementById('h')),
  m:  buildUnit(document.getElementById('m')),
  s:  buildUnit(document.getElementById('s'))
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
    const dow = DAYS[now.getDay()];
    const mon = MONTHS[now.getMonth()];
    dateEl.textContent = `${dow}, ${day} de ${mon} de ${now.getFullYear()}`;
  }
}

tickClock();
setInterval(tickClock, 1000);

/* ─── CRONÔMETRO ─── */
const swState = { m: [-1,-1], s: [-1,-1], cs: [-1,-1] };
const swUnits = {
  m:  buildUnit(document.getElementById('sw-m')),
  s:  buildUnit(document.getElementById('sw-s')),
  cs: buildUnit(document.getElementById('sw-cs'))
};

let swRunning   = false;
let swStartTime = 0;
let swElapsed   = 0;
let swRaf       = null;

const btnStartStop = document.getElementById('sw-startstop');
const btnReset     = document.getElementById('sw-reset');

function tickStopwatch() {
  const total = swElapsed + (performance.now() - swStartTime);
  const cs    = Math.floor(total / 10) % 100;
  const s     = Math.floor(total / 1000) % 60;
  const m     = Math.floor(total / 60000) % 100;

  updateDigits(swUnits, swState, {
    m:  pad(m).split(''),
    s:  pad(s).split(''),
    cs: pad(cs).split('')
  });

  swRaf = requestAnimationFrame(tickStopwatch);
}

btnStartStop.addEventListener('click', () => {
  if (!swRunning) {
    swStartTime = performance.now();
    swRaf = requestAnimationFrame(tickStopwatch);
    btnStartStop.textContent = 'pausar';
    btnStartStop.classList.add('running');
  } else {
    cancelAnimationFrame(swRaf);
    swElapsed += performance.now() - swStartTime;
    btnStartStop.textContent = 'continuar';
    btnStartStop.classList.remove('running');
  }
  swRunning = !swRunning;
});

btnReset.addEventListener('click', () => {
  cancelAnimationFrame(swRaf);
  swRunning = false;
  swElapsed = 0;
  btnStartStop.textContent = 'iniciar';
  btnStartStop.classList.remove('running');

  // reset visual
  for (const k in swState) swState[k] = [-1,-1];
  updateDigits(swUnits, swState, { m: ['0','0'], s: ['0','0'], cs: ['0','0'] });
  for (const k in swState) swState[k] = ['0','0'];
});

/* ─── NAVEGAÇÃO ─── */
const pageClock     = document.getElementById('page-clock');
const pageStopwatch = document.getElementById('page-stopwatch');
const fab           = document.getElementById('fab');
let onClock = true;

fab.addEventListener('click', () => {
  onClock = !onClock;
  pageClock.classList.toggle('hidden', !onClock);
  pageStopwatch.classList.toggle('hidden', onClock);
  fab.classList.toggle('active', !onClock);
});

/* ─── TEMPORIZADOR ─── */
const tmState = { h: [-1,-1], m: [-1,-1], s: [-1,-1] };
const tmUnits = {
  h: buildUnit(document.getElementById('tm-h')),
  m: buildUnit(document.getElementById('tm-m')),
  s: buildUnit(document.getElementById('tm-s'))
};

const tmSetup      = document.getElementById('tm-setup');
const tmInputH     = document.getElementById('tm-input-h');
const tmInputM     = document.getElementById('tm-input-m');
const tmInputS     = document.getElementById('tm-input-s');
const btnTmStart   = document.getElementById('tm-startstop');
const btnTmReset   = document.getElementById('tm-reset');

let tmRunning    = false;
let tmRaf        = null;
let tmEndTime    = 0;      // timestamp absoluto (ms) quando o timer chega a zero
let tmRemaining  = 0;      // ms restantes ao pausar
let tmDone       = false;

function tmTotalFromInputs() {
  const h = Math.max(0, parseInt(tmInputH.value) || 0);
  const m = Math.max(0, parseInt(tmInputM.value) || 0);
  const s = Math.max(0, parseInt(tmInputS.value) || 0);
  return (h * 3600 + m * 60 + s) * 1000;
}

function tmRenderMs(ms) {
  const totalS = Math.ceil(ms / 1000);
  const h = Math.floor(totalS / 3600) % 100;
  const m = Math.floor(totalS / 60) % 60;
  const s = totalS % 60;

  updateDigits(tmUnits, tmState, {
    h: pad(h).split(''),
    m: pad(m).split(''),
    s: pad(s).split('')
  });
}

function tmTick() {
  const left = tmEndTime - performance.now();

  if (left <= 0) {
    tmRenderMs(0);
    tmDone = true;
    tmRunning = false;
    btnTmStart.textContent = 'iniciar';
    btnTmStart.classList.remove('running');
    // pisca os cards
    document.querySelectorAll('#page-timer .card span').forEach(el => el.classList.add('done'));
    return;
  }

  tmRenderMs(left);
  tmRaf = requestAnimationFrame(tmTick);
}

// Renderiza o display assim que o usuário edita os inputs
[tmInputH, tmInputM, tmInputS].forEach(inp => {
  inp.addEventListener('input', () => {
    if (!tmRunning && !tmDone) {
      const ms = tmTotalFromInputs();
      // reseta estado pra forçar re-render
      for (const k in tmState) tmState[k] = [-1,-1];
      tmRenderMs(ms);
    }
  });
});

btnTmStart.addEventListener('click', () => {
  if (tmDone) return; // precisa dar reset primeiro

  if (!tmRunning) {
    // Primeira vez ou retomando
    if (tmRemaining === 0) {
      tmRemaining = tmTotalFromInputs();
      if (tmRemaining <= 0) return;
    }
    // Esconde inputs durante a contagem
    tmSetup.classList.add('hidden');
    [tmInputH, tmInputM, tmInputS].forEach(i => i.disabled = true);

    tmEndTime = performance.now() + tmRemaining;
    tmRaf = requestAnimationFrame(tmTick);
    btnTmStart.textContent = 'pausar';
    btnTmStart.classList.add('running');
    // limpa piscar
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
  tmRunning   = false;
  tmDone      = false;
  tmRemaining = 0;
  btnTmStart.textContent = 'iniciar';
  btnTmStart.classList.remove('running');
  [tmInputH, tmInputM, tmInputS].forEach(i => { i.disabled = false; i.value = 0; });
  tmSetup.classList.remove('hidden');
  document.querySelectorAll('#page-timer .card span').forEach(el => el.classList.remove('done'));
  for (const k in tmState) tmState[k] = [-1,-1];
  tmRenderMs(0);
});

// Render inicial
tmRenderMs(0);

/* ─── NAVEGAÇÃO (atualizada para 3 páginas) ─── */
const pageTimer  = document.getElementById('page-timer');
const fabTimer   = document.getElementById('fab-timer');

// O fab e pageClock/pageStopwatch já estão declarados acima no script original
// Precisamos substituir o listener antigo — usamos uma flag de página: 'clock' | 'stopwatch' | 'timer'
let currentPage = 'clock';

function showPage(name) {
  pageClock.classList.toggle('hidden',     name !== 'clock');
  pageStopwatch.classList.toggle('hidden', name !== 'stopwatch');
  pageTimer.classList.toggle('hidden',     name !== 'timer');
  fab.classList.toggle('active',      name === 'stopwatch');
  fabTimer.classList.toggle('active', name === 'timer');
  currentPage = name;
}

// remove listener antigo do fab (substituímos a lógica)
fab.replaceWith(fab.cloneNode(true));
const fabNew = document.getElementById('fab');

fabNew.addEventListener('click', () => {
  showPage(currentPage === 'stopwatch' ? 'clock' : 'stopwatch');
});

fabTimer.addEventListener('click', () => {
  showPage(currentPage === 'timer' ? 'clock' : 'timer');
});
