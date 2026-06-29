/**
 * MOTOR DE EFEITOS ANIMADOS (CANVAS 2D)
 * ─────────────────────────────────────────────────────────────
 * Gerencia a animação de elementos visuais no fundo da página.
 * Suporta efeitos reativos ao mouse e cliques do usuário.
 * Expõe window.EffectsEngine.
 * ─────────────────────────────────────────────────────────────
 */

(function() {
  let canvas = null;
  let ctx = null;
  let animationFrameId = null;
  let activeEffect = null;
  let effectInstance = null;

  // Rastreamento de mouse e cliques
  let mouse = { x: -1000, y: -1000, active: false };
  let clicks = [];

  const random = (min, max) => Math.random() * (max - min) + min;
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Manipuladores de eventos reativos
  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }

  function onMouseLeave() {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.active = false;
  }

  function onClick(e) {
    clicks.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: random(150, 250),
      speed: random(4, 7),
      opacity: 1.0
    });
    // Limita clicks acumulados
    if (clicks.length > 8) {
      clicks.shift();
    }
  }

  function setupInteractionListeners() {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('click', onClick);
  }

  function removeInteractionListeners() {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseout', onMouseLeave);
    window.removeEventListener('click', onClick);
    clicks = [];
    mouse = { x: -1000, y: -1000, active: false };
  }

  // 1. Efeito Estrelas (Cosmos)
  function createStarsEffect() {
    let stars = [];
    let shootingStars = [];
    const maxStars = 150;

    function init() {
      stars = [];
      shootingStars = [];
      for (let i = 0; i < maxStars; i++) {
        stars.push({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          radius: random(0.5, 2.0),
          alpha: random(0.1, 1.0),
          speed: random(0.01, 0.05),
          color: Math.random() > 0.8 ? '#cce8ff' : '#ffffff'
        });
      }
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: random(0, canvas.width * 0.8),
        y: 0,
        len: random(80, 150),
        speed: random(10, 20),
        angle: random(Math.PI / 6, Math.PI / 4),
        alpha: 1.0,
        thickness: random(1.5, 3)
      });
    }

    function draw(time) {
      ctx.fillStyle = '#080810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.1) {
          star.speed = -star.speed;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1.0, star.alpha));
        ctx.fill();
      });

      if (Math.random() < 0.003 && shootingStars.length < 2) {
        spawnShootingStar();
      }

      ctx.globalAlpha = 1.0;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ctx.beginPath();
        const endX = ss.x + Math.cos(ss.angle) * ss.len;
        const endY = ss.y + Math.sin(ss.angle) * ss.len;
        
        let grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = ss.thickness;
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.02;

        if (ss.alpha <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;
    }

    return { init, draw, destroy: () => {} };
  }

  // 2. Efeito Aurora (Aurora)
  function createAuroraEffect() {
    let waves = [];

    function init() {
      waves = [
        {
          y: canvas.height * 0.35,
          length: 0.002,
          amplitude: 80,
          speed: 0.0005,
          color: 'rgba(0, 255, 136, 0.08)',
          phase: 0
        },
        {
          y: canvas.height * 0.40,
          length: 0.0015,
          amplitude: 110,
          speed: 0.0003,
          color: 'rgba(0, 255, 204, 0.07)',
          phase: 1
        },
        {
          y: canvas.height * 0.45,
          length: 0.0025,
          amplitude: 60,
          speed: 0.0007,
          color: 'rgba(136, 102, 255, 0.08)',
          phase: 2
        },
        {
          y: canvas.height * 0.30,
          length: 0.001,
          amplitude: 90,
          speed: 0.0002,
          color: 'rgba(68, 136, 255, 0.06)',
          phase: 3
        }
      ];
    }

    function draw(time) {
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waves.forEach(w => {
        w.phase += w.speed;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x < canvas.width; x += 10) {
          const y = w.y + 
            Math.sin(x * w.length + w.phase) * w.amplitude +
            Math.sin(x * 0.005 + w.phase * 2) * (w.amplitude * 0.2);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        let grad = ctx.createLinearGradient(0, w.y - w.amplitude * 1.5, 0, canvas.height);
        grad.addColorStop(0, w.color);
        grad.addColorStop(0.5, 'rgba(0, 255, 136, 0.01)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fill();
      });
    }

    return { init, draw, destroy: () => {} };
  }

  // 3. Efeito Brasa/Vaga-lumes (Ember)
  function createFirefliesEffect() {
    let particles = [];
    const count = 40;

    function init() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: random(0, canvas.width),
          y: random(canvas.height, canvas.height + 100),
          radius: random(1.5, 3.5),
          vx: random(-0.5, 0.5),
          vy: random(-1.5, -0.6),
          color: Math.random() > 0.4 ? 'rgba(255, 96, 0, 0.8)' : (Math.random() > 0.5 ? 'rgba(255, 150, 0, 0.8)' : 'rgba(230, 40, 0, 0.8)'),
          pulseSpeed: random(0.01, 0.03),
          phase: random(0, Math.PI * 2),
          glowSize: random(10, 25)
        });
      }
    }

    function draw(time) {
      ctx.fillStyle = '#100808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y += p.vy;
        p.phase += p.pulseSpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.3;

        const currentAlpha = (Math.sin(p.phase) + 1.2) / 2.2;

        ctx.beginPath();
        let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
        grad.addColorStop(0, p.color.replace('0.8', (currentAlpha * 0.45).toFixed(2)));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.8', (currentAlpha * 0.95).toFixed(2));
        ctx.fill();

        if (p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          p.y = canvas.height + random(10, 100);
          p.x = random(0, canvas.width);
          p.vy = random(-1.5, -0.6);
          p.phase = random(0, Math.PI * 2);
        }
      });
    }

    return { init, draw, destroy: () => {} };
  }

  // 4. Efeito Chuva Cyberpunk (Cyberpunk Rain)
  function createRainEffect() {
    let drops = [];
    const count = 180;

    function init() {
      drops = [];
      for (let i = 0; i < count; i++) {
        drops.push({
          x: random(0, canvas.width),
          y: random(-canvas.height, 0),
          length: random(15, 35),
          speed: random(8, 16),
          color: Math.random() > 0.85 ? '#ff00b4' : '#00f0ff',
          opacity: random(0.2, 0.6),
          width: random(1, 2)
        });
      }
    }

    function draw(time) {
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach(d => {
        ctx.beginPath();
        ctx.strokeStyle = d.color;
        ctx.globalAlpha = d.opacity;
        ctx.lineWidth = d.width;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;

        if (d.y > canvas.height) {
          d.y = random(-50, -10);
          d.x = random(0, canvas.width);
          d.speed = random(8, 16);
        }
      });
      ctx.globalAlpha = 1.0;
    }

    return { init, draw, destroy: () => {} };
  }

  // 5. Efeito Matrix Rain (Matrix)
  function createMatrixEffect() {
    let columns = [];
    const fontSize = 16;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');

    function init() {
      columns = [];
      const colCount = Math.floor(canvas.width / fontSize) + 1;
      for (let i = 0; i < colCount; i++) {
        columns.push({
          x: i * fontSize,
          y: random(-canvas.height, 0),
          speed: random(2, 6),
          chars: [],
          maxLen: randomInt(15, 40)
        });
      }
    }

    function draw(time) {
      ctx.fillStyle = 'rgba(0, 13, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      columns.forEach(col => {
        const char = chars[randomInt(0, chars.length - 1)];
        ctx.fillStyle = '#00ff41';
        ctx.fillText(char, col.x, col.y);

        ctx.fillStyle = 'rgba(0, 200, 50, 0.4)';
        for (let i = 1; i < col.maxLen; i++) {
          const trailY = col.y - (i * fontSize);
          if (trailY > 0 && trailY < canvas.height) {
            const prevChar = chars[randomInt(0, chars.length - 1)];
            ctx.fillText(prevChar, col.x, trailY);
          }
        }

        col.y += col.speed;

        if (col.y - (col.maxLen * fontSize) > canvas.height) {
          col.y = -fontSize;
          col.speed = random(2, 6);
          col.maxLen = randomInt(15, 40);
        }
      });
    }

    return { init, draw, destroy: () => {} };
  }

  // 6. NOVO TEMA: Efeito Topografia Abstrato (Contours)
  function createTopographyEffect() {
    let centers = [];
    const lineCount = 8; // Linhas por centro
    const centerCount = 5; // Quantidade de "colinas"

    function init() {
      centers = [];
      for (let i = 0; i < centerCount; i++) {
        centers.push({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          targetX: random(0, canvas.width),
          targetY: random(0, canvas.height),
          speed: random(0.1, 0.3),
          noiseSeed: random(0, 100),
          rBase: random(120, 260)
        });
      }
    }

    function draw(time) {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4c5b9';
      
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1.0;
      ctx.strokeStyle = accentColor;

      centers.forEach(c => {
        // Movimentação suave das colinas em direção ao target
        const dx = c.targetX - c.x;
        const dy = c.targetY - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 10) {
          c.targetX = random(0, canvas.width);
          c.targetY = random(0, canvas.height);
        } else {
          c.x += (dx / dist) * c.speed;
          c.y += (dy / dist) * c.speed;
        }

        // Desenhar ondas concêntricas onduladas/deformadas (curvas de nível)
        for (let j = 0; j < lineCount; j++) {
          const rLimit = c.rBase * ((j + 1) / lineCount);
          ctx.beginPath();

          const step = 0.08;
          ctx.globalAlpha = (1 - (j / lineCount)) * 0.15; // Mais transparente nas bordas

          for (let angle = 0; angle <= Math.PI * 2 + step; angle += step) {
            // Deformação da onda baseada no tempo e no ângulo
            const wave1 = Math.sin(angle * 3 + time * 0.0008 + c.noiseSeed) * 15;
            const wave2 = Math.cos(angle * 5 - time * 0.0005 + j) * 8;
            const r = rLimit + wave1 + wave2;

            const px = c.x + Math.cos(angle) * r;
            const py = c.y + Math.sin(angle) * r;

            if (angle === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;
    }

    return { init, draw, destroy: () => {} };
  }

  // 7. NOVO TEMA REAGENTE: Tech Mesh (tech-mesh)
  function createTechMeshEffect() {
    let particles = [];
    const maxParticles = 65;

    function init() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: random(0, canvas.width),
          y: random(0, canvas.height),
          vx: random(-0.4, 0.4),
          vy: random(-0.4, 0.4),
          radius: random(1.5, 3)
        });
      }
    }

    function draw(time) {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00ffcc';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#05080a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Atualizar e desenhar partículas de Mesh
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Limites da tela
        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        // Atração magnética/interativa ao mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            // Puxa levemente para a posição do mouse
            p.x += (dx / dist) * 0.8;
            p.y += (dy / dist) * 0.8;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.4;
        ctx.fill();
      });

      // 2. Desenhar conexões da Mesh (Linhas próximas)
      ctx.strokeStyle = accentColor;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = (1 - (dist / 100)) * 0.22;
            ctx.stroke();
          }
        }
      }

      // 3. Conexões com o mouse
      if (mouse.active) {
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = (1 - (dist / 140)) * 0.35;
            ctx.stroke();
          }
        });
      }

      // 4. Desenhar efeito de onda expansiva ao clicar
      ctx.globalAlpha = 1.0;
      for (let i = clicks.length - 1; i >= 0; i--) {
        const c = clicks[i];
        c.radius += c.speed;
        c.opacity = 1 - (c.radius / c.maxRadius);

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = Math.max(0, c.opacity) * 0.5;
        ctx.stroke();

        // repele partículas que colidem com a onda de clique
        particles.forEach(p => {
          const dx = p.x - c.x;
          const dy = p.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - c.radius);
          if (diff < 15) {
            p.x += (dx / dist) * 6 * c.opacity;
            p.y += (dy / dist) * 6 * c.opacity;
          }
        });

        if (c.radius >= c.maxRadius) {
          clicks.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;
    }

    return { init, draw, destroy: () => {} };
  }

  // 8. NOVO TEMA REAGENTE: Grid Interativo (interactive-grid)
  function createInteractiveGridEffect() {
    const spacing = 40;
    let gridPoints = [];

    function init() {
      gridPoints = [];
      const cols = Math.floor(canvas.width / spacing) + 2;
      const rows = Math.floor(canvas.height / spacing) + 2;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          gridPoints.push({
            origX: x * spacing - (spacing / 2),
            origY: y * spacing - (spacing / 2),
            x: x * spacing - (spacing / 2),
            y: y * spacing - (spacing / 2)
          });
        }
      }
    }

    function draw(time) {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff0055';
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0f0f12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gridPoints.forEach(p => {
        let targetX = p.origX;
        let targetY = p.origY;

        // Distorção elástica baseada na proximidade do mouse
        if (mouse.active) {
          const dx = mouse.x - p.origX;
          const dy = mouse.y - p.origY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            // Empurra os pontos ligeiramente para longe do mouse
            targetX -= (dx / dist) * 20 * force;
            targetY -= (dy / dist) * 20 * force;
          }
        }

        // Distorção ao clicar (onda de choque)
        clicks.forEach(c => {
          const dx = p.origX - c.x;
          const dy = p.origY - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = dist - c.radius;
          if (diff > 0 && diff < 40) {
            const force = (40 - diff) / 40 * c.opacity;
            // Empurra radialmente
            targetX += (dx / dist) * 25 * force;
            targetY += (dy / dist) * 25 * force;
          }
        });

        // Interpolação suave para voltar/ir
        p.x += (targetX - p.x) * 0.12;
        p.y += (targetY - p.y) * 0.12;

        // Desenhar dot
        ctx.beginPath();
        
        let size = 1.2;
        let alpha = 0.12;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const factor = (120 - dist) / 120;
            size += factor * 1.8;
            alpha += factor * 0.35;
          }
        }

        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      // Efeito visual no ponto do clique
      ctx.globalAlpha = 1.0;
      for (let i = clicks.length - 1; i >= 0; i--) {
        const c = clicks[i];
        c.radius += c.speed;
        c.opacity = 1 - (c.radius / c.maxRadius);

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = Math.max(0, c.opacity) * 0.25;
        ctx.stroke();

        if (c.radius >= c.maxRadius) {
          clicks.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;
    }

    return { init, draw, destroy: () => {} };
  }

  // Engine control
  function render(time) {
    if (!effectInstance) return;
    effectInstance.draw(time);
    animationFrameId = requestAnimationFrame(render);
  }

  window.EffectsEngine = {
    init(canvasId) {
      canvas = document.getElementById(canvasId);
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    start(effectName) {
      this.stop();
      activeEffect = effectName;
      
      setupInteractionListeners();

      switch (effectName) {
        case 'stars':
          effectInstance = createStarsEffect();
          break;
        case 'aurora':
          effectInstance = createAuroraEffect();
          break;
        case 'fireflies':
          effectInstance = createFirefliesEffect();
          break;
        case 'rain':
          effectInstance = createRainEffect();
          break;
        case 'matrix-rain':
          effectInstance = createMatrixEffect();
          break;
        case 'topography':
          effectInstance = createTopographyEffect();
          break;
        case 'tech-mesh':
          effectInstance = createTechMeshEffect();
          break;
        case 'interactive-grid':
          effectInstance = createInteractiveGridEffect();
          break;
        default:
          effectInstance = null;
          return;
      }

      if (effectInstance) {
        effectInstance.init();
        render(performance.now());
      }
    },

    stop() {
      removeInteractionListeners();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (effectInstance && effectInstance.destroy) {
        effectInstance.destroy();
      }
      effectInstance = null;
      activeEffect = null;
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },

    resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (effectInstance && effectInstance.init) {
        effectInstance.init();
      }
    }
  };
})();
