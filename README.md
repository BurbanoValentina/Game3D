# OASIS: La Última Clave — Las 5 Llaves de Halliday

> Juego 3D narrativo cyberpunk con estética crema/holográfica.
> Built with **Next.js 14 + Three.js + Tailwind CSS + Zustand**

---

## Descripción

Eva es la última jugadora en el OASIS. Sus compañeras fueron
eliminadas permanentemente por el Protocolo Veneno_Zagar. Ahora Eva debe
encontrar las 5 llaves de Halliday sola, atravesando mundos corruptos
mientras el sistema se desmorona a su alrededor.

## Arquitectura del Proyecto

```mermaid
graph TD
    A["src/"] --> B["app/"]
    A --> C["components/"]
    A --> D["constants/"]
    A --> E["lib/"]
    A --> F["patterns/"]
    A --> G["styles/"]
    
    B --> B1["layout.js"]
    B --> B2["page.js"]
    B --> B3["api/auth/"]
    
    C --> C1["game/"]
    C --> C2["ui/"]
    C --> C3["effects/"]
    
    C1 --> C1A["GameApp.js"]
    C1 --> C1B["GameViewport.js"]
    C1 --> C1C["GameLoop.js"]
    C1 --> C1D["WorldBuilder.js"]
    C1 --> C1E["HudOverlay.js"]
    
    C2 --> C2A["MainMenu.js"]
    C2 --> C2B["LoaderScreen.js"]
    C2 --> C2C["SettingsScreen.js"]
    C2 --> C2D["CharactersScreen.js"]
    C2 --> C2E["PuzzleModal.js"]
    C2 --> C2F["VictoryScreen.js"]
    C2 --> C2G["GameOverScreen.js"]
    
    C3 --> C3A["HolographicOverlay.js"]
    
    D --> D1["gameConstants.js"]
    E --> E1["gameStore.js"]
    E --> E2["audioManager.js"]
    E --> E3["database.js"]
    
    F --> F1["EventBus.js"]
    F --> F2["CommandSystem.js"]
    F --> F3["BuildingFactory.js"]
    
    G --> G1["globals.css"]
```

## Flujo del Juego

```mermaid
stateDiagram-v2
    [*] --> BootSequence
    
    BootSequence --> MainMenu: Inicialization Complete
    
    MainMenu --> LoaderScreen: New Game
    MainMenu --> LoaderScreen: Load Game
    MainMenu --> SettingsScreen: Settings
    MainMenu --> CreditsScreen: Credits
    
    SettingsScreen --> MainMenu
    CreditsScreen --> MainMenu
    
    LoaderScreen --> GameViewport: Assets Ready
    
    GameViewport --> PuzzleModal: Puzzle Trigger
    GameViewport --> PauseMenu: ESC
    GameViewport --> GameOver: Health = 0
    
    PuzzleModal --> GameViewport: Solved
    PauseMenu --> GameViewport: Resume
    PauseMenu --> MainMenu: Quit
    
    GameOver --> MainMenu
    GameViewport --> VictoryScreen: All Keys Found
    VictoryScreen --> MainMenu
```

## Patrones de Diseño

```mermaid
classDiagram
    class EventBus {
        -listeners: Map
        +subscribe()
        +publish()
        +unsubscribe()
    }
    
    class CommandSystem {
        -commands: Stack
        +execute()
        +undo()
        +redo()
    }
    
    class BuildingFactory {
        +createBuilding()
        +generateProceduralStructure()
    }
    
    class GameStore {
        -state: Object
        +getState()
        +setState()
        +subscribe()
    }
    
    class AudioManager {
        -context: AudioContext
        +playSound()
        +stopSound()
        +synthesize()
    }
    
    note for EventBus "Observer Pattern"
    note for CommandSystem "Command Pattern"
    note for BuildingFactory "Factory Pattern"
    note for GameStore "Singleton + State"
    note for AudioManager "Singleton"
```

## Stack Tecnológico

```mermaid
graph LR
    subgraph Frontend["Frontend & Rendering"]
        A["Next.js 14"]
        B["Three.js"]
        C["Tailwind CSS"]
        D["Framer Motion"]
    end
    
    subgraph State["State Management"]
        E["Zustand"]
        F["Zustand Persist"]
    end
    
    subgraph Audio["Audio & Media"]
        G["Web Audio API"]
        H["Synthesizers"]
    end
    
    subgraph Assets["Assets"]
        I["Models 3D"]
        J["Textures"]
        K["Audio"]
    end
    
    A --> B
    A --> C
    B --> D
    C --> D
    E --> A
    G --> A
    I --> B
    J --> B
    K --> G
    F --> E
```

## Paleta Visual

```mermaid
graph LR
    subgraph Base["Base Colors"]
        B1["Crema #F5F0E8"]
        B2["Arena #E8DFD0"]
        B3["Hueso #D9CDB8"]
    end
    
    subgraph Holographic["Holographic Accents"]
        H1["Rosa #FF61D8"]
        H2["Menta #61FFD8"]
        H3["Lila #D861FF"]
    end
    
    subgraph Neon["Neon Colors"]
        N1["Cyan #00F0FF"]
        N2["Magenta #FF0066"]
        N3["Verde #00FF88"]
        N4["Ámbar #FFBB33"]
    end
```

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:3000
```

## Controles de Juego

```mermaid
graph TD
    subgraph Movement["Movimiento"]
        M1["WASD"]
        M2["Space - Saltar"]
    end
    
    subgraph Camera["Cámara"]
        C1["Mouse - Mirar"]
    end
    
    subgraph Interaction["Interacción"]
        I1["E - Interactuar"]
        I2["Q - Memoria de Equipo"]
        I3["M - Mapa"]
    end
    
    subgraph Menu["Menú"]
        MN1["ESC - Pausa"]
    end
```

## Nivel 1: Las Cenizas de la Ciudad

```mermaid
flowchart LR
    Start["Inicio: Ciudad Neón"] 
    --> Puzzle1["Puzzle 1"]
    --> Puzzle2["Puzzle 2"]
    --> Puzzle3["Puzzle 3"]
    --> Puzzle4["Puzzle 4"]
    --> KeyFound["Llave Ámbar Obtenida"]
    --> Victory["Victoria"]
```

**Características del Nivel:**
- Mundo: Ciudad Neón, Zona de Duelo
- Sistema de corrupción que avanza con el tiempo
- Memoria de Equipo (ecos de Suyin y Zuri) que ralentiza la corrupción
- 4 puzzles para resolver

## Sistema de Audio

**Generación procedural con Web Audio API:**
- Drones oscuros cyberpunk para atmosfera
- Efectos de boot/arranque para UI
- Sonidos de glitch durante corrupción
- Melodías para puzzle resuelto
- Melodías para llave obtenida

## Licencia

Proyecto educativo — Diseño de Interfaces 2025
