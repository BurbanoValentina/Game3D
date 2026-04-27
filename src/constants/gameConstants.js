// ══════════════════════════════════════════════════════
//  OASIS GAME CONSTANTS — TODOS LOS NIVELES
// ══════════════════════════════════════════════════════

export const GameStates = {
  LOADING: 'LOADING', LANDING: 'LANDING', REGISTER: 'REGISTER',
  LOGIN: 'LOGIN', MAIN_MENU: 'MAIN_MENU', SETTINGS: 'SETTINGS',
  TRAINING_ROOM: 'TRAINING_ROOM',
  TUTORIAL: 'TUTORIAL', TUTORIAL_GAME: 'TUTORIAL_GAME',
  CREDITS: 'CREDITS', BOOT: 'BOOT', CINEMATIC: 'CINEMATIC',
  AWAKENING: 'AWAKENING',
  PLAYING: 'PLAYING', PUZZLE: 'PUZZLE', MEMORY: 'MEMORY',
  SCREAMER: 'SCREAMER', TOKEN_MEMORY: 'TOKEN_MEMORY',
  WRONG_ANSWER: 'WRONG_ANSWER',
  KEY_OBTAINED: 'KEY_OBTAINED', PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER', VICTORY: 'VICTORY',
};

export const StateTransitions = {
  [GameStates.LOADING]: [GameStates.LANDING],
  [GameStates.LANDING]: [GameStates.REGISTER, GameStates.LOGIN, GameStates.MAIN_MENU],
  [GameStates.REGISTER]: [GameStates.LANDING, GameStates.LOGIN, GameStates.MAIN_MENU],
  [GameStates.LOGIN]: [GameStates.LANDING, GameStates.REGISTER, GameStates.MAIN_MENU],
  [GameStates.MAIN_MENU]: [GameStates.TRAINING_ROOM, GameStates.SETTINGS, GameStates.LANDING],
  [GameStates.SETTINGS]: [GameStates.MAIN_MENU],
  [GameStates.TRAINING_ROOM]: [GameStates.TUTORIAL_GAME, GameStates.BOOT, GameStates.CREDITS, GameStates.MAIN_MENU],
  [GameStates.TUTORIAL]: [GameStates.MAIN_MENU],
  [GameStates.TUTORIAL_GAME]: [GameStates.BOOT, GameStates.TRAINING_ROOM],
  [GameStates.CREDITS]: [GameStates.TRAINING_ROOM],
  [GameStates.BOOT]: [GameStates.CINEMATIC, GameStates.MAIN_MENU],
  [GameStates.CINEMATIC]: [GameStates.AWAKENING],
  [GameStates.AWAKENING]: [GameStates.PLAYING],
  [GameStates.PLAYING]: [GameStates.PUZZLE, GameStates.MEMORY, GameStates.SCREAMER, GameStates.TOKEN_MEMORY, GameStates.PAUSED, GameStates.GAME_OVER, GameStates.KEY_OBTAINED],
  [GameStates.PUZZLE]: [GameStates.PLAYING, GameStates.WRONG_ANSWER, GameStates.GAME_OVER],
  [GameStates.WRONG_ANSWER]: [GameStates.PLAYING, GameStates.GAME_OVER],
  [GameStates.MEMORY]: [GameStates.PLAYING],
  [GameStates.SCREAMER]: [GameStates.PLAYING],
  [GameStates.TOKEN_MEMORY]: [GameStates.PLAYING],
  [GameStates.KEY_OBTAINED]: [GameStates.VICTORY],
  [GameStates.PAUSED]: [GameStates.PLAYING, GameStates.MAIN_MENU],
  [GameStates.GAME_OVER]: [GameStates.BOOT, GameStates.MAIN_MENU],
  [GameStates.VICTORY]: [GameStates.CREDITS, GameStates.TRAINING_ROOM, GameStates.BOOT],
};

export const PLAYER_CONFIG = { speed: 0.28, sprintSpeed: 0.48, jumpForce: 0.35, gravity: 0.012, height: 3, initialLives: 10, initialCoins: 0 };
export const MEMORY_CONFIG = { durationFrames: 600, durationSeconds: 10, cooldownSeconds: 60 };
export const WORLD_SIZE = 250;
export const WORLD_HALF = 125;

export const LEVEL1_PUZZLES = [
  { id: 1, position: { x: 45, z: -40, y: 18 }, question: '¿Qué clase de Tailwind centra el texto horizontalmente?', answer: 'text-center', hint: 'Empieza con "text-"', title: 'TAILWIND: TEXTO', reward: 300 },
  { id: 2, position: { x: -55, z: 50, y: 18 }, question: '¿Qué clase de Tailwind aplica display: flex a un contenedor?', answer: 'flex', hint: 'Solo una palabra, como el modelo de caja', title: 'TAILWIND: FLEXBOX', reward: 300 },
  { id: 3, position: { x: 70, z: 70, y: 18 }, question: '¿Qué clase de Tailwind oculta un elemento? (display: none)', answer: 'hidden', hint: 'Sinónimo de "oculto" en inglés', title: 'TAILWIND: DISPLAY', reward: 350 },
  { id: 4, position: { x: -75, z: -70, y: 18 }, question: '¿Qué prefijo de Tailwind aplica estilos en hover? (ej: ___:bg-blue-500)', answer: 'hover', hint: 'Es la acción de pasar el mouse por encima', title: 'TAILWIND: ESTADOS', reward: 250 },
  { id: 5, position: { x: 0, z: 80, y: 18 }, question: '¿Qué clase de Tailwind redondea completamente un elemento? (border-radius: 9999px)', answer: 'rounded-full', hint: 'rounded + forma circular', title: 'TAILWIND: BORDES', reward: 350 },
];

export const LEVEL1_CHECKPOINTS = [
  { x: 0, z: 0, label: 'INICIO' }, { x: 45, z: -40, label: 'SECTOR_A' },
  { x: -55, z: 50, label: 'SECTOR_B' }, { x: 70, z: 70, label: 'SECTOR_C' },
  { x: -75, z: -70, label: 'SECTOR_D' }, { x: 0, z: 80, label: 'SECTOR_E' },
  { x: 0, z: -75, label: 'LLAVE_ÁMBAR' },
];

export const LEVEL1_TOKENS = [
  { id: 'mem1', type: 'memory', position: { x: 25, z: 25 }, image: 'girls_together', title: 'RECUERDO: Juntas', text: 'Las tres amigas, inseparables. Antes de que todo cambiara.' },
  { id: 'mem2', type: 'memory', position: { x: -35, z: -25 }, image: 'girls_fighting', title: 'RECUERDO: La Pelea', text: 'El día que discutieron. Las palabras que nunca pudieron retirar.' },
  { id: 'mem3', type: 'memory', position: { x: 55, z: -50, }, image: 'eva_grandpa', title: 'RECUERDO: El Abuelo', text: 'Eva y su abuelo, el día que le enseñó a programar.' },
  { id: 'scare1', type: 'screamer', position: { x: -20, z: 65 }, color: 'red', title: 'VIRUS DETECTADO' },
  { id: 'scare2', type: 'screamer', position: { x: 45, z: -20 }, color: 'green', title: 'MALWARE INFILTRADO' },
];

export const LEVEL1_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 20, y: 2, z: -20, w: 4.5, h: 1, d: 4.5 }, { x: 24, y: 5, z: -25, w: 3.5, h: 1, d: 3.5 },
    { x: 28, y: 8, z: -29, w: 3, h: 1, d: 3 }, { x: 33, y: 11, z: -33, w: 3, h: 1, d: 3 },
    { x: 37, y: 14, z: -36, w: 3.5, h: 1, d: 3.5 }, { x: 41, y: 16, z: -38, w: 3, h: 1, d: 3 },
    { x: 45, y: 18, z: -40, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -30, y: 2, z: 30, w: 4.5, h: 1, d: 4.5 }, { x: -33, y: 5, z: 34, w: 3.5, h: 1, d: 3.5 },
    { x: -37, y: 8, z: 40, w: 3, h: 1, d: 3 }, { x: -42, y: 11, z: 45, w: 3, h: 1, d: 3 },
    { x: -47, y: 14, z: 48, w: 3.5, h: 1, d: 3.5 }, { x: -51, y: 16, z: 49, w: 3, h: 1, d: 3 },
    { x: -55, y: 18, z: 50, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 75, y: 2, z: 42, w: 4.5, h: 1, d: 4.5 }, { x: 74, y: 5, z: 48, w: 3.5, h: 1, d: 3.5 },
    { x: 73, y: 8, z: 54, w: 3, h: 1, d: 3 }, { x: 72, y: 11, z: 59, w: 3, h: 1, d: 3 },
    { x: 71, y: 14, z: 63, w: 3.5, h: 1, d: 3.5 }, { x: 70, y: 16, z: 67, w: 3, h: 1, d: 3 },
    { x: 70, y: 18, z: 70, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -50, y: 2, z: -48, w: 4.5, h: 1, d: 4.5 }, { x: -55, y: 5, z: -52, w: 3.5, h: 1, d: 3.5 },
    { x: -59, y: 8, z: -56, w: 3, h: 1, d: 3 }, { x: -63, y: 11, z: -60, w: 3, h: 1, d: 3 },
    { x: -67, y: 14, z: -64, w: 3.5, h: 1, d: 3.5 }, { x: -71, y: 16, z: -67, w: 3, h: 1, d: 3 },
    { x: -75, y: 18, z: -70, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -18, y: 2, z: 58, w: 4.5, h: 1, d: 4.5 }, { x: -14, y: 5, z: 62, w: 3.5, h: 1, d: 3.5 },
    { x: -10, y: 8, z: 66, w: 3, h: 1, d: 3 }, { x: -7, y: 11, z: 70, w: 3, h: 1, d: 3 },
    { x: -4, y: 14, z: 74, w: 3.5, h: 1, d: 3.5 }, { x: -2, y: 16, z: 77, w: 3, h: 1, d: 3 },
    { x: 0, y: 18, z: 80, w: 5, h: 1.2, d: 5 },
  ]},
];

export const GRAFFITI_TEXTS = [
  { text: 'className="flex items-center"', color: '#00f0ff' },
  { text: 'hover:bg-violet-500', color: '#ff0066' },
  { text: '<div class="p-4 rounded-lg">', color: '#ffbb33' },
  { text: '/* Tailwind lo cambia todo */', color: '#00ff88' },
  { text: 'md:grid-cols-3 gap-4', color: '#9d00ff' },
  { text: 'transition-all duration-300', color: '#00ff88' },
  { text: '// TODO: dark:bg-gray-900', color: '#ff6600' },
];

export const NEON_EDGE_COLORS = [0x00f0ff, 0xff0066, 0x9d00ff, 0x00ff88, 0xff6600, 0xFF61D8, 0x61FFD8, 0xD861FF];

export const BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — INICIALIZANDO...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'CARGANDO MÓDULOS DE REALIDAD VIRTUAL...', delay: 800, type: 'system' },
  { text: 'ESTADO DEL SISTEMA: ██ CRÍTICO ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: 'USUARIO ACTIVO: EVA_STRIDER_∞', delay: 3800, type: 'eva' },
  { text: 'Eva continúa. Eva es la última.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 1: LAS CENIZAS DE LA CIUDAD...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Estación Espacial Neón', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + LLAVE ÁMBAR', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

export const CINEMATIC_LINES = [
  'La Ciudad Neón ya no es lo que era.',
  'Los NPCs están atrapados en bucles infinitos.',
  'Los atajos del sistema... bloqueados.',
  'El mapa que las tres memorizaron juntas ahora solo lo recuerda Eva.',
  ' ', 'En las paredes, fragmentos de código corrupto.',
  'Grafiti digital. Un recordatorio de que alguien más estuvo aquí.',
  ' ', 'Eva avanza sola. No porque quiera. Porque es lo único que queda.',
  'Busca los recuerdos. Resuelve los puzzles. Encuentra la llave.',
];

export const BUILDING_CONFIGS = {
  skyscraper: { wRange: [8, 14], hRange: [30, 80], dRange: [8, 14] },
  tower: { wRange: [5, 8], hRange: [20, 50], dRange: [5, 8] },
  block: { wRange: [12, 20], hRange: [8, 20], dRange: [12, 20] },
  neonTower: { wRange: [4, 8], hRange: [40, 75], dRange: [4, 8] },
  pyramid: { wRange: [10, 18], hRange: [20, 50], dRange: [10, 18] },
  gherkin: { wRange: [6, 10], hRange: [40, 70], dRange: [6, 10] },
  flatiron: { wRange: [10, 16], hRange: [25, 55], dRange: [4, 7] },
  twistTower: { wRange: [5, 9], hRange: [45, 85], dRange: [5, 9] },
  geodesic: { wRange: [10, 18], hRange: [15, 30], dRange: [10, 18] },
  spiral: { wRange: [8, 14], hRange: [25, 50], dRange: [8, 14] },
  lotus: { wRange: [12, 20], hRange: [18, 35], dRange: [12, 20] },
  habitat: { wRange: [14, 22], hRange: [15, 30], dRange: [14, 22] },
  dome: { wRange: [10, 18], hRange: [12, 25], dRange: [10, 18] },
  cubeHouse: { wRange: [6, 10], hRange: [10, 18], dRange: [6, 10] },
  radialTower: { wRange: [6, 12], hRange: [50, 90], dRange: [6, 12] },
};

export const KEYS = [
  { id: 1, name: 'LLAVE ÁMBAR', color: '#FFBB33', level: 1, quote: 'La velocidad no es prisa. Es dirección que nadie más eligió por ti.' },
  { id: 2, name: 'LLAVE ÍNDIGO', color: '#4B0082', level: 2, quote: 'El pasado no se entiende. Se escucha.' },
  { id: 3, name: 'LLAVE CARMESÍ', color: '#DC143C', level: 3, quote: 'Ganar sin comprender es solo ruido.' },
  { id: 4, name: 'LLAVE ESMERALDA', color: '#00FF88', level: 4, quote: 'La confianza no se construye. Se elige.' },
  { id: 5, name: 'LLAVE BLANCA', color: '#FFFFFF', level: 5, quote: 'El final no es el destino.' },
];

export const CONTROLS = [
  { key: 'WASD', label: 'Mover' }, { key: 'SHIFT', label: 'Correr' },
  { key: 'MOUSE', label: 'Mirar' }, { key: 'SPACE', label: 'Saltar' },
  { key: 'E', label: 'Interactuar' }, { key: 'Q', label: 'Memoria' }, { key: 'ESC', label: 'Pausa' },
];

export const CREDITS_DATA = [
  { name: 'Vanessa Mena', role: 'Diseñadora de Interfaces & UI/UX', description: 'Diseño visual del OASIS, sistema de menús, paleta holográfica.', photo: '/vanessa.png', color: '#00f0ff' },
  { name: 'Valeria Góngora', role: 'Desarrolladora de Lógica & Motor 3D', description: 'Motor Three.js, sistema de puzzles, física del juego.', photo: '/valeria.png', color: '#FF61D8' },
  { name: 'Valentina Burbano', role: 'Narrativa, QA & Base de Datos', description: 'Historia del OASIS, sistema de registro, base de datos.', photo: '/valentina.png', color: '#61FFD8' },
];

export const CHARACTERS = {
  eva: { name: 'Eva', status: 'ACTIVA', color: '#00F0FF' },
};

export const TUTORIAL_STEPS = [
  { icon: 'move', keys: 'W A S D', title: 'MOVIMIENTO BÁSICO', desc: 'Usa las teclas W, A, S y D para desplazarte por el mundo del OASIS.' },
  { icon: 'run', keys: 'SHIFT', title: 'CORRER', desc: 'Mantén SHIFT mientras te mueves para correr a mayor velocidad.' },
  { icon: 'camera', keys: 'MOUSE', title: 'CONTROL DE CÁMARA', desc: 'Mueve el ratón para girar la cámara en primera persona.' },
  { icon: 'jump', keys: 'ESPACIO', title: 'SALTAR Y PARKOUR', desc: 'Presiona espacio para saltar sobre plataformas de parkour.' },
  { icon: 'interact', keys: 'E', title: 'INTERACTUAR', desc: 'Presiona E cerca de terminales de puzzle o tokens flotantes.' },
  { icon: 'memory', keys: 'Q', title: 'INVOCAR MEMORIAS', desc: 'Presiona Q para invocar ecos de memoria con pistas.' },
  { icon: 'puzzle', keys: 'TECLADO', title: 'RESOLVER PUZZLES', desc: 'Interactúa con terminales naranjas y responde preguntas de Tailwind CSS.' },
  { icon: 'map', keys: 'MINIMAP', title: 'EL MAPA', desc: 'El minimapa muestra puzzles, tokens y tu posición.' },
  { icon: 'key', keys: 'PUZZLES', title: 'LAS LLAVES DE HALLIDAY', desc: 'Resuelve puzzles para revelar la Llave de Halliday.' },
  { icon: 'token', keys: 'EXPLORAR', title: 'RECUERDOS Y TOKENS', desc: 'Recoge diamantes flotantes: recuerdos o trampas glitch.' },
  { icon: 'trap', keys: 'CUIDADO', title: 'TRAMPAS Y SCREAMERS', desc: 'Algunos tokens son virus disfrazados que quitan vida.' },
  { icon: 'health', keys: 'VIDAS', title: 'BARRA DE VIDA', desc: 'Tienes 10 corazones. Cada trampa quita uno. A cero, game over.' },
  { icon: 'parkour', keys: 'PLATAFORMAS', title: 'PARKOUR', desc: 'Escala bloques neón para alcanzar puzzles en las alturas.' },
  { icon: 'pause', keys: 'ESC', title: 'PAUSA', desc: 'Presiona ESC para pausar y ajustar configuración.' },
];

export const REGISTER_RULES = {
  name: { min: 2, max: 50, label: 'Nombre' },
  nickname: { min: 3, max: 20, label: 'Apodo' },
  email: { min: 5, max: 100, label: 'Correo' },
  password: { min: 8, max: 30, label: 'Contraseña' },
};

// ══════════════════════════════════════════════════════
//  MULTI-LEVEL CONFIGURATION
// ══════════════════════════════════════════════════════

export const TOTAL_LEVELS = 5;

export const LEVEL_NAMES = {
  1: 'LAS CENIZAS DE LA CIUDAD',
  2: 'EL RECUERDO',
  3: 'EL DESAFÍO',
  4: 'LA CONFIANZA',
  5: 'EL NÚCLEO',
};

export const LEVEL_WORLDS = {
  1: 'Estación Espacial Neón',
  2: 'Biblioteca de Halliday — Zona de Memoria',
  3: 'Arena Digital — Zona de Competencia',
  4: 'Puente Suspendido — Zona de Vínculo',
  5: 'Corazón del OASIS — Zona Cero',
};

export const LEVEL_DIFFICULTY = {
  1: { stars: 1, label: 'Básico' },
  2: { stars: 2, label: 'Básico' },
  3: { stars: 3, label: 'Intermedio' },
  4: { stars: 4, label: 'Avanzado' },
  5: { stars: 5, label: 'Final' },
};
