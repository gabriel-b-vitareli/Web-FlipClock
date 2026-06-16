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
    id: 'matrix',
    name: 'Matrix',
    preview: ['#000d00', '#001200', '#00ff41'],
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
