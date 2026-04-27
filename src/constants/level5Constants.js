// ══════════════════════════════════════════════════════
//  LEVEL 5 CONSTANTS — CORAZÓN DEL OASIS
//  Mundo: Zona Cero — Corazón del Sistema
//  Llave: BLANCA — "El final no es el destino. Es la consecuencia."
// ══════════════════════════════════════════════════════

export const LEVEL5_PUZZLES = [
  { id: 1, position: { x: 42, z: -36, y: 18 }, question: '¿En Tailwind, qué clase crea un contenedor centrado y responsive?', answer: 'container', hint: 'Es la misma palabra en inglés y español', title: 'TAILWIND: LAYOUT', reward: 400 },
  { id: 2, position: { x: -53, z: 47, y: 18 }, question: '¿Qué hook de React se usa para ejecutar efectos secundarios (como llamadas a APIs)?', answer: 'useEffect', hint: 'use + Efecto en inglés', title: 'REACT: HOOKS', reward: 450 },
  { id: 3, position: { x: 67, z: 63, y: 18 }, question: '¿Qué propiedad de Flexbox alinea los items en el eje transversal (vertical)?', answer: 'align-items', hint: 'align-???', title: 'CSS: FLEXBOX', reward: 400 },
  { id: 4, position: { x: -73, z: -67, y: 18 }, question: '¿Qué método HTTP se usa para ACTUALIZAR un recurso existente completamente?', answer: 'PUT', hint: 'Tres letras, como "poner"', title: 'HTTP: MÉTODOS', reward: 350 },
  { id: 5, position: { x: 2, z: 77, y: 18 }, question: '¿Qué clase de Tailwind aplica sombra grande a un elemento? (box-shadow grande)', answer: 'shadow-lg', hint: 'shadow + abreviación de "large"', title: 'TAILWIND: EFECTOS', reward: 450 },
];

export const LEVEL5_TOKENS = [
  { id: 'l5_mem1', type: 'memory', position: { x: 26, z: 23 }, image: 'core_beginning', title: 'RECUERDO: El Comienzo', text: 'El día que Halliday encendió el OASIS por primera vez. El código era puro.' },
  { id: 'l5_mem2', type: 'memory', position: { x: -37, z: -27 }, image: 'alternate_eva', title: 'RECUERDO: La Otra Eva', text: 'Una versión de Eva que tomó decisiones diferentes. ¿Cuál es la real?' },
  { id: 'l5_mem3', type: 'memory', position: { x: 53, z: -52 }, image: 'final_message', title: 'RECUERDO: Mensaje Final', text: 'Halliday dejó un último mensaje: "El OASIS es un espejo. Muestra lo que eliges ser."' },
  { id: 'l5_scare1', type: 'screamer', position: { x: -23, z: 63 }, color: 'white', title: 'REALIDAD FRAGMENTADA' },
  { id: 'l5_scare2', type: 'screamer', position: { x: 43, z: -17 }, color: 'silver', title: 'VERSIÓN ALTERNATIVA' },
];

export const LEVEL5_CHECKPOINTS = [
  { x: 0, z: 0, label: 'NÚCLEO' },
  { x: 42, z: -36, label: 'SALA_ECO' },
  { x: -53, z: 47, label: 'SALA_ESPEJO' },
  { x: 67, z: 63, label: 'SALA_VACÍO' },
  { x: -73, z: -67, label: 'SALA_MEMORIA' },
  { x: 2, z: 77, label: 'SALA_FINAL' },
  { x: 0, z: -80, label: 'LLAVE_BLANCA' },
];

export const LEVEL5_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 19, y: 2, z: -17, w: 4.5, h: 1, d: 4.5 }, { x: 23, y: 5, z: -21, w: 3.5, h: 1, d: 3.5 },
    { x: 27, y: 8, z: -25, w: 3, h: 1, d: 3 }, { x: 31, y: 11, z: -29, w: 3, h: 1, d: 3 },
    { x: 35, y: 14, z: -32, w: 3.5, h: 1, d: 3.5 }, { x: 39, y: 16, z: -34, w: 3, h: 1, d: 3 },
    { x: 42, y: 18, z: -36, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -29, y: 2, z: 27, w: 4.5, h: 1, d: 4.5 }, { x: -33, y: 5, z: 31, w: 3.5, h: 1, d: 3.5 },
    { x: -37, y: 8, z: 35, w: 3, h: 1, d: 3 }, { x: -41, y: 11, z: 39, w: 3, h: 1, d: 3 },
    { x: -45, y: 14, z: 43, w: 3.5, h: 1, d: 3.5 }, { x: -49, y: 16, z: 45, w: 3, h: 1, d: 3 },
    { x: -53, y: 18, z: 47, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 69, y: 2, z: 39, w: 4.5, h: 1, d: 4.5 }, { x: 69, y: 5, z: 45, w: 3.5, h: 1, d: 3.5 },
    { x: 68, y: 8, z: 50, w: 3, h: 1, d: 3 }, { x: 68, y: 11, z: 55, w: 3, h: 1, d: 3 },
    { x: 67, y: 14, z: 59, w: 3.5, h: 1, d: 3.5 }, { x: 67, y: 16, z: 61, w: 3, h: 1, d: 3 },
    { x: 67, y: 18, z: 63, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -51, y: 2, z: -47, w: 4.5, h: 1, d: 4.5 }, { x: -55, y: 5, z: -51, w: 3.5, h: 1, d: 3.5 },
    { x: -59, y: 8, z: -55, w: 3, h: 1, d: 3 }, { x: -63, y: 11, z: -59, w: 3, h: 1, d: 3 },
    { x: -67, y: 14, z: -63, w: 3.5, h: 1, d: 3.5 }, { x: -70, y: 16, z: -65, w: 3, h: 1, d: 3 },
    { x: -73, y: 18, z: -67, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -17, y: 2, z: 55, w: 4.5, h: 1, d: 4.5 }, { x: -13, y: 5, z: 59, w: 3.5, h: 1, d: 3.5 },
    { x: -9, y: 8, z: 63, w: 3, h: 1, d: 3 }, { x: -5, y: 11, z: 67, w: 3, h: 1, d: 3 },
    { x: -2, y: 14, z: 71, w: 3.5, h: 1, d: 3.5 }, { x: 0, y: 16, z: 74, w: 3, h: 1, d: 3 },
    { x: 2, y: 18, z: 77, w: 5, h: 1.2, d: 5 },
  ]},
];

export const LEVEL5_GRAFFITI = [
  { text: 'className="container mx-auto"', color: '#FFFFFF' },
  { text: 'useEffect(() => {}, [])', color: '#61FFD8' },
  { text: 'align-items: center;', color: '#FF61D8' },
  { text: '// The end is the consequence', color: '#D861FF' },
  { text: 'fetch("/api/truth").then(r=>r)', color: '#FFD700' },
  { text: 'shadow-lg hover:shadow-xl', color: '#00f0ff' },
  { text: 'return <Reality />', color: '#00FF88' },
];

export const LEVEL5_BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — CARGANDO NIVEL FINAL...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'ACCEDIENDO AL CORAZÓN DEL OASIS...', delay: 800, type: 'system' },
  { text: 'ESTADO: ██ ZONA CERO — ACCESO FINAL ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: 'HALLIDAY ESTÁ AQUÍ. NO COMO ENEMIGO NI COMO GUÍA.', delay: 3800, type: 'eva' },
  { text: 'Como testigo. El final no es el destino.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 5: EL NÚCLEO...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Corazón del OASIS — Zona Cero', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + LLAVE BLANCA', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

export const LEVEL5_CINEMATIC_LINES = [
  'El Corazón del OASIS es el lugar más diferente de todos.',
  'No hay obstáculos físicos. No hay enemigos. No hay carrera.',
  'Solo una sala que se construye y destruye en tiempo real.',
  'Las paredes son fragmentos de todo lo que Eva ha vivido.',
  ' ',
  'Halliday está aquí. Observa en silencio.',
  'El sistema muestra versiones alternativas de Eva.',
  'Por un momento, no está claro cuál es la real.',
  ' ',
  'Este es el final. Cada decisión es una consecuencia.',
  'Resuelve todo. Recuerda todo. Encuentra la última llave.',
];
