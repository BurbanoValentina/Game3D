// ══════════════════════════════════════════════════════
//  PATTERN: Command (Input Actions)
//  Encapsula acciones del jugador como objetos command
// ══════════════════════════════════════════════════════

import EventBus from './EventBus';

// ─── Base Command ───
class Command {
  execute(player) {
    throw new Error('Command.execute() must be implemented');
  }
}

// ─── Movement Commands ───
export class MoveForwardCommand extends Command {
  execute(player) {
    player.velocity.z = -player.speed;
  }
}

export class MoveBackCommand extends Command {
  execute(player) {
    player.velocity.z = player.speed;
  }
}

export class MoveLeftCommand extends Command {
  execute(player) {
    player.velocity.x = -player.speed;
  }
}

export class MoveRightCommand extends Command {
  execute(player) {
    player.velocity.x = player.speed;
  }
}

// ─── Action Commands ───
export class JumpCommand extends Command {
  execute(player) {
    if (player.grounded) {
      player.velocity.y = player.jumpForce;
      player.grounded = false;
      EventBus.emit('playerJump', player.position);
    }
  }
}

export class InteractCommand extends Command {
  execute(player) {
    EventBus.emit('interact', {
      x: player.position.x,
      y: player.position.y,
      z: player.position.z,
    });
  }
}

export class SprintCommand extends Command {
  execute(player) {
    player.sprinting = true;
  }
}

export class MemoryCommand extends Command {
  execute(player) {
    EventBus.emit('activateMemory');
  }
}

export class PauseCommand extends Command {
  execute(player) {
    EventBus.emit('togglePause');
  }
}

export class MapCommand extends Command {
  execute(player) {
    EventBus.emit('toggleMap');
  }
}

// ─── Command Registry ───
export const createCommandMap = () => ({
  KeyW:      new MoveForwardCommand(),
  KeyS:      new MoveBackCommand(),
  KeyA:      new MoveLeftCommand(),
  KeyD:      new MoveRightCommand(),
  Space:     new JumpCommand(),
  KeyE:      new InteractCommand(),
  ShiftLeft: new SprintCommand(),
  KeyQ:      new MemoryCommand(),
  Escape:    new PauseCommand(),
  KeyM:      new MapCommand(),
});

// ─── Input Manager ───
export class InputManager {
  constructor() {
    this.keys = {};
    this._justPressed = {};
    this.mouse = { x: 0, y: 0, locked: false };
    this.commands = createCommandMap();
    this._onKeyDown = null;
    this._onKeyUp = null;
    this._onMouseMove = null;
    this._active = false;
  }

  activate() {
    if (this._active) return;
    this._active = true;

    this._onKeyDown = (e) => {
      if (!this.keys[e.code]) this._justPressed[e.code] = true;
      this.keys[e.code] = true;
    };

    this._onKeyUp = (e) => {
      this.keys[e.code] = false;
    };

    this._onMouseMove = (e) => {
      if (!document.pointerLockElement) return;
      this.mouse.x += e.movementX;
      this.mouse.y += e.movementY;
    };

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
  }

  deactivate() {
    if (!this._active) return;
    this._active = false;

    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);

    this.keys = {};
    this._justPressed = {};
    this.mouse = { x: 0, y: 0, locked: false };
  }

  processInput(player) {
    Object.entries(this.keys).forEach(([code, pressed]) => {
      if (pressed && this.commands[code]) {
        // Jump only on first press, not while held
        if (code === 'Space') {
          if (this._justPressed[code]) this.commands[code].execute(player);
        } else {
          this.commands[code].execute(player);
        }
      }
    });
    this._justPressed = {};
  }

  consumeMouse() {
    const mx = this.mouse.x;
    const my = this.mouse.y;
    this.mouse.x = 0;
    this.mouse.y = 0;
    return { x: mx, y: my };
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }
}

export default InputManager;
