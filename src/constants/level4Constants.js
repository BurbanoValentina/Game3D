// ══════════════════════════════════════════════════════
//  LEVEL 4 CONSTANTS — PUENTE SUSPENDIDO
//  Mundo: Puente Interminable — Zona de Vínculo
//  Llave: ESMERALDA — "La confianza no se construye. Se elige."
// ══════════════════════════════════════════════════════

export const LEVEL4_PUZZLES = [
  { id: 1, position: { x: 40, z: -38, y: 18 }, question: '¿Qué etiqueta HTML5 se usa para definir la barra de navegación?', answer: 'nav', hint: 'Abreviación de "navigation"', title: 'HTML: SEMÁNTICA', reward: 350 },
  { id: 2, position: { x: -52, z: 48, y: 18 }, question: '¿Qué atributo HTML hace que un campo de formulario sea obligatorio?', answer: 'required', hint: 'Significa "requerido" en inglés', title: 'HTML: FORMULARIOS', reward: 300 },
  { id: 3, position: { x: 68, z: 62, y: 18 }, question: '¿Qué etiqueta HTML se usa para incrustar un video en la página?', answer: 'video', hint: 'Es exactamente la palabra que piensas', title: 'HTML: MULTIMEDIA', reward: 350 },
  { id: 4, position: { x: -72, z: -68, y: 18 }, question: '¿Qué atributo de <img> describe la imagen para lectores de pantalla (accesibilidad)?', answer: 'alt', hint: 'Texto "alternativo"', title: 'HTML: ACCESIBILIDAD', reward: 400 },
  { id: 5, position: { x: 3, z: 78, y: 18 }, question: '¿Qué etiqueta HTML5 define una sección independiente de contenido reutilizable?', answer: 'article', hint: 'Como un artículo de blog o noticia', title: 'HTML: ESTRUCTURA', reward: 350 },
];

export const LEVEL4_TOKENS = [
  { id: 'l4_mem1', type: 'memory', position: { x: 28, z: 22 }, image: 'bridge_together', title: 'RECUERDO: El Puente Original', text: 'La primera vez que las tres cruzaron juntas. El puente era sólido entonces.' },
  { id: 'l4_mem2', type: 'memory', position: { x: -38, z: -28 }, image: 'trust_broken', title: 'RECUERDO: Confianza Rota', text: 'IOI usó una IA para imitar la voz de Vanessa. Eva casi cayó en la trampa.' },
  { id: 'l4_mem3', type: 'memory', position: { x: 52, z: -48 }, image: 'void_below', title: 'RECUERDO: El Vacío Debajo', text: 'Debajo del puente, datos corruptos pulsan como algo vivo. Halliday lo puso ahí a propósito.' },
  { id: 'l4_scare1', type: 'screamer', position: { x: -22, z: 62 }, color: 'green', title: 'VOZ FALSA DETECTADA' },
  { id: 'l4_scare2', type: 'screamer', position: { x: 42, z: -18 }, color: 'emerald', title: 'PUENTE COLAPSANDO' },
];

export const LEVEL4_CHECKPOINTS = [
  { x: 0, z: 0, label: 'INICIO_PUENTE' },
  { x: 40, z: -38, label: 'PILAR_ALFA' },
  { x: -52, z: 48, label: 'PILAR_BETA' },
  { x: 68, z: 62, label: 'PILAR_GAMMA' },
  { x: -72, z: -68, label: 'PILAR_DELTA' },
  { x: 3, z: 78, label: 'PILAR_OMEGA' },
  { x: 0, z: -80, label: 'LLAVE_ESMERALDA' },
];

export const LEVEL4_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 18, y: 2, z: -18, w: 4, h: 1, d: 4 }, { x: 22, y: 5, z: -22, w: 3.5, h: 1, d: 3.5 },
    { x: 26, y: 8, z: -26, w: 3, h: 1, d: 3 }, { x: 30, y: 11, z: -30, w: 3, h: 1, d: 3 },
    { x: 34, y: 14, z: -33, w: 3.5, h: 1, d: 3.5 }, { x: 37, y: 16, z: -36, w: 3, h: 1, d: 3 },
    { x: 40, y: 18, z: -38, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -28, y: 2, z: 28, w: 4, h: 1, d: 4 }, { x: -33, y: 5, z: 33, w: 3.5, h: 1, d: 3.5 },
    { x: -37, y: 8, z: 37, w: 3, h: 1, d: 3 }, { x: -42, y: 11, z: 42, w: 3, h: 1, d: 3 },
    { x: -46, y: 14, z: 45, w: 3.5, h: 1, d: 3.5 }, { x: -49, y: 16, z: 47, w: 3, h: 1, d: 3 },
    { x: -52, y: 18, z: 48, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 70, y: 2, z: 38, w: 4, h: 1, d: 4 }, { x: 70, y: 5, z: 44, w: 3.5, h: 1, d: 3.5 },
    { x: 69, y: 8, z: 49, w: 3, h: 1, d: 3 }, { x: 69, y: 11, z: 54, w: 3, h: 1, d: 3 },
    { x: 68, y: 14, z: 58, w: 3.5, h: 1, d: 3.5 }, { x: 68, y: 16, z: 60, w: 3, h: 1, d: 3 },
    { x: 68, y: 18, z: 62, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -50, y: 2, z: -48, w: 4, h: 1, d: 4 }, { x: -54, y: 5, z: -52, w: 3.5, h: 1, d: 3.5 },
    { x: -58, y: 8, z: -56, w: 3, h: 1, d: 3 }, { x: -62, y: 11, z: -60, w: 3, h: 1, d: 3 },
    { x: -66, y: 14, z: -63, w: 3.5, h: 1, d: 3.5 }, { x: -69, y: 16, z: -66, w: 3, h: 1, d: 3 },
    { x: -72, y: 18, z: -68, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -16, y: 2, z: 56, w: 4, h: 1, d: 4 }, { x: -12, y: 5, z: 60, w: 3.5, h: 1, d: 3.5 },
    { x: -8, y: 8, z: 64, w: 3, h: 1, d: 3 }, { x: -4, y: 11, z: 68, w: 3, h: 1, d: 3 },
    { x: -1, y: 14, z: 72, w: 3.5, h: 1, d: 3.5 }, { x: 1, y: 16, z: 75, w: 3, h: 1, d: 3 },
    { x: 3, y: 18, z: 78, w: 5, h: 1.2, d: 5 },
  ]},
];

export const LEVEL4_GRAFFITI = [
  { text: '<nav> <a href="#"> </a> </nav>', color: '#00FF88' },
  { text: '<input type="text" required />', color: '#61FFD8' },
  { text: '<video autoplay loop></video>', color: '#00f0ff' },
  { text: '<!-- trust no one -->', color: '#FFD700' },
  { text: '<section role="main">', color: '#9D00FF' },
  { text: 'aria-label="bridge"', color: '#FF61D8' },
  { text: '<meta charset="UTF-8" />', color: '#DC143C' },
];

export const LEVEL4_BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — CARGANDO NIVEL 4...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'ACCEDIENDO A PUENTE SUSPENDIDO...', delay: 800, type: 'system' },
  { text: 'ESTADO: ██ ZONA DE VÍNCULO ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: 'ALERTA: VACÍO DE DATOS CORRUPTOS DETECTADO', delay: 3800, type: 'eva' },
  { text: 'No confíes en lo que escuchas. Solo en lo que ves.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 4: LA CONFIANZA...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Puente Suspendido — Zona de Vínculo', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + LLAVE ESMERALDA', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

export const LEVEL4_CINEMATIC_LINES = [
  'El Puente Suspendido se extiende sobre un vacío de datos corruptos.',
  'Es hermoso y frágil, construido con código visible.',
  'Debajo, el vacío pulsa como algo vivo.',
  'Cada paso debe ser calculado. Cada decisión, confiada.',
  ' ',
  'IOI ha desplegado una IA que imita voces conocidas.',
  'Órdenes falsas resuenan en el puente. No te dejes engañar.',
  ' ',
  'Eva cruza sola, pero siente que no debería estarlo.',
  'Resuelve HTML. Encuentra los recuerdos. La confianza se elige.',
];
