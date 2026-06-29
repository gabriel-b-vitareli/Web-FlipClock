/**
 * SISTEMA DE SKINS / INTERFACES
 * ─────────────────────────────────────────────────────────────
 * Define como os dígitos do relógio/timer/cronômetro são renderizados.
 * Totalmente independente dos temas de cor.
 * ─────────────────────────────────────────────────────────────
 */

(function() {
  const STORAGE_SKIN_KEY = 'flipclock-skin';

  const skinsList = [
    { id: 'classic', name: 'Classic Flip', icon: '🎴' },
    { id: 'nixie', name: 'Nixie Tube', icon: '💡' },
    { id: 'segment', name: 'Segment LCD', icon: '📟' },
    { id: 'neon', name: 'Neon Ring', icon: '🔵' },
    { id: 'terminal', name: 'Terminal', icon: '⌨️' },
    { id: 'slots', name: 'Slot Machine', icon: '🎰' }
  ];

  // 1. SKIN CLASSIC FLIP
  const classicSkin = {
    buildDigit(container) {
      container.innerHTML = `
        <div class="card-top"><span>0</span></div>
        <div class="card-bot"><span>0</span></div>
        <div class="flip-top"><span>0</span></div>
        <div class="flip-bot"><span>0</span></div>
      `;
    },
    setDigit(card, value) {
      card.querySelectorAll('span').forEach(el => el.textContent = value);
    },
    updateDigit(card, from, to) {
      const top = card.querySelector('.card-top span');
      const bot = card.querySelector('.card-bot span');
      const ft  = card.querySelector('.flip-top');
      const fb  = card.querySelector('.flip-bot');

      if (!top || !bot || !ft || !fb) {
        this.buildDigit(card);
        this.setDigit(card, to);
        return;
      }

      top.textContent = to;
      bot.textContent = to;
      ft.querySelector('span').textContent = from;
      fb.querySelector('span').textContent = to;

      ft.style.transition = 'none';
      fb.style.transition = 'none';
      ft.style.transform  = 'rotateX(0deg)';
      fb.style.transform  = 'rotateX(90deg)';

      card.offsetHeight; // reflow

      ft.style.transition = 'transform 0.25s ease-in';
      fb.style.transition = 'transform 0.25s ease-out 0.12s';
      ft.style.transform  = 'rotateX(-90deg)';
      fb.style.transform  = 'rotateX(0deg)';
    },
    getCSS() {
      return `
        .skin-classic .card { perspective: 600px; }
        .skin-classic .card-top, .skin-classic .card-bot, .skin-classic .flip-top, .skin-classic .flip-bot {
          position: absolute; left: 0; width: 100%; height: 50%; overflow: hidden;
          display: flex; justify-content: center; backface-visibility: hidden;
        }
        .skin-classic .card-top, .skin-classic .flip-top {
          top: 0; background: var(--card); border-radius: 8px 8px 0 0;
          border: 1px solid var(--border); border-bottom: 0.5px solid var(--border-mid);
          align-items: flex-start;
        }
        .skin-classic .card-bot, .skin-classic .flip-bot {
          bottom: 0; background: var(--card-bot); border-radius: 0 0 8px 8px;
          border: 1px solid var(--border); border-top: 0.5px solid var(--border-mid);
          align-items: flex-end;
        }
        .skin-classic .card span {
          position: absolute; left: 50%; transform: translateX(-50%);
          font-size: 75px; line-height: var(--card-height);
        }
        .skin-classic .card-top span, .skin-classic .flip-top span { top: 0; }
        .skin-classic .card-bot span, .skin-classic .flip-bot span { bottom: 0; }
        .skin-classic .flip-top { transform-origin: bottom; z-index: 3; }
        .skin-classic .flip-bot { transform-origin: top; transform: rotateX(90deg); z-index: 2; }
      `;
    }
  };

  // 2. SKIN NIXIE TUBE (Melhorada)
  const nixieSkin = {
    buildDigit(container) {
      container.innerHTML = `<span class="nixie-digit">0</span>`;
    },
    setDigit(card, value) {
      const el = card.querySelector('.nixie-digit');
      if (el) el.textContent = value;
    },
    updateDigit(card, from, to) {
      const el = card.querySelector('.nixie-digit');
      if (!el) {
        this.buildDigit(card);
        this.setDigit(card, to);
        return;
      }
      el.classList.add('fading');
      setTimeout(() => {
        el.textContent = to;
        el.classList.remove('fading');
      }, 120);
    },
    getCSS() {
      return `
        .skin-nixie .card {
          background: rgba(10, 10, 14, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-top-color: rgba(255, 255, 255, 0.16);
          border-radius: 35px 35px 8px 8px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          position: relative; box-shadow: inset 0 2px 6px rgba(255,255,255,0.08), inset 0 -8px 15px rgba(0,0,0,0.9), 0 8px 16px rgba(0,0,0,0.5);
        }
        .skin-nixie .card::before {
          content: ''; position: absolute; inset: 4px; border-radius: 31px 31px 4px 4px;
          background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.35; pointer-events: none; z-index: 2;
        }
        .skin-nixie .card::after {
          content: ''; position: absolute; bottom: 0; left: 15%; right: 15%; height: 25%;
          background: radial-gradient(ellipse at center bottom, var(--accent-glow), transparent 75%);
          pointer-events: none; opacity: 0.8; z-index: 0;
        }
        .skin-nixie .nixie-digit {
          position: static !important;
          transform: none !important;
          font-family: 'Oswald', 'Bebas Neue', sans-serif;
          font-size: 74px; line-height: var(--card-height); color: var(--text);
          text-shadow: 0 0 6px var(--accent-glow), 0 0 15px var(--accent-glow), 0 0 28px var(--accent-glow);
          transition: opacity 0.12s ease; position: relative; z-index: 1;
        }
        .skin-nixie .nixie-digit.fading { opacity: 0.1; }
        .skin-nixie .nixie-digit.done {
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent), 0 0 25px var(--accent);
        }
      `;
    }
  };

  // 3. SKIN SEGMENT LCD (Melhorada)
  const segmentSkin = {
    buildDigit(container) {
      container.innerHTML = `
        <div class="seg seg-h seg-a off"></div>
        <div class="seg seg-v seg-f off"></div>
        <div class="seg seg-v seg-b off"></div>
        <div class="seg seg-h seg-g off"></div>
        <div class="seg seg-v seg-e off"></div>
        <div class="seg seg-v seg-c off"></div>
        <div class="seg seg-h seg-d off"></div>
      `;
    },
    segMap: {
      '0': ['a', 'b', 'c', 'd', 'e', 'f'],
      '1': ['b', 'c'],
      '2': ['a', 'b', 'd', 'e', 'g'],
      '3': ['a', 'b', 'c', 'd', 'g'],
      '4': ['b', 'c', 'f', 'g'],
      '5': ['a', 'c', 'd', 'f', 'g'],
      '6': ['a', 'c', 'd', 'e', 'f', 'g'],
      '7': ['a', 'b', 'c'],
      '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      '9': ['a', 'b', 'c', 'd', 'f', 'g']
    },
    setDigit(card, value) {
      const activeSegs = this.segMap[value] || [];
      const segs = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      segs.forEach(s => {
        const segEl = card.querySelector(`.seg-${s}`);
        if (segEl) {
          const isOn = activeSegs.includes(s);
          segEl.classList.toggle('on', isOn);
          segEl.classList.toggle('off', !isOn);
        }
      });
    },
    updateDigit(card, from, to) {
      this.setDigit(card, to);
    },
    getCSS() {
      return `
        .skin-segment .card {
          background: #111314; border: 1.5px solid var(--border-mid); border-radius: 8px;
          position: relative; overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.4);
        }
        .skin-segment .seg {
          position: absolute; transition: background 0.1s ease, box-shadow 0.1s ease;
        }
        .skin-segment .seg-h {
          width: 32px; height: 6px; left: 19px;
          clip-path: polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%);
        }
        .skin-segment .seg-v {
          width: 6px; height: 26px;
          clip-path: polygon(50% 0%, 100% 10%, 100% 90%, 50% 100%, 0% 90%, 0% 10%);
        }
        .skin-segment .seg-a { top: 14px; }
        .skin-segment .seg-g { top: 47px; }
        .skin-segment .seg-d { top: 80px; }
        .skin-segment .seg-f { left: 14px; top: 19px; }
        .skin-segment .seg-b { left: 50px; top: 19px; }
        .skin-segment .seg-e { left: 14px; top: 52px; }
        .skin-segment .seg-c { left: 50px; top: 52px; }
        .skin-segment .seg.on { background: var(--text); box-shadow: 0 0 6px var(--accent-glow); }
        .skin-segment .seg.off { background: var(--border); opacity: 0.05; }
        .skin-segment .seg.on.done { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
      `;
    }
  };

  // 4. SKIN NEON RING
  const neonSkin = {
    buildDigit(container) {
      container.innerHTML = `<span class="neon-digit">0</span>`;
    },
    setDigit(card, value) {
      const el = card.querySelector('.neon-digit');
      if (el) el.textContent = value;
    },
    updateDigit(card, from, to) {
      const el = card.querySelector('.neon-digit');
      if (!el) {
        this.buildDigit(card);
        this.setDigit(card, to);
        return;
      }
      el.classList.add('fading');
      setTimeout(() => {
        el.textContent = to;
        el.classList.remove('fading');
      }, 120);
    },
    getCSS() {
      return `
        .skin-neon .card {
          width: 84px !important; height: 84px !important;
          border-radius: 50%; background: var(--card);
          border: 2px solid var(--accent);
          box-shadow: 0 0 10px var(--accent-glow), 0 0 20px var(--accent-glow), inset 0 0 10px var(--accent-glow);
          display: flex; align-items: center; justify-content: center;
          animation: neonPulse 2s ease-in-out infinite alternate;
          overflow: hidden;
        }
        @keyframes neonPulse {
          from { box-shadow: 0 0 8px var(--accent-glow), inset 0 0 6px var(--accent-glow); }
          to { box-shadow: 0 0 18px var(--accent-glow), 0 0 30px var(--accent-glow), inset 0 0 10px var(--accent-glow); }
        }
        .skin-neon .neon-digit {
          position: static !important;
          transform: none !important;
          font-size: 52px; color: var(--text);
          text-shadow: 0 0 8px var(--accent-glow), 0 0 16px var(--accent-glow);
          transition: opacity 0.12s ease, transform 0.12s ease; line-height: 1;
        }
        .skin-neon .neon-digit.fading { opacity: 0; transform: scale(0.8); }
        .skin-neon .neon-digit.done {
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent);
        }
      `;
    }
  };

  // 5. SKIN TERMINAL (Melhorada - Sem cursor redundante)
  const terminalSkin = {
    buildDigit(container) {
      container.innerHTML = `<span class="term-digit">0</span>`;
    },
    setDigit(card, value) {
      const el = card.querySelector('.term-digit');
      if (el) el.textContent = value;
    },
    updateDigit(card, from, to) {
      const el = card.querySelector('.term-digit');
      if (!el) {
        this.buildDigit(card);
        this.setDigit(card, to);
        return;
      }
      const frames = [
        Math.floor(Math.random()*10),
        Math.floor(Math.random()*10),
        to
      ];
      let currentFrame = 0;
      
      const interval = setInterval(() => {
        el.textContent = frames[currentFrame];
        currentFrame++;
        if (currentFrame >= frames.length) {
          clearInterval(interval);
        }
      }, 50);
    },
    getCSS() {
      return `
        .skin-terminal .card {
          background: #020402; border: 1.5px solid var(--border-mid); border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.15), 0 0 8px var(--accent-glow);
        }
        .skin-terminal .card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent); opacity: 0.8;
        }
        .skin-terminal .card::after {
          content: ''; position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
          pointer-events: none; z-index: 2;
        }
        .skin-terminal .term-digit {
          position: static !important;
          transform: none !important;
          font-family: 'Courier New', 'Consolas', monospace;
          font-weight: bold;
          font-size: 64px; color: var(--text); line-height: var(--card-height);
          position: relative; z-index: 1;
          text-shadow: 0 0 4px var(--accent-glow), 0 0 10px var(--accent-glow);
        }
        .skin-terminal .term-digit.done { color: var(--accent); }
      `;
    }
  };

  // 6. SKIN SLOT MACHINE
  const slotsSkin = {
    buildDigit(container) {
      container.innerHTML = `
        <div class="slot-reel" style="transform: translateY(0px)">
          <div class="slot-digit">0</div>
        </div>
      `;
    },
    setDigit(card, value) {
      const reel = card.querySelector('.slot-reel');
      if (reel) {
        reel.style.transition = 'none';
        reel.style.transform = 'translateY(0px)';
        reel.innerHTML = `<div class="slot-digit">${value}</div>`;
      }
    },
    updateDigit(card, from, to) {
      const reel = card.querySelector('.slot-reel');
      if (!reel) {
        this.buildDigit(card);
        this.setDigit(card, to);
        return;
      }

      const reelHeight = 100;
      
      const intermediate = [
        from,
        String((Number(from) + 1) % 10),
        String((Number(from) + 2) % 10),
        to
      ];

      reel.style.transition = 'none';
      reel.style.transform = 'translateY(0px)';
      reel.innerHTML = intermediate.map(d => `<div class="slot-digit">${d}</div>`).join('');
      
      card.offsetHeight; // reflow

      reel.style.transition = 'transform 0.45s cubic-bezier(0.1, 0.75, 0.25, 1)';
      reel.style.transform = `translateY(-${(intermediate.length - 1) * reelHeight}px)`;

      setTimeout(() => {
        if (reel.parentNode) {
          this.setDigit(card, to);
        }
      }, 460);
    },
    getCSS() {
      return `
        .skin-slots .card {
          background: var(--card); border: 2px solid var(--border-mid); border-radius: 10px;
          overflow: hidden; position: relative;
          box-shadow: inset 0 8px 10px rgba(0,0,0,0.5), inset 0 -8px 10px rgba(0,0,0,0.5);
        }
        .skin-slots .card::before, .skin-slots .card::after {
          content: ''; position: absolute; left: 0; right: 0; height: 25%; z-index: 2; pointer-events: none;
        }
        .skin-slots .card::before {
          top: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
        }
        .skin-slots .card::after {
          bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
        }
        .skin-slots .slot-reel {
          display: flex; flex-direction: column; align-items: center;
        }
        .skin-slots .slot-digit {
          font-size: 76px; line-height: var(--card-height); height: var(--card-height);
          display: flex; align-items: center; justify-content: center;
          color: var(--text); width: var(--card-width); flex-shrink: 0;
        }
        .skin-slots .slot-digit.done { color: var(--accent); }
      `;
    }
  };

  const skinsMap = {
    classic: classicSkin,
    nixie: nixieSkin,
    segment: segmentSkin,
    neon: neonSkin,
    terminal: terminalSkin,
    slots: slotsSkin
  };

  window.SkinsEngine = {
    getSkins() {
      return skinsList;
    },

    apply(skinId) {
      const skin = skinsMap[skinId] || classicSkin;
      window.currentSkin = skin;

      let styleTag = document.getElementById('skin-css');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'skin-css';
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = skin.getCSS();

      skinsList.forEach(s => {
        document.body.classList.remove(`skin-${s.id}`);
      });
      document.body.classList.add(`skin-${skinId}`);

      localStorage.setItem(STORAGE_SKIN_KEY, skinId);
    },

    getCurrentId() {
      return localStorage.getItem(STORAGE_SKIN_KEY) || 'classic';
    }
  };
})();
