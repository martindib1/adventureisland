import { Scene } from 'phaser';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  create() {
   
    // Crear el jugador y habilitar colisiones ===
    // Ajusta coords o usa un ObjectLayer para leer el punto de spawn
    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(0.3);


    // Cámara y límites igual al tamaño del mapa ===
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Controles y animaciones ===
    this.cursors = this.input.keyboard.createCursorKeys();

    if (!this.anims.exists('walk')) {
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player',{ start:0,end:3 }),
        frameRate: 14,
        repeat: -1
      });
      this.anims.create({ key: 'idle', frames:[{ key:'player',frame:0 }], frameRate:10 });
      this.anims.create({ key: 'jump', frames:[{ key:'player',frame:0 }], frameRate:10 });
    }
  }

  update() {
    // Movimiento horizontal
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-550).setFlipX(true);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(550).setFlipX(false);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    }
    else {
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down) this.player.play('idle', true);
    }

    // Salto
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-300);
      this.player.play('jump', true);
    }
  }
}