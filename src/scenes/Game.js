// Game2.js
import { Scene } from 'phaser';

export class Game extends Scene {
  constructor() {
    super('Game');
  }

  create() {
    // === 1) Fondo ===
    const bg = this.add.image(0, 0, 'mapita').setOrigin(0, 0);

    // === 2) Plataformas ===
    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(2430, 414, 'plataforma')
      .setScale(1)
      .refreshBody();

    // === 3) Rocas (obstáculo para proyectiles y jugador) ===
    this.rocks = this.physics.add.staticGroup();
    this.rocks.create(600, 400, 'roca').setScale(1).refreshBody();
    this.rocks.create(1200, 400, 'roca').setScale(1).refreshBody();

    // === 4) Jugador + colisiones contra plataformas y rocas ===
    this.player = this.physics.add.sprite(100, 350, 'player')
      .setBounce(0.1)
      .setCollideWorldBounds(true)
      .setScale(1);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.rocks);

    // === 5) Mundo & cámara ===
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);
    this.physics.world.setBounds(0, 0, bg.width, bg.height);

    // === 6) Huevos recolectables ===
    this.eggs = this.physics.add.staticGroup();
    this.eggs.create(400, 350, 'huevoAtaque').setScale(1).refreshBody();
    this.eggs.create(800, 350, 'huevoFuego').setScale(1).refreshBody();
    this.physics.add.overlap(this.player, this.eggs, this.collectEgg, null, this);

    // === 7) Grupos de proyectiles ===
    this.attackProjectiles = this.physics.add.group();
    this.fireProjectiles   = this.physics.add.group();

    // Rebote en rocas para attack
    this.physics.add.collider(this.attackProjectiles, this.rocks, (p, r) => {
      // al chocar con roca se detiene y cae despacio
      p.setVelocity(0, 0);
      p.body.setGravityY(200);
    });

    // Destruye al tocar plataformas
    this.physics.add.collider(this.attackProjectiles, this.platforms, p => p.destroy());
    this.physics.add.collider(this.fireProjectiles,    this.platforms, p => p.destroy());

    // === 8) Tecla de disparo ===
    this.input.keyboard.on('keydown-SPACE', () => this.shoot(), this);

    // === 9) Cámara sigue al jugador (con offset a la izquierda) ===
    this.cameras.main.startFollow(
      this.player,
      true,  // roundPixels
      0.1,   // lerpX
      0.1,   // lerpY
      -60,   // offsetX
      0      // offsetY
    );

    // === 10) Controles de movimiento ===
    this.cursors = this.input.keyboard.createCursorKeys();

    // === 11) Animaciones Jugador ===
    if (!this.anims.exists('walk')) {
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 14,
        repeat: -1
      });
      this.anims.create({ key: 'idle', frames: [ { key: 'player', frame: 0 } ], frameRate: 10 });
      this.anims.create({ key: 'jump', frames: [ { key: 'player', frame: 0 } ], frameRate: 10 });
    }

    // === ENEMIGOS ===

    // === 12) Caracol (Sneil) - estático, sólo animación de 2 frames ===
    // this.snails = this.physics.add.group();
    // const snail = this.snails.create(200, 380, 'snail').setScale(1);
    // snail.body.setAllowGravity(false).immovable = true;
    // snail.play('snailWalk');

    // === 13) Cuervo (Cavas) - vuela senoidalmente ===
    // this.crows = this.physics.add.group();
    // for (let i = 0; i < 3; i++) {
    //   const crow = this.crows.create(600 + i * 120, 200 + (i % 2) * 30, 'crow').setScale(1);
    //   crow.body.setAllowGravity(false);
    //   crow.body.setVelocityX(50 + i * 20);
    //   crow.play('crowFly');
    //   this.tweens.add({
    //     targets: crow,
    //     y: crow.y - Phaser.Math.Between(20, 50),
    //     yoyo: true,
    //     repeat: -1,
    //     duration: 1000 + i * 200,
    //     ease: 'Sine.easeInOut'
    //   });
    // }

    // === 14) Cobra - serpiente inmóvil que lanza fireballs ===
    // this.cobras = this.physics.add.group();
    // const cobra = this.cobras.create(900, 380, 'cobra').setScale(1);
    // cobra.body.setAllowGravity(false).immovable = true;
    // this.cobraFireballs = this.physics.add.group();
    // this.physics.add.collider(this.cobraFireballs, this.player, () => this.playerDie());
    // this.time.addEvent({
    //   delay: Phaser.Math.Between(2000, 4000),
    //   loop: true,
    //   callback: () => {
    //     const fb = this.cobraFireballs.create(cobra.x, cobra.y, 'cobraFireball').setScale(1);
    //     fb.body.setAllowGravity(false);
    //     fb.body.setVelocityX(-50);
    //   }
    // });

    // === 15) Kello (rana) - green y brown según salud ===
    // this.kellos = this.physics.add.group();
    // const kGreen = this.kellos.create(300, 380, 'kelloGreen').setScale(1).setData('health', 2);
    // kGreen.body.setAllowGravity(false).immovable = true;
    // kGreen.play('kelloGreenIdle');
    // this.physics.add.overlap(this.attackProjectiles, this.kellos, (proj, k) => {
    //   proj.destroy();
    //   let hp = k.getData('health') - 1;
    //   k.setData('health', hp);
    //   if (hp === 1) {
    //     k.setTexture('kelloBrown');
    //     k.play('kelloBrownIdle');
    //     k.body.setAllowGravity(true).immovable = false;
    //   } else {
    //     k.play('kelloDie');
    //     k.once('animationcomplete', () => k.destroy());
    //   }
    // });

    // === COLISIONES Jugador ↔ Enemigos ===
    // this.physics.add.collider(this.player, this.snails,   () => console.log('hit snail'));
    // this.physics.add.collider(this.player, this.crows,    () => console.log('hit crow'));
    // this.physics.add.collider(this.player, this.cobras,   () => console.log('hit cobra'));
    // this.physics.add.collider(this.player, this.kellos,   () => console.log('hit kello'));

    // === 16) Canto rodado (boulder) ===
    // this.boulders = this.physics.add.group();
    // this.time.addEvent({
    //   delay: 5000, loop: true, callback: () => {
    //     const b = this.boulders.create(bg.width + 50, 360, 'boulder').setScale(1);
    //     b.body.setBounce(1, 1).setCollideWorldBounds(true);
    //     b.body.setVelocityX(-100);
    //   }
    // });
    // this.physics.add.collider(this.player, this.boulders, () => this.playerTakeDamage(1));
    // this.physics.add.overlap(this.fireProjectiles, this.boulders, (p, b) => { p.destroy(); b.destroy(); });

    // === 17) Fuego estático ===
    // this.fires = this.physics.add.staticGroup();
    // this.fires.create(500, 380, 'fire').setScale(1).refreshBody();
    // this.physics.add.overlap(this.player, this.fires, () => this.playerDie());

    // === 18) Resorte ===
    // this.springs = this.physics.add.staticGroup();
    // const spring = this.springs.create(650, 400, 'spring').setScale(1).refreshBody();
    // this.physics.add.collider(this.player, spring, p => {
    //   if (p.body.blocked.down) {
    //     p.setVelocityY(-500);
    //     spring.setFrame(1);
    //     this.time.delayedCall(500, () => spring.setFrame(0));
    //   }
    // });
  }

  // — Helpers para huevos y disparos —
  collectEgg(player, egg) {
    egg.destroy();
    this.currentWeapon = egg.texture.key === 'huevoAtaque' ? 'attack' : 'fire';
  }

  shoot() {
    if (!this.currentWeapon) return;
    const dir = this.player.flipX ? -1 : 1;
    const x   = this.player.x + dir * 20;
    const y   = this.player.y - 10;
    const vx  = 300 * dir;
    const vy  = 100;

    if (this.currentWeapon === 'attack') {
      const p = this.attackProjectiles.create(x, y, 'bolaAtaque')
        .setScale(1)
        .setVelocity(vx, vy)
        .setGravityY(0)
        .setBounce(0, 1)
        .setCollideWorldBounds(true);
    } else {
      const p = this.fireProjectiles.create(x, y, 'bolaFuego')
        .setScale(1)
        .setVelocity(vx, vy)
        .setGravityY(200)
        .setCollideWorldBounds(true);
    }
  }

  update() {
    // Movimiento jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-150).setFlipX(true);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(150).setFlipX(false);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    } else {
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down) this.player.play('idle', true);
    }
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-250);
      this.player.play('jump', true);
    }
  }

  // — Métodos stub para daños/muerte —
  playerTakeDamage(amount) {
    console.log(`Player recibe ${amount} de daño`);
  }
  playerDie() {
    console.log('Player ha muerto');
    // this.scene.restart();
  }
}
