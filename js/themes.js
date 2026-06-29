/**
 * TEMAS DO FLIP CLOCK
 * ─────────────────────────────────────────────────────────────
 * Para adicionar um novo tema, basta copiar um objeto existente,
 * trocar o id (único), name, e os valores das variáveis CSS.
 *
 * Variáveis disponíveis:
 *   --bg          → fundo da página
 *   --card        → metade superior do card (mais clara)
 *   --card-bot    → metade inferior do card (mais escura)
 *   --border      → borda sutil dos cards
 *   --border-mid  → linha divisória do card
 *   --text        → dígitos e texto principal
 *   --muted       → labels, separadores, texto secundário
 *   --accent      → cor de destaque (alarme, botão ativo, etc.)
 *   --accent-glow → sombra do glow de destaque
 * ─────────────────────────────────────────────────────────────
 */

window.THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    preview: ['#0e0e0e', '#1a1a1a', '#f0f0f0'],
    vars: {
      '--bg':          '#0e0e0e',
      '--card':        '#1a1a1a',
      '--card-bot':    '#141414',
      '--border':      'rgba(255,255,255,0.08)',
      '--border-mid':  'rgba(255,255,255,0.14)',
      '--text':        '#f0f0f0',
      '--muted':       '#555',
      '--accent':      '#ff6060',
      '--accent-glow': 'rgba(255,96,96,0.35)',
    }
  },
  {
    id: 'arctic',
    name: 'Arctic',
    preview: ['#f2f4f8', '#ffffff', '#1a1f2e'],
    vars: {
      '--bg':          '#f2f4f8',
      '--card':        '#ffffff',
      '--card-bot':    '#eaedf2',
      '--border':      'rgba(0,0,0,0.08)',
      '--border-mid':  'rgba(0,0,0,0.14)',
      '--text':        '#1a1f2e',
      '--muted':       '#9aa0b0',
      '--accent':      '#3b6ef0',
      '--accent-glow': 'rgba(59,110,240,0.3)',
    }
  },
  {
    id: 'contours',
    name: '🗺️ Contours',
    preview: ['#0a0a0f', '#14141e', '#d4c5b9'],
    animated: true,
    effect: 'topography',
    vars: {
      '--bg':          '#0a0a0f',
      '--card':        '#14141e',
      '--card-bot':    '#0e0e15',
      '--border':      'rgba(212,197,185,0.08)',
      '--border-mid':  'rgba(212,197,185,0.15)',
      '--text':        '#d4c5b9',
      '--muted':       '#665c54',
      '--accent':      '#d4c5b9',
      '--accent-glow': 'rgba(212,197,185,0.3)',
    }
  },
  {
    id: 'tech-mesh',
    name: '🕸️ Tech Mesh',
    preview: ['#05080a', '#0d131a', '#00ffcc'],
    animated: true,
    effect: 'tech-mesh',
    vars: {
      '--bg':          '#05080a',
      '--card':        '#0d131a',
      '--card-bot':    '#080c10',
      '--border':      'rgba(0,255,204,0.08)',
      '--border-mid':  'rgba(0,255,204,0.15)',
      '--text':        '#e0fffa',
      '--muted':       '#3a5450',
      '--accent':      '#00ffcc',
      '--accent-glow': 'rgba(0,255,204,0.35)',
    }
  },
  {
    id: 'interactive-grid',
    name: '✨ Grid Reagente',
    preview: ['#0f0f12', '#181820', '#ff0055'],
    animated: true,
    effect: 'interactive-grid',
    vars: {
      '--bg':          '#0f0f12',
      '--card':        '#181820',
      '--card-bot':    '#111116',
      '--border':      'rgba(255,0,85,0.08)',
      '--border-mid':  'rgba(255,0,85,0.15)',
      '--text':        '#ffffff',
      '--muted':       '#55444b',
      '--accent':      '#ff0055',
      '--accent-glow': 'rgba(255,0,85,0.35)',
    }
  },
  {
    id: 'cosmos',
    name: '🌌 Cosmos',
    preview: ['#080810', '#181822', '#cce8ff'],
    animated: true,
    effect: 'stars',
    vars: {
      '--bg':          '#080810',
      '--card':        '#181822',
      '--card-bot':    '#101016',
      '--border':      'rgba(200,230,255,0.06)',
      '--border-mid':  'rgba(200,230,255,0.12)',
      '--text':        '#ffffff',
      '--muted':       '#445566',
      '--accent':      '#88c0ff',
      '--accent-glow': 'rgba(136,192,255,0.35)',
    }
  },
  {
    id: 'aurora',
    name: '🌊 Aurora',
    preview: ['#060a12', '#101a2c', '#00ff88'],
    animated: true,
    effect: 'aurora',
    vars: {
      '--bg':          '#060a12',
      '--card':        '#101a2c',
      '--card-bot':    '#0a101d',
      '--border':      'rgba(0,255,136,0.05)',
      '--border-mid':  'rgba(0,255,136,0.12)',
      '--text':        '#e0fff0',
      '--muted':       '#3b5866',
      '--accent':      '#00ff88',
      '--accent-glow': 'rgba(0,255,136,0.3)',
    }
  },
  {
    id: 'ember',
    name: '🔥 Ember',
    preview: ['#100808', '#221212', '#ff6000'],
    animated: true,
    effect: 'fireflies',
    vars: {
      '--bg':          '#100808',
      '--card':        '#221212',
      '--card-bot':    '#180a0a',
      '--border':      'rgba(255,96,0,0.08)',
      '--border-mid':  'rgba(255,96,0,0.15)',
      '--text':        '#ffb380',
      '--muted':       '#663c22',
      '--accent':      '#ff6000',
      '--accent-glow': 'rgba(255,96,0,0.4)',
    }
  },
  {
    id: 'cyberpunk-rain',
    name: '🌧️ Cyberpunk',
    preview: ['#06060c', '#151222', '#ff00b4'],
    animated: true,
    effect: 'rain',
    vars: {
      '--bg':          '#06060c',
      '--card':        '#151222',
      '--card-bot':    '#0f0c18',
      '--border':      'rgba(0,240,255,0.08)',
      '--border-mid':  'rgba(255,0,180,0.15)',
      '--text':        '#00f0ff',
      '--muted':       '#603070',
      '--accent':      '#ff00b4',
      '--accent-glow': 'rgba(255,0,180,0.45)',
    }
  },
  {
    id: 'matrix',
    name: '🎮 Matrix',
    preview: ['#000d00', '#001200', '#00ff41'],
    animated: true,
    effect: 'matrix-rain',
    vars: {
      '--bg':          '#000d00',
      '--card':        '#001200',
      '--card-bot':    '#000d00',
      '--border':      'rgba(0,255,65,0.10)',
      '--border-mid':  'rgba(0,255,65,0.20)',
      '--text':        '#00ff41',
      '--muted':       '#1a5c26',
      '--accent':      '#00ff41',
      '--accent-glow': 'rgba(0,255,65,0.45)',
    }
  },
  {
    id: 'amber',
    name: 'Amber',
    preview: ['#110d00', '#1e1600', '#f5c842'],
    vars: {
      '--bg':          '#110d00',
      '--card':        '#1e1600',
      '--card-bot':    '#170f00',
      '--border':      'rgba(245,200,66,0.10)',
      '--border-mid':  'rgba(245,200,66,0.20)',
      '--text':        '#f5c842',
      '--muted':       '#6b5a20',
      '--accent':      '#ff9500',
      '--accent-glow': 'rgba(255,149,0,0.40)',
    }
  },
  {
    id: 'dusk',
    name: 'Dusk',
    preview: ['#1a1025', '#231636', '#e8c5ff'],
    vars: {
      '--bg':          '#1a1025',
      '--card':        '#231636',
      '--card-bot':    '#1c1030',
      '--border':      'rgba(200,150,255,0.10)',
      '--border-mid':  'rgba(200,150,255,0.18)',
      '--text':        '#e8c5ff',
      '--muted':       '#6b4f8a',
      '--accent':      '#c47fff',
      '--accent-glow': 'rgba(196,127,255,0.40)',
    }
  },
  {
    id: 'slate',
    name: 'Slate',
    preview: ['#1c2333', '#243049', '#c8d8f0'],
    vars: {
      '--bg':          '#1c2333',
      '--card':        '#243049',
      '--card-bot':    '#1e2940',
      '--border':      'rgba(160,200,255,0.10)',
      '--border-mid':  'rgba(160,200,255,0.18)',
      '--text':        '#c8d8f0',
      '--muted':       '#4a6080',
      '--accent':      '#5599ff',
      '--accent-glow': 'rgba(85,153,255,0.35)',
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    preview: ['#1a0a10', '#2a1018', '#ffb3c8'],
    vars: {
      '--bg':          '#1a0a10',
      '--card':        '#2a1018',
      '--card-bot':    '#220c14',
      '--border':      'rgba(255,150,180,0.10)',
      '--border-mid':  'rgba(255,150,180,0.20)',
      '--text':        '#ffb3c8',
      '--muted':       '#7a3050',
      '--accent':      '#ff4d7a',
      '--accent-glow': 'rgba(255,77,122,0.40)',
    }
  },
];
