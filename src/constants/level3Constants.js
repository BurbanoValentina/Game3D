// ══════════════════════════════════════════════════════
//  LEVEL 3 CONSTANTS — ARENA DIGITAL
//  Mundo: Coliseo Digital — Zona de Competencia
//  Llave: CARMESÍ — "Ganar sin comprender es solo ruido."
// ══════════════════════════════════════════════════════

export const LEVEL3_PUZZLES = [
  { id: 1, position: { x: 45, z: -40, y: 18 }, question: '¿Qué propiedad CSS crea un sistema de cuadrícula con columnas?', answer: 'grid-template-columns', hint: 'grid-template-???', title: 'CSS: GRID', reward: 400 },
  { id: 2, position: { x: -55, z: 50, y: 18 }, question: '¿Qué valor de "position" fija un elemento respecto al viewport (no se mueve al hacer scroll)?', answer: 'fixed', hint: 'El elemento queda "fijo"', title: 'CSS: POSICIÓN', reward: 350 },
  { id: 3, position: { x: 70, z: 65, y: 18 }, question: '¿Qué propiedad CSS crea una transición suave entre estados?', answer: 'transition', hint: 'Trans... algo', title: 'CSS: ANIMACIÓN', reward: 350 },
  { id: 4, position: { x: -75, z: -70, y: 18 }, question: '¿Qué unidad CSS es relativa al tamaño de fuente del elemento raíz (html)?', answer: 'rem', hint: 'Es como "em" pero con una letra extra al inicio', title: 'CSS: UNIDADES', reward: 300 },
  { id: 5, position: { x: 0, z: 80, y: 18 }, question: '¿Qué propiedad CSS controla el orden de apilamiento (qué elemento queda encima)?', answer: 'z-index', hint: 'z-???', title: 'CSS: CAPAS', reward: 400 },
];

export const LEVEL3_TOKENS = [
  { id: 'l3_mem1', type: 'memory', position: { x: 25, z: 25 }, image: 'arena_crowd', title: 'RECUERDO: La Primera Competencia', text: 'El día que Eva ganó su primer torneo en el OASIS. Todo parecía posible.' },
  { id: 'l3_mem2', type: 'memory', position: { x: -35, z: -25 }, image: 'ioi_attack', title: 'RECUERDO: El Ataque de IOI', text: 'IOI modificó las reglas del torneo. Nadie protestó. Excepto ellas tres.' },
  { id: 'l3_mem3', type: 'memory', position: { x: 55, z: -50 }, image: 'scoreboard', title: 'RECUERDO: El Marcador Imposible', text: 'Números que no cuadran. IOI siempre un paso adelante. ¿Coincidencia?' },
  { id: 'l3_scare1', type: 'screamer', position: { x: -20, z: 65 }, color: 'crimson', title: 'AGENTE IOI DETECTADO' },
  { id: 'l3_scare2', type: 'screamer', position: { x: 45, z: -20 }, color: 'red', title: 'SISTEMA COMPROMETIDO' },
];

export const LEVEL3_CHECKPOINTS = [
  { x: 0, z: 0, label: 'CENTRO_ARENA' },
  { x: 45, z: -40, label: 'SECTOR_ALFA' },
  { x: -55, z: 50, label: 'SECTOR_BETA' },
  { x: 70, z: 65, label: 'SECTOR_GAMMA' },
  { x: -75, z: -70, label: 'SECTOR_DELTA' },
  { x: 0, z: 80, label: 'SECTOR_OMEGA' },
  { x: 0, z: -80, label: 'LLAVE_CARMESÍ' },
];

export const LEVEL3_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 20, y: 2, z: -20, w: 4.5, h: 1, d: 4.5 }, { x: 25, y: 5, z: -25, w: 3.5, h: 1, d: 3.5 },
    { x: 29, y: 8, z: -29, w: 3, h: 1, d: 3 }, { x: 34, y: 11, z: -33, w: 3, h: 1, d: 3 },
    { x: 38, y: 14, z: -36, w: 3.5, h: 1, d: 3.5 }, { x: 42, y: 16, z: -38, w: 3, h: 1, d: 3 },
    { x: 45, y: 18, z: -40, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -30, y: 2, z: 30, w: 4.5, h: 1, d: 4.5 }, { x: -34, y: 5, z: 34, w: 3.5, h: 1, d: 3.5 },
    { x: -38, y: 8, z: 38, w: 3, h: 1, d: 3 }, { x: -43, y: 11, z: 43, w: 3, h: 1, d: 3 },
    { x: -48, y: 14, z: 46, w: 3.5, h: 1, d: 3.5 }, { x: -52, y: 16, z: 48, w: 3, h: 1, d: 3 },
    { x: -55, y: 18, z: 50, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 72, y: 2, z: 40, w: 4.5, h: 1, d: 4.5 }, { x: 72, y: 5, z: 46, w: 3.5, h: 1, d: 3.5 },
    { x: 71, y: 8, z: 51, w: 3, h: 1, d: 3 }, { x: 71, y: 11, z: 56, w: 3, h: 1, d: 3 },
    { x: 70, y: 14, z: 60, w: 3.5, h: 1, d: 3.5 }, { x: 70, y: 16, z: 63, w: 3, h: 1, d: 3 },
    { x: 70, y: 18, z: 65, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -52, y: 2, z: -48, w: 4.5, h: 1, d: 4.5 }, { x: -56, y: 5, z: -52, w: 3.5, h: 1, d: 3.5 },
    { x: -60, y: 8, z: -56, w: 3, h: 1, d: 3 }, { x: -64, y: 11, z: -60, w: 3, h: 1, d: 3 },
    { x: -68, y: 14, z: -64, w: 3.5, h: 1, d: 3.5 }, { x: -72, y: 16, z: -67, w: 3, h: 1, d: 3 },
    { x: -75, y: 18, z: -70, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -18, y: 2, z: 58, w: 4.5, h: 1, d: 4.5 }, { x: -14, y: 5, z: 62, w: 3.5, h: 1, d: 3.5 },
    { x: -10, y: 8, z: 66, w: 3, h: 1, d: 3 }, { x: -6, y: 11, z: 70, w: 3, h: 1, d: 3 },
    { x: -3, y: 14, z: 74, w: 3.5, h: 1, d: 3.5 }, { x: -1, y: 16, z: 77, w: 3, h: 1, d: 3 },
    { x: 0, y: 18, z: 80, w: 5, h: 1.2, d: 5 },
  ]},
];

export const LEVEL3_GRAFFITI = [
  { text: 'display: grid; gap: 1rem;', color: '#DC143C' },
  { text: 'position: fixed; z-index: 999;', color: '#FF4444' },
  { text: '@keyframes pulse { 0%{} 100%{} }', color: '#FFD700' },
  { text: '/* IOI was here */', color: '#FF0066' },
  { text: 'transform: scale(1.5) rotate(45deg);', color: '#00FF88' },
  { text: 'opacity: 0; visibility: hidden;', color: '#9D00FF' },
  { text: ':root { --danger: #DC143C; }', color: '#00f0ff' },
];

export const LEVEL3_BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — CARGANDO NIVEL 3...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'ACCEDIENDO A ARENA DIGITAL...', delay: 800, type: 'system' },
  { text: 'ESTADO: ██ ZONA DE COMPETENCIA ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: 'ALERTA: AGENTES IOI DETECTADOS EN LA ARENA', delay: 3800, type: 'eva' },
  { text: 'Las reglas del juego han sido modificadas.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 3: EL DESAFÍO...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Arena Digital — Zona de Competencia', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + LLAVE CARMESÍ', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

export const LEVEL3_CINEMATIC_LINES = [
  'La Arena Digital pulsa con energía pura.',
  'Cientos de Gunters compiten simultáneamente.',
  'Pantallas gigantes muestran clasificaciones en tiempo real.',
  'El ruido del sistema es ensordecedor.',
  ' ',
  'IOI ha modificado las reglas. El marcador muestra números imposibles.',
  'Los controles se invierten brevemente. Una figura sin forma observa.',
  ' ',
  'Eva debe demostrar que ganar no es solo velocidad.',
  'Resuelve los enigmas CSS. Encuentra los recuerdos. Obtén la llave.',
];
