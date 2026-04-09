# OASIS: La Última Clave — Las 5 Llaves de Halliday

> Juego 3D narrativo cyberpunk con estética crema/holográfica.
> Built with **Next.js 14 + Three.js + Tailwind CSS + Zustand**

---

## 🎮 Descripción

Eva es la última jugadora en el OASIS. Sus compañeras Suyin y Zuri fueron
eliminadas permanentemente por el Protocolo Veneno_Zagar. Ahora Eva debe
encontrar las 5 llaves de Halliday sola, atravesando mundos corruptos
mientras el sistema se desmorona a su alrededor.

## 🏗 Arquitectura

```
oasis-game/
├── public/                    # Assets estáticos
│   ├── audio/                 # Sonidos del juego
│   ├── textures/              # Texturas
│   └── models/                # Modelos 3D
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.js          # Layout raíz
│   │   └── page.js            # Entry point
│   ├── components/
│   │   ├── game/              # Motor de juego 3D
│   │   │   ├── GameApp.js     # Orquestador principal
│   │   │   ├── GameViewport.js# Viewport Three.js
│   │   │   ├── GameLoop.js    # Ciclo de juego
│   │   │   ├── WorldBuilder.js# Constructor de mundo 3D
│   │   │   └── HudOverlay.js  # Interfaz de juego
│   │   ├── ui/                # Pantallas de UI
│   │   │   ├── MainMenu.js
│   │   │   ├── SettingsScreen.js
│   │   │   ├── CharactersScreen.js
│   │   │   ├── BootSequence.js
│   │   │   ├── CinematicScreen.js
│   │   │   ├── PuzzleModal.js
│   │   │   ├── KeyObtainedScreen.js
│   │   │   ├── VictoryScreen.js
│   │   │   ├── GameOverScreen.js
│   │   │   ├── PauseMenu.js
│   │   │   ├── StatusBar.js
│   │   │   └── LoaderScreen.js
│   │   └── effects/           # Efectos visuales
│   │       └── HolographicOverlay.js
│   ├── constants/
│   │   └── gameConstants.js   # Configuración central
│   ├── lib/
│   │   ├── gameStore.js       # Zustand store
│   │   └── audioManager.js    # Web Audio API
│   ├── patterns/              # Patrones de diseño
│   │   ├── EventBus.js        # Observer pattern
│   │   ├── CommandSystem.js   # Command pattern
│   │   └── BuildingFactory.js # Factory pattern
│   └── styles/
│       └── globals.css        # Estilos globales + Tailwind
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

## 🎯 Patrones de Diseño

| Patrón    | Uso |
|-----------|-----|
| **Observer** (EventBus) | Comunicación desacoplada entre componentes |
| **State Machine** | Transiciones de estado del juego |
| **Command** | Encapsula acciones de input del jugador |
| **Factory** | Generación procedural de edificios |
| **Singleton** | AudioManager, EventBus |

## 🎨 Paleta Visual

- **Base**: Crema (`#F5F0E8`), Arena (`#E8DFD0`), Hueso (`#D9CDB8`)
- **Acentos holográficos**: Rosa (`#FF61D8`), Menta (`#61FFD8`), Lila (`#D861FF`)
- **Neón**: Cyan (`#00F0FF`), Magenta (`#FF0066`), Verde (`#00FF88`), Ámbar (`#FFBB33`)

## 🚀 Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:3000
```

## 🎹 Controles

| Tecla | Acción |
|-------|--------|
| WASD  | Movimiento |
| Mouse | Mirar |
| Space | Saltar |
| E     | Interactuar |
| Q     | Memoria de Equipo |
| M     | Mapa |
| ESC   | Pausa |

## 🔑 Nivel 1: Las Cenizas de la Ciudad

- **Mundo**: Ciudad Neón — Zona de Duelo
- **Objetivo**: Resolver 4 puzzles y encontrar la **Llave Ámbar**
- **Mecánica especial**: Memoria de Equipo (ecos de Suyin y Zuri)
- **Sistema de corrupción**: Avanza con el tiempo, se ralentiza con Memoria

## 🔊 Audio

Audio ambiental generado por sintetizadores con Web Audio API:
- Drones oscuros cyberpunk
- Efectos de boot/arranque
- Sonidos de glitch en corrupción
- Melodías de puzzle resuelto y llave obtenida

## 📋 Stack Tecnológico

- **Next.js 14** — Framework, rutas, SSR
- **Three.js** — Motor 3D (escena, cámara, luces, geometría)
- **Tailwind CSS** — Sistema de diseño
- **Zustand** — Estado global reactivo
- **Web Audio API** — Audio procedural
- **Framer Motion** — Animaciones de UI

## 📝 Licencia

Proyecto educativo — Diseño de Interfaces 2025
