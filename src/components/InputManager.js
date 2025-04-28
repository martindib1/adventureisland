export class InputManager {
    constructor(scene) {
      this.scene = scene;
      this.pad = null;
  
      this.movement = { x: 0, y: 0 };
      this.shootPressed = false;
      this.lastMenuMoveTime = 0;
    }
  
    setup() {
        // Verifica todos los gamepads al iniciar
        const pads = this.scene.input.gamepad.gamepads;
        if (pads.length > 0) {
          this.pad = pads[0];
          console.log("🎮 Gamepad ya conectado:", this.pad.id);
        }
      
        // Escucha futuras conexiones
        this.scene.input.gamepad.once("connected", (pad) => {
          console.log("🎮 Gamepad conectado:", pad.id);
          this.pad = pad;
        });
    }

    update() {
      if (!this.pad) return;
  
      // Movimiento del stick izquierdo (ejes 0 y 1)
      const x = this.pad.axes.length > 0 ? this.pad.axes[0].getValue() * 1.0 : 0; // Escalar valores.
      const y = this.pad.axes.length > 1 ? this.pad.axes[1].getValue() : 0;
  
      this.movement.x = Math.abs(x) > 0.1 ? x : 0;
      this.movement.y = Math.abs(y) > 0.1 ? y : 0;
  
      // Disparo con botones A/B/X/Y (botones 0-3 en la mayoría de controles)
      this.shootPressed =
        this.pad.buttons[0].pressed || // A
        this.pad.buttons[1].pressed || // B
        this.pad.buttons[2].pressed || // X
        this.pad.buttons[3].pressed; // Y
    }
  
    getMovement() {
      return this.movement;
    }
  
    isShooting() {
      return this.shootPressed;
    }
  
    // Para menús, devuelve "up" o "down" con antirebote
    getMenuNavigation() {
      const now = this.scene.time.now;
  
      if (Math.abs(this.movement.y) > 0.5 && now - this.lastMenuMoveTime > 300) {
        this.lastMenuMoveTime = now;
        return this.movement.y < 0 ? "up" : "down";
      }
  
      return null;
    }
  }