// ══════════════════════════════════════════════════════
//  OASIS GAME CONSTANTS — NIVEL 1 ACTUALIZADO
// ══════════════════════════════════════════════════════

// ─── GAME STATES ───
export const GameStates = {
  LOADING: 'LOADING', LANDING: 'LANDING', REGISTER: 'REGISTER',
  LOGIN: 'LOGIN', MAIN_MENU: 'MAIN_MENU', SETTINGS: 'SETTINGS',
  TRAINING_ROOM: 'TRAINING_ROOM',
  TUTORIAL: 'TUTORIAL', TUTORIAL_GAME: 'TUTORIAL_GAME',
  CREDITS: 'CREDITS', BOOT: 'BOOT', CINEMATIC: 'CINEMATIC',
  PLAYING: 'PLAYING', PUZZLE: 'PUZZLE', MEMORY: 'MEMORY',
  SCREAMER: 'SCREAMER', TOKEN_MEMORY: 'TOKEN_MEMORY',
  KEY_OBTAINED: 'KEY_OBTAINED', PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER', VICTORY: 'VICTORY',
};

// ─── STATE TRANSITIONS ───
export const StateTransitions = {
  [GameStates.LOADING]:       [GameStates.LANDING],
  [GameStates.LANDING]:       [GameStates.REGISTER, GameStates.LOGIN, GameStates.MAIN_MENU],
  [GameStates.REGISTER]:      [GameStates.LANDING, GameStates.LOGIN, GameStates.MAIN_MENU],
  [GameStates.LOGIN]:         [GameStates.LANDING, GameStates.REGISTER, GameStates.MAIN_MENU],
  [GameStates.MAIN_MENU]:     [GameStates.TRAINING_ROOM, GameStates.SETTINGS, GameStates.LANDING],
  [GameStates.SETTINGS]:      [GameStates.MAIN_MENU],
  [GameStates.TRAINING_ROOM]: [GameStates.TUTORIAL_GAME, GameStates.BOOT, GameStates.CREDITS, GameStates.MAIN_MENU],
  [GameStates.TUTORIAL]:      [GameStates.MAIN_MENU],
  [GameStates.TUTORIAL_GAME]: [GameStates.BOOT, GameStates.TRAINING_ROOM],
  [GameStates.CREDITS]:       [GameStates.TRAINING_ROOM],
  [GameStates.BOOT]:          [GameStates.CINEMATIC, GameStates.MAIN_MENU],
  [GameStates.CINEMATIC]:     [GameStates.PLAYING],
  [GameStates.PLAYING]:       [GameStates.PUZZLE, GameStates.MEMORY, GameStates.SCREAMER, GameStates.TOKEN_MEMORY, GameStates.PAUSED, GameStates.GAME_OVER, GameStates.KEY_OBTAINED],
  [GameStates.PUZZLE]:        [GameStates.PLAYING, GameStates.GAME_OVER],
  [GameStates.MEMORY]:        [GameStates.PLAYING],
  [GameStates.SCREAMER]:      [GameStates.PLAYING],
  [GameStates.TOKEN_MEMORY]:  [GameStates.PLAYING],
  [GameStates.KEY_OBTAINED]:  [GameStates.VICTORY],
  [GameStates.PAUSED]:        [GameStates.PLAYING, GameStates.MAIN_MENU],
  [GameStates.GAME_OVER]:     [GameStates.BOOT, GameStates.MAIN_MENU],
  [GameStates.VICTORY]:       [GameStates.CREDITS, GameStates.TRAINING_ROOM],
};

// ─── PLAYER CONFIG ───
export const PLAYER_CONFIG = {
  speed: 0.28,
  sprintSpeed: 0.48,
  jumpForce: 0.35,
  gravity: 0.012,
  height: 3,
  initialLives: 10,
  initialCoins: 0,
};

// ─── MEMORY ECHO CONFIG ───
export const MEMORY_CONFIG = {
  durationFrames: 600,
  durationSeconds: 10,
  cooldownSeconds: 60,
};

// ─── LEVEL 1 PUZZLES (5 puzzles sencillos) ───
// Positions are at the TOP of parkour platforms (y=18 approx)
export const LEVEL1_PUZZLES = [
  { id: 1, position: { x: 55, z: -45, y: 18 }, question: '¿Qué significa HTML? (responde las siglas en inglés)', answer: 'hypertext markup language', hint: 'HyperText Markup Language — el lenguaje base de las páginas web', title: 'LENGUAJE WEB', reward: 300 },
  { id: 2, position: { x: -70, z: 60, y: 18 }, question: '¿Qué símbolo se usa en CSS para seleccionar un ID? (solo el símbolo)', answer: '#', hint: 'No es el punto (.) que es para clases...', title: 'SELECTOR CSS', reward: 300 },
  { id: 3, position: { x: 90, z: 85, y: 18 }, question: 'En JavaScript, ¿qué palabra se usa para declarar una variable que NO cambia?', answer: 'const', hint: 'No es "let" ni "var"... es la que significa constante', title: 'VARIABLE JS', reward: 350 },
  { id: 4, position: { x: -100, z: -90, y: 18 }, question: '¿Cuántos bits tiene 1 byte?', answer: '8', hint: 'Un byte = 8 unidades mínimas de información digital', title: 'BITS Y BYTES', reward: 250 },
  { id: 5, position: { x: 0, z: 110, y: 18 }, question: '¿Qué etiqueta HTML se usa para crear un enlace? (solo la etiqueta, sin < >)', answer: 'a', hint: 'Es una sola letra... la primera del abecedario, de "anchor"', title: 'ENLACES HTML', reward: 350 },
];

// ─── LEVEL 1 CHECKPOINTS ───
export const LEVEL1_CHECKPOINTS = [
  { x: 0, z: 0, label: 'INICIO' },
  { x: 55, z: -45, label: 'SECTOR_A' },
  { x: -70, z: 60, label: 'SECTOR_B' },
  { x: 90, z: 85, label: 'SECTOR_C' },
  { x: -100, z: -90, label: 'SECTOR_D' },
  { x: 0, z: 110, label: 'SECTOR_E' },
  { x: 0, z: -140, label: 'LLAVE_ÁMBAR' },
];

// ─── TOKEN SYSTEM (3 recuerdos + 2 screamers) ───
export const LEVEL1_TOKENS = [
  { id: 'mem1', type: 'memory', position: { x: 35, z: 35 }, image: 'girls_together', title: 'RECUERDO: Juntas', text: 'Las tres amigas, inseparables. Antes de que todo cambiara.' },
  { id: 'mem2', type: 'memory', position: { x: -50, z: -35 }, image: 'girls_fighting', title: 'RECUERDO: La Pelea', text: 'El día que discutieron. Las palabras que nunca pudieron retirar.' },
  { id: 'mem3', type: 'memory', position: { x: 75, z: -65 }, image: 'eva_grandpa', title: 'RECUERDO: El Abuelo', text: 'Eva y su abuelo, el día que le enseñó a programar por primera vez.' },
  { id: 'scare1', type: 'screamer', position: { x: -25, z: 85 }, color: 'red', title: '⚠ VIRUS DETECTADO' },
  { id: 'scare2', type: 'screamer', position: { x: 60, z: -25 }, color: 'green', title: '⚠ MALWARE INFILTRADO' },
];

// ─── PARKOUR PLATFORMS (Ascending — puzzle terminal at TOP) ───
// Each parkour path: 7 blocks going progressively higher
// Start ~ground level, end at y=18 where the puzzle sits
export const LEVEL1_PARKOUR = [
  // Parkour to Puzzle 1 (x:55, z:-45) — approach from south
  { puzzleId: 1, blocks: [
    { x: 35, y: 2,  z: -25, w: 4.5, h: 1, d: 4.5 },
    { x: 40, y: 5,  z: -28, w: 3.5, h: 1, d: 3.5 },
    { x: 44, y: 8,  z: -32, w: 3,   h: 1, d: 3 },
    { x: 47, y: 11, z: -36, w: 3,   h: 1, d: 3 },
    { x: 50, y: 14, z: -39, w: 3.5, h: 1, d: 3.5 },
    { x: 52, y: 16, z: -42, w: 3,   h: 1, d: 3 },
    { x: 55, y: 18, z: -45, w: 5,   h: 1.5, d: 5 },
  ]},
  // Parkour to Puzzle 2 (x:-70, z:60)
  { puzzleId: 2, blocks: [
    { x: -50, y: 2,  z: 42, w: 4.5, h: 1, d: 4.5 },
    { x: -54, y: 5,  z: 46, w: 3.5, h: 1, d: 3.5 },
    { x: -58, y: 8,  z: 50, w: 3,   h: 1, d: 3 },
    { x: -62, y: 11, z: 53, w: 3,   h: 1, d: 3 },
    { x: -65, y: 14, z: 56, w: 3.5, h: 1, d: 3.5 },
    { x: -68, y: 16, z: 58, w: 3,   h: 1, d: 3 },
    { x: -70, y: 18, z: 60, w: 5,   h: 1.5, d: 5 },
  ]},
  // Parkour to Puzzle 3 (x:90, z:85)
  { puzzleId: 3, blocks: [
    { x: 70, y: 2,  z: 67, w: 4.5, h: 1, d: 4.5 },
    { x: 74, y: 5,  z: 71, w: 3.5, h: 1, d: 3.5 },
    { x: 78, y: 8,  z: 74, w: 3,   h: 1, d: 3 },
    { x: 82, y: 11, z: 78, w: 3,   h: 1, d: 3 },
    { x: 85, y: 14, z: 81, w: 3.5, h: 1, d: 3.5 },
    { x: 88, y: 16, z: 83, w: 3,   h: 1, d: 3 },
    { x: 90, y: 18, z: 85, w: 5,   h: 1.5, d: 5 },
  ]},
  // Parkour to Puzzle 4 (x:-100, z:-90)
  { puzzleId: 4, blocks: [
    { x: -80, y: 2,  z: -72, w: 4.5, h: 1, d: 4.5 },
    { x: -84, y: 5,  z: -76, w: 3.5, h: 1, d: 3.5 },
    { x: -88, y: 8,  z: -80, w: 3,   h: 1, d: 3 },
    { x: -92, y: 11, z: -83, w: 3,   h: 1, d: 3 },
    { x: -95, y: 14, z: -86, w: 3.5, h: 1, d: 3.5 },
    { x: -98, y: 16, z: -88, w: 3,   h: 1, d: 3 },
    { x: -100, y: 18, z: -90, w: 5, h: 1.5, d: 5 },
  ]},
  // Parkour to Puzzle 5 (x:0, z:110)
  { puzzleId: 5, blocks: [
    { x: -15, y: 2,  z: 90, w: 4.5, h: 1, d: 4.5 },
    { x: -10, y: 5,  z: 94, w: 3.5, h: 1, d: 3.5 },
    { x: -6,  y: 8,  z: 98, w: 3,   h: 1, d: 3 },
    { x: -3,  y: 11, z: 102, w: 3,  h: 1, d: 3 },
    { x: -1,  y: 14, z: 105, w: 3.5, h: 1, d: 3.5 },
    { x: 0,   y: 16, z: 108, w: 3,  h: 1, d: 3 },
    { x: 0,   y: 18, z: 110, w: 5,  h: 1.5, d: 5 },
  ]},
];

// ─── GRAFFITI TEXTS ───
export const GRAFFITI_TEXTS = [
  { text: 'SUYIN_WAVE estuvo aquí', color: '#00f0ff' },
  { text: 'ZURI_APEX // SIEMPRE', color: '#ff0066' },
  { text: '< No las olvides >', color: '#9d00ff' },
  { text: 'echo $SUYIN $ZURI', color: '#00ff88' },
  { text: '// TODO: volver juntas', color: '#ff6600' },
  { text: 'SUYIN.exists() → false', color: '#00f0ff' },
  { text: 'ZURI.rebuild() → DENIED', color: '#ff0066' },
];

// ─── BOOT MESSAGES ───
export const BOOT_MESSAGES = [
  { text: 'OASIS KERNEL v8.91.2 — INICIALIZANDO...', delay: 0, type: 'system' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 400, type: 'progress' },
  { text: 'CARGANDO MÓDULOS DE REALIDAD VIRTUAL...', delay: 800, type: 'system' },
  { text: 'ESTADO DEL SISTEMA: ██ CRÍTICO ██', delay: 1200, type: 'critical' },
  { text: ' ', delay: 1500, type: 'blank' },
  { text: ' ', delay: 3500, type: 'blank' },
  { text: 'USUARIO ACTIVO: EVA_STRIDER_∞', delay: 3800, type: 'eva' },
  { text: 'Eva continúa. Eva es la última.', delay: 4200, type: 'eva' },
  { text: ' ', delay: 4800, type: 'blank' },
  { text: 'CARGANDO NIVEL 1: LAS CENIZAS DE LA CIUDAD...', delay: 5200, type: 'loading' },
  { text: 'ZONA: Estación Espacial Neón', delay: 5600, type: 'system' },
  { text: 'OBJETIVO: Resolver 5 puzzles + Encontrar 3 recuerdos + Localizar LLAVE ÁMBAR', delay: 6000, type: 'amber' },
  { text: ' ', delay: 6400, type: 'blank' },
  { text: '▶ PRESIONA ENTER PARA CONTINUAR', delay: 6800, type: 'prompt' },
];

// ─── CINEMATIC LINES ───
export const CINEMATIC_LINES = [
  'La Ciudad Neón ya no es lo que era.',
  'Los NPCs que Suyin solía saludar están atrapados en bucles infinitos.',
  'Los atajos que Zuri conocía de memoria... bloqueados.',
  'El mapa que las tres memorizaron juntas ahora solo lo recuerda Eva.',
  ' ',
  'En las paredes, fragmentos de código de Suyin y Zuri.',
  'Grafiti digital. Un recordatorio de que alguien más estuvo aquí.',
  ' ',
  'Eva avanza sola. No porque quiera. Porque es lo único que queda.',
  'Busca los recuerdos. Resuelve los puzzles. Encuentra la llave.',
];

// ─── BUILDING TYPES (Iconic Futuristic Architecture) ───
export const BUILDING_CONFIGS = {
  skyscraper: { wRange: [8, 14], hRange: [30, 80], dRange: [8, 14], color: 0xD9CDB8, emissiveMul: 0.2 },
  tower: { wRange: [5, 8], hRange: [20, 50], dRange: [5, 8], color: 0xC4B49A, emissiveMul: 0.15 },
  block: { wRange: [12, 20], hRange: [8, 20], dRange: [12, 20], color: 0xE8DFD0, emissiveMul: 0.1 },
  neonTower: { wRange: [4, 8], hRange: [40, 75], dRange: [4, 8], color: 0xA89880, emissiveMul: 0.25 },
  pyramid: { wRange: [10, 18], hRange: [20, 50], dRange: [10, 18], color: 0xCCBBAA, emissiveMul: 0.2 },
  gherkin: { wRange: [6, 10], hRange: [40, 70], dRange: [6, 10], color: 0xAADDEE, emissiveMul: 0.22 },
  flatiron: { wRange: [10, 16], hRange: [25, 55], dRange: [4, 7], color: 0xDDCCBB, emissiveMul: 0.15 },
  twistTower: { wRange: [5, 9], hRange: [45, 85], dRange: [5, 9], color: 0xBBCCDD, emissiveMul: 0.28 },
  geodesic: { wRange: [10, 18], hRange: [15, 30], dRange: [10, 18], color: 0xCCEEFF, emissiveMul: 0.2 },
  spiral: { wRange: [8, 14], hRange: [25, 50], dRange: [8, 14], color: 0xDDBBCC, emissiveMul: 0.22 },
  lotus: { wRange: [12, 20], hRange: [18, 35], dRange: [12, 20], color: 0xFFDDEE, emissiveMul: 0.18 },
  habitat: { wRange: [14, 22], hRange: [15, 30], dRange: [14, 22], color: 0xCCCCBB, emissiveMul: 0.12 },
  dome: { wRange: [10, 18], hRange: [12, 25], dRange: [10, 18], color: 0xDDEEFF, emissiveMul: 0.2 },
  cubeHouse: { wRange: [6, 10], hRange: [10, 18], dRange: [6, 10], color: 0xEEDDAA, emissiveMul: 0.16 },
  radialTower: { wRange: [6, 12], hRange: [50, 90], dRange: [6, 12], color: 0xCCBBDD, emissiveMul: 0.3 },
};

// ─── NEON COLORS ───
export const NEON_EDGE_COLORS = [0x00f0ff, 0xff0066, 0x9d00ff, 0x00ff88, 0xff6600, 0xFF61D8, 0x61FFD8, 0xD861FF];

// ─── KEYS DATA ───
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

export const TUTORIAL_STEPS = [
  { icon: 'move', keys: 'W A S D', title: 'MOVIMIENTO BÁSICO', desc: 'Usa las teclas W, A, S y D para desplazarte por el mundo del OASIS. W avanza hacia adelante, S retrocede, A se mueve a la izquierda y D a la derecha. Practica moviéndote en diferentes direcciones para familiarizarte con los controles.' },
  { icon: 'run', keys: 'SHIFT', title: 'CORRER', desc: 'Mantén presionada la tecla SHIFT mientras te mueves para correr a mayor velocidad. Correr consume más energía pero te permite cubrir grandes distancias rápidamente. Es esencial para escapar de trampas y llegar a tiempo a ciertos objetivos.' },
  { icon: 'camera', keys: 'MOUSE', title: 'CONTROL DE CÁMARA', desc: 'Mueve el ratón para girar la cámara y observar tu entorno en todas direcciones. Haz clic en la pantalla para activar el modo de juego y capturar el cursor. La cámara sigue tus movimientos del ratón en primera persona.' },
  { icon: 'jump', keys: 'ESPACIO', title: 'SALTAR Y PARKOUR', desc: 'Presiona la barra espaciadora para saltar. Puedes saltar sobre obstáculos, plataformas elevadas y bloques de parkour. Combina el salto con el movimiento WASD para alcanzar zonas altas donde hay tokens y puzzles escondidos.' },
  { icon: 'interact', keys: 'E', title: 'INTERACTUAR', desc: 'Cuando te acerques a un terminal de puzzle, un token flotante o cualquier objeto interactivo, verás un indicador en pantalla. Presiona E para activar la interacción. Esto abrirá puzzles, recogerá tokens o activará mecanismos del juego.' },
  { icon: 'memory', keys: 'Q', title: 'INVOCAR MEMORIAS', desc: 'Presiona Q para invocar los ecos de Suyin y Zuri, las compañeras perdidas de Eva. Sus siluetas fantasmales aparecerán brevemente mostrándote pistas sobre la ubicación de objetos importantes. Tiene un tiempo de recarga entre usos.' },
  { icon: 'puzzle', keys: 'TECLADO', title: 'RESOLVER PUZZLES', desc: 'Los puzzles son terminales naranjas flotantes distribuidos por la ciudad. Al interactuar con uno, aparecerá una pregunta de programación. Escribe la respuesta correcta y confirma. Cada puzzle resuelto te acerca a la llave del nivel y te recompensa con monedas.' },
  { icon: 'map', keys: 'MINIMAP', title: 'EL MAPA', desc: 'En la esquina superior derecha tienes un minimapa que muestra tu posición, los puzzles (círculos), los tokens (diamantes amarillos) y la llave. Los elementos amarillos están pendientes de recoger. Cuando los completes, se volverán verdes. Úsalo para orientarte.' },
  { icon: 'key', keys: 'PUZZLES', title: 'LAS LLAVES DE HALLIDAY', desc: 'Para completar cada nivel necesitas encontrar una Llave de Halliday. La llave aparece solo después de resolver suficientes puzzles. Busca el brillo dorado en el mapa y acércate para recogerla. Cada llave desbloquea el siguiente nivel del OASIS.' },
  { icon: 'token', keys: 'EXPLORAR', title: 'RECUERDOS Y TOKENS', desc: 'Los diamantes amarillos flotantes son tokens coleccionables. Los de tipo "recuerdo" muestran escenas del pasado de Eva y sus amigas. Los de tipo "glitch" son trampas que activan screamers. Todos aparecen en el minimap — explora cada rincón de la ciudad para encontrarlos.' },
  { icon: 'trap', keys: 'CUIDADO', title: 'TRAMPAS Y SCREAMERS', desc: 'Algunos tokens son trampas disfrazadas. Al activarlos, un screamer aparecerá en pantalla y perderás una vida. Observa bien los tokens antes de acercarte. Si pierdes todas tus vidas, el juego termina. Mantén tus vidas al máximo evitando las trampas.' },
  { icon: 'health', keys: 'VIDAS', title: 'BARRA DE VIDA', desc: 'Tienes 10 corazones de vida representados en la esquina superior izquierda. Cada trampa o screamer te quita un corazón. Si llegas a cero, es game over. No hay forma de recuperar vidas en este nivel, así que juega con precaución y observa bien antes de actuar.' },
  { icon: 'parkour', keys: 'PLATAFORMAS', title: 'PARKOUR Y EXPLORACIÓN', desc: 'La ciudad tiene bloques de parkour elevados con colores neón que puedes escalar saltando. Algunos puzzles y tokens están en las alturas. Busca los haces de luz que iluminan desde el suelo hacia el cielo — estos marcan zonas importantes de exploración.' },
  { icon: 'pause', keys: 'ESC', title: 'PAUSA Y CONFIGURACIÓN', desc: 'Presiona ESC en cualquier momento durante el juego para pausar. Desde el menú de pausa puedes ajustar el volumen, los controles y las opciones de accesibilidad. También puedes volver al menú principal desde ahí. El juego se detiene completamente mientras estés en pausa.' },
];

export const REGISTER_RULES = {
  name: { min: 2, max: 50, label: 'Nombre' },
  nickname: { min: 3, max: 20, label: 'Apodo' },
  email: { min: 5, max: 100, label: 'Correo' },
  password: { min: 8, max: 30, label: 'Contraseña' },
};
