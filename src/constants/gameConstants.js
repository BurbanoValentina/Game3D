// ══════════════════════════════════════════════════════
//  OASIS GAME CONSTANTS — NIVEL 1 (MUNDO REDUCIDO)
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
  [GameStates.VICTORY]: [GameStates.CREDITS, GameStates.TRAINING_ROOM],
};

export const PLAYER_CONFIG = { speed: 0.28, sprintSpeed: 0.48, jumpForce: 0.35, gravity: 0.012, height: 3, initialLives: 10, initialCoins: 0 };
export const MEMORY_CONFIG = { durationFrames: 600, durationSeconds: 10, cooldownSeconds: 60 };
export const WORLD_SIZE = 250;
export const WORLD_HALF = 125;

export const LEVEL1_PUZZLES = [
  { id: 1, position: { x: 55, z: -45, y: 18 }, question: '¿Qué significa HTML? (siglas en inglés)', answer: 'hypertext markup language', hint: 'HyperText Markup Language', title: 'LENGUAJE WEB', reward: 300 },
  { id: 2, position: { x: -70, z: 60, y: 18 }, question: '¿Qué símbolo se usa en CSS para seleccionar un ID?', answer: '#', hint: 'No es el punto (.)', title: 'SELECTOR CSS', reward: 300 },
  { id: 3, position: { x: 90, z: 85, y: 18 }, question: 'En JS, ¿qué palabra declara una variable que NO cambia?', answer: 'const', hint: 'No es "let" ni "var"', title: 'VARIABLE JS', reward: 350 },
  { id: 4, position: { x: -100, z: -90, y: 18 }, question: '¿Cuántos bits tiene 1 byte?', answer: '8', hint: '8 unidades mínimas', title: 'BITS Y BYTES', reward: 250 },
  { id: 5, position: { x: 0, z: 110, y: 18 }, question: '¿Qué etiqueta HTML crea un enlace? (sin < >)', answer: 'a', hint: 'Primera letra, de "anchor"', title: 'ENLACES HTML', reward: 350 },
];

export const LEVEL1_CHECKPOINTS = [
  { x: 0, z: 0, label: 'INICIO' }, { x: 55, z: -45, label: 'SECTOR_A' },
  { x: -70, z: 60, label: 'SECTOR_B' }, { x: 90, z: 85, label: 'SECTOR_C' },
  { x: -100, z: -90, label: 'SECTOR_D' }, { x: 0, z: 110, label: 'SECTOR_E' },
  { x: 0, z: -95, label: 'LLAVE_ÁMBAR' },
];

export const LEVEL1_TOKENS = [
  { id: 'mem1', type: 'memory', position: { x: 35, z: 35 }, image: 'girls_together', title: 'RECUERDO: Juntas', text: 'Las tres amigas, inseparables. Antes de que todo cambiara.' },
  { id: 'mem2', type: 'memory', position: { x: -50, z: -35 }, image: 'girls_fighting', title: 'RECUERDO: La Pelea', text: 'El día que discutieron. Las palabras que nunca pudieron retirar.' },
  { id: 'mem3', type: 'memory', position: { x: 75, z: -65 }, image: 'eva_grandpa', title: 'RECUERDO: El Abuelo', text: 'Eva y su abuelo, el día que le enseñó a programar.' },
  { id: 'scare1', type: 'screamer', position: { x: -25, z: 85 }, color: 'red', title: 'VIRUS DETECTADO' },
  { id: 'scare2', type: 'screamer', position: { x: 60, z: -25 }, color: 'green', title: 'MALWARE INFILTRADO' },
];

export const LEVEL1_PARKOUR = [
  { puzzleId: 1, blocks: [
    { x: 35, y: 2, z: -25, w: 4.5, h: 1, d: 4.5 }, { x: 40, y: 5, z: -28, w: 3.5, h: 1, d: 3.5 },
    { x: 44, y: 8, z: -32, w: 3, h: 1, d: 3 }, { x: 47, y: 11, z: -36, w: 3, h: 1, d: 3 },
    { x: 50, y: 14, z: -39, w: 3.5, h: 1, d: 3.5 }, { x: 52, y: 16, z: -42, w: 3, h: 1, d: 3 },
    { x: 55, y: 18, z: -45, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 2, blocks: [
    { x: -50, y: 2, z: 45, w: 4.5, h: 1, d: 4.5 }, { x: -55, y: 5, z: 48, w: 3.5, h: 1, d: 3.5 },
    { x: -58, y: 8, z: 52, w: 3, h: 1, d: 3 }, { x: -62, y: 11, z: 55, w: 3, h: 1, d: 3 },
    { x: -65, y: 14, z: 57, w: 3.5, h: 1, d: 3.5 }, { x: -68, y: 16, z: 59, w: 3, h: 1, d: 3 },
    { x: -70, y: 18, z: 60, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 3, blocks: [
    { x: 72, y: 2, z: 68, w: 4.5, h: 1, d: 4.5 }, { x: 76, y: 5, z: 72, w: 3.5, h: 1, d: 3.5 },
    { x: 80, y: 8, z: 75, w: 3, h: 1, d: 3 }, { x: 83, y: 11, z: 78, w: 3, h: 1, d: 3 },
    { x: 86, y: 14, z: 81, w: 3.5, h: 1, d: 3.5 }, { x: 88, y: 16, z: 83, w: 3, h: 1, d: 3 },
    { x: 90, y: 18, z: 85, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 4, blocks: [
    { x: -80, y: 2, z: -72, w: 4.5, h: 1, d: 4.5 }, { x: -84, y: 5, z: -76, w: 3.5, h: 1, d: 3.5 },
    { x: -88, y: 8, z: -79, w: 3, h: 1, d: 3 }, { x: -92, y: 11, z: -82, w: 3, h: 1, d: 3 },
    { x: -95, y: 14, z: -85, w: 3.5, h: 1, d: 3.5 }, { x: -98, y: 16, z: -88, w: 3, h: 1, d: 3 },
    { x: -100, y: 18, z: -90, w: 5, h: 1.2, d: 5 },
  ]},
  { puzzleId: 5, blocks: [
    { x: -18, y: 2, z: 90, w: 4.5, h: 1, d: 4.5 }, { x: -14, y: 5, z: 94, w: 3.5, h: 1, d: 3.5 },
    { x: -10, y: 8, z: 98, w: 3, h: 1, d: 3 }, { x: -6, y: 11, z: 102, w: 3, h: 1, d: 3 },
    { x: -3, y: 14, z: 105, w: 3.5, h: 1, d: 3.5 }, { x: -1, y: 16, z: 108, w: 3, h: 1, d: 3 },
    { x: 0, y: 18, z: 110, w: 5, h: 1.2, d: 5 },
  ]},
];

export const GRAFFITI_TEXTS = [
  { text: 'if (hope) { keep_going(); }', color: '#00f0ff' },
  { text: 'while(alive) { fight(); }', color: '#ff0066' },
  { text: 'EVA.find("la_verdad")', color: '#ffbb33' },
  { text: '/* No estás sola */', color: '#00ff88' },
  { text: '< No mires atrás >', color: '#9d00ff' },
  { text: 'echo $EVA $MEMORY', color: '#00ff88' },
  { text: '// TODO: volver juntas', color: '#ff6600' },
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
  { icon: 'puzzle', keys: 'TECLADO', title: 'RESOLVER PUZZLES', desc: 'Interactúa con terminales naranjas y responde preguntas de programación.' },
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
