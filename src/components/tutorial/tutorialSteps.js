// Pasos del tutorial (calibración)
export const TUTORIAL_STEPS = [
  {
    id: 0,
    icon: 'INIT',
    title: 'SALA DE ENTRENAMIENTO',
    instruction:
      'Protocolo de calibración iniciado. Captura el cursor para activar los controles.',
    subtext: 'Haz clic en la pantalla para continuar.',
    type: 'click',
  },
  {
    id: 1,
    icon: 'CAM',
    title: 'CONTROL VISUAL',
    instruction:
      'Mueve el mouse para ajustar el campo de visión. Reconoce el entorno antes de avanzar.',
    subtext: 'Mueve el mouse para continuar',
    type: 'mouse',
    requiredMouseMove: 300,
  },
  {
    id: 2,
    icon: 'MOV',
    title: 'DESPLAZAMIENTO',
    instruction:
      'Usa W, A, S y D para desplazarte. W avanza, S retrocede, A y D controlan el movimiento lateral.',
    subtext: 'Desplázate usando WASD',
    type: 'move',
    requiredKeys: ['KeyW', 'KeyA', 'KeyS', 'KeyD'],
    requiredUnique: 3,
  },
  {
    id: 3,
    icon: 'RUN',
    title: 'VELOCIDAD',
    instruction:
      'Mantén SHIFT mientras te desplazas para aumentar la velocidad. Necesario para cubrir distancias largas.',
    subtext: 'Mantén SHIFT + W para correr',
    type: 'sprint',
    holdDuration: 1500,
  },
  {
    id: 4,
    icon: 'JMP',
    title: 'SALTO',
    instruction:
      'Presiona ESPACIO para saltar. Indispensable para superar obstáculos y alcanzar plataformas elevadas.',
    subtext: 'Ejecuta 2 saltos',
    type: 'jump',
    requiredCount: 2,
  },
  {
    id: 5,
    icon: 'END',
    title: 'CALIBRACIÓN COMPLETA',
    instruction:
      'Los controles básicos han sido registrados. Eva está lista para ingresar al OASIS.',
    subtext: 'Presiona ENTER o haz clic para continuar',
    type: 'final',
  },
];
