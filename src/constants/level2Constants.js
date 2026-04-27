// ══════════════════════════════════════════════════════
//  LEVEL 2 CONSTANTS — BIBLIOTECA DE HALLIDAY
//  Mundo: Biblioteca Infinita — Zona de Memoria
//  Llave: ÍNDIGO — "El pasado no se entiende. Se escucha."
// ══════════════════════════════════════════════════════

export const LEVEL2_PUZZLES = [
  { id: 1, position: { x: 40, z: -35, y: 18 }, question: '¿Qué método de array devuelve un nuevo array con los elementos que cumplen una condición?', answer: 'filter', hint: 'Piensa en "filtrar" elementos', title: 'JS: ARRAYS', reward: 350 },
  { id: 2, position: { x: -50, z: 45, y: 18 }, question: '¿Qué palabra clave declara una variable que NO puede ser reasignada?', answer: 'const', hint: 'Abreviación de "constante"', title: 'JS: VARIABLES', reward: 300 },
  { id: 3, position: { x: 65, z: 60, y: 18 }, question: '¿Qué método convierte un string JSON en un objeto JavaScript?', answer: 'JSON.parse', hint: 'JSON + un verbo que significa "analizar"', title: 'JS: JSON', reward: 400 },
  { id: 4, position: { x: -70, z: -65, y: 18 }, question: '¿Qué operador verifica TIPO y VALOR a la vez en JavaScript?', answer: '===', hint: 'Son tres signos iguales', title: 'JS: OPERADORES', reward: 300 },
  { id: 5, position: { x: 5, z: 75, y: 18 }, question: '¿Qué método de array ejecuta una función por cada elemento y devuelve un NUEVO array?', answer: 'map', hint: 'Como un "mapa" que transforma datos', title: 'JS: FUNCIONAL', reward: 350 },
];

export const LEVEL2_TOKENS = [
  { id: 'l2_mem1', type: 'memory', position: { x: 30, z: 20 }, image: 'halliday_young', title: 'RECUERDO: Halliday Joven', text: 'Un fragmento del diario: "Creé el OASIS porque el mundo real me asustaba."' },
  { id: 'l2_mem2', type: 'memory', position: { x: -40, z: -30 }, image: 'library_secret', title: 'RECUERDO: El Secreto', text: 'Una página arrancada. Halliday sabía que alguien vendría a buscar las llaves.' },
  { id: 'l2_mem3', type: 'memory', position: { x: 50, z: -55 }, image: 'girls_promise', title: 'RECUERDO: La Promesa', text: 'Las tres prometieron que nunca dejarían que IOI controlara el OASIS.' },
  { id: 'l2_scare1', type: 'screamer', position: { x: -25, z: 60 }, color: 'indigo', title: 'PÁGINA CORRUPTA' },
  { id: 'l2_scare2', type: 'screamer', position: { x: 40, z: -15 }, color: 'purple', title: 'SOMBRA DE HALLIDAY' },
];

export const LEVEL2_CHECKPOINTS = [
  { x: 0, z: 0, label: 'VESTÍBULO' },
  { x: 40, z: -35, label: 'ALA_NORTE' },
  { x: -50, z: 45, label: 'ALA_SUR' },
  { x: 65, z: 60, label: 'ARCHIVO' },
  { x: -70, z: -65, label: 'SÓTANO' },
  { x: 5, z: 75, label: 'CÚPULA' },
  { x: 0, z: -80, label: 'LLAVE_ÍNDIGO' },
];

export const LEVEL2_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 18, y: 2, z: -18, w: 4.5, h: 1, d: 4.5 }, { x: 22, y: 5, z: -22, w: 3.5, h: 1, d: 3.5 },
    { x: 26, y: 8, z: -26, w: 3, h: 1, d: 3 }, { x: 30, y: 11, z: -29, w: 3, h: 1, d: 3 },
    { x: 34, y: 14, z: -32, w: 3.5, h: 1, d: 3.5 }, { x: 37, y: 16, z: -34, w: 3, h: 1, d: 3 },
    { x: 40, y: 18, z: -35, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -28, y: 2, z: 28, w: 4.5, h: 1, d: 4.5 }, { x: -32, y: 5, z: 32, w: 3.5, h: 1, d: 3.5 },
    { x: -36, y: 8, z: 36, w: 3, h: 1, d: 3 }, { x: -40, y: 11, z: 40, w: 3, h: 1, d: 3 },
    { x: -44, y: 14, z: 43, w: 3.5, h: 1, d: 3.5 }, { x: -47, y: 16, z: 44, w: 3, h: 1, d: 3 },
    { x: -50, y: 18, z: 45, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 70, y: 2, z: 38, w: 4.5, h: 1, d: 4.5 }, { x: 69, y: 5, z: 44, w: 3.5, h: 1, d: 3.5 },
    { x: 68, y: 8, z: 49, w: 3, h: 1, d: 3 }, { x: 67, y: 11, z: 53, w: 3, h: 1, d: 3 },
    { x: 66, y: 14, z: 56, w: 3.5, h: 1, d: 3.5 }, { x: 65, y: 16, z: 58, w: 3, h: 1, d: 3 },
    { x: 65, y: 18, z: 60, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -48, y: 2, z: -45, w: 4.5, h: 1, d: 4.5 }, { x: -52, y: 5, z: -49, w: 3.5, h: 1, d: 3.5 },
    { x: -56, y: 8, z: -53, w: 3, h: 1, d: 3 }, { x: -60, y: 11, z: -57, w: 3, h: 1, d: 3 },
    { x: -64, y: 14, z: -61, w: 3.5, h: 1, d: 3.5 }, { x: -67, y: 16, z: -63, w: 3, h: 1, d: 3 },
    { x: -70, y: 18, z: -65, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -15, y: 2, z: 55, w: 4.5, h: 1, d: 4.5 }, { x: -11, y: 5, z: 59, w: 3.5, h: 1, d: 3.5 },
    { x: -7, y: 8, z: 63, w: 3, h: 1, d: 3 }, { x: -3, y: 11, z: 67, w: 3, h: 1, d: 3 },
    { x: 0, y: 14, z: 70, w: 3.5, h: 1, d: 3.5 }, { x: 2, y: 16, z: 73, w: 3, h: 1, d: 3 },
    { x: 5, y: 18, z: 75, w: 5, h: 1.2, d: 5 },
  ]},
];

export const LEVEL2_GRAFFITI = [
  { text: 'console.log("OASIS")', color: '#4B0082' },
  { text: 'const key = await find()', color: '#FFD700' },
  { text: 'if (memory) remember()', color: '#9D00FF' },
  { text: '// Halliday was here', color: '#FF6600' },
  { text: 'return Promise.resolve(truth)', color: '#00FF88' },
  { text: 'try { trust() } catch(e) {}', color: '#00f0ff' },
  { text: 'Object.freeze(memories)', color: '#FF61D8' },
];

export const LEVEL2_BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — CARGANDO NIVEL 2...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'ACCEDIENDO A BIBLIOTECA DE HALLIDAY...', delay: 800, type: 'system' },
  { text: 'ESTADO: ██ ZONA DE MEMORIA ACTIVA ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: 'USUARIO ACTIVO: EVA_STRIDER_∞', delay: 3800, type: 'eva' },
  { text: 'Los libros recuerdan lo que todos olvidaron.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 2: EL RECUERDO...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Biblioteca de Halliday — Zona de Memoria', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + LLAVE ÍNDIGO', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

export const LEVEL2_CINEMATIC_LINES = [
  'La Biblioteca de Halliday se extiende más allá de lo visible.',
  'Cada libro contiene un fragmento de su vida.',
  'Las estanterías llegan hasta el infinito.',
  'La iluminación es sepia y cálida, pero entre los libros hay huecos negros.',
  ' ',
  'Páginas que se reescriben solas flotan en el aire.',
  'Sombras de Halliday observan desde los pasillos.',
  ' ',
  'Eva sabe que las respuestas están aquí. Codificadas en JavaScript.',
  'Busca los recuerdos. Descifra los enigmas. Encuentra la llave.',
];
