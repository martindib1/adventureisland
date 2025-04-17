import { Scene } from 'phaser';

export class Game2 extends Scene {
  constructor() {
    super('Game2');
  }

  create() {
    // — 1) Fondo —
    const bg = this.add.image(0, 0, 'mapita').setOrigin(0, 0);

    // — 2) Plataforma para el jugador (no afecta a proyectiles, salvo colisión que destruye) —
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(2430, 414, 'plataforma').setScale(1);

    // — 2b) Rocas (obstáculo para proyectiles y jugador) —
    this.rocks = this.physics.add.staticGroup();
    this.rocks.create(600, 400, 'roca').setScale(1);
    this.rocks.create(1200, 400, 'roca').setScale(1);

    // — 3) Jugador + colisiones contra plataformas y rocas —
    this.player = this.physics.add.sprite(100, 350, 'player')
      .setBounce(0.1)
      .setCollideWorldBounds(true)
      .setScale(1);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.rocks);

    // — 4) Mundo & cámara —
    this.cameras.main.setBounds(0, 0, bg.width, bg.height);
    this.physics.world.setBounds(0, 0, bg.width, bg.height);

    // — 5) Huevos recolectables —
    this.eggs = this.physics.add.staticGroup();
    this.eggs.create(400, 350, 'huevoAtaque').setScale(1);
    this.eggs.create(800, 350, 'huevoFuego').setScale(1);
    this.physics.add.overlap(this.player, this.eggs, this.collectEgg, null, this);

    // — 6) Grupos de proyectiles —
    this.attackProjectiles = this.physics.add.group();
    this.fireProjectiles   = this.physics.add.group();
    this.physics.add.collider(this.attackProjectiles, this.rocks);

    // — 7) Tecla de disparo —
    this.input.keyboard.on('keydown-SPACE', () => this.shoot(), this);

    // — 8) Cámara sigue al jugador —
    this.cameras.main.startFollow(
      this.player,
      true,  // round pixels
      0.1,   // lerp x
      0.1,   // lerp y
      -60,   // offsetX (izquierda)
      0      // offsetY
    );

    // — 9) Controles de movimiento —
    this.cursors = this.input.keyboard.createCursorKeys();

     // — Enemigos —
     this.enemies = this.physics.add.group();
 
     // Flyer: avanza horizontal y oscila vertical
    const flyer = this.enemies.create(1000, 300, 'enemyFlyer').setScale(1);

    flyer.body.setAllowGravity(false);
    flyer.body.setVelocityX(50);
     this.tweens.add({
       targets: flyer,
       y: flyer.y - 30,
       yoyo: true,
       repeat: -1,
       duration: 800
     });

     // — Nuevo enemigo “muy lento” —
     // Se mueve 2 px/s a la derecha (puedes invertirlo o chocar con un muro para hacerlo ping‑pong)
        const slow = this.enemies.create(300, 350, 'enemyWalker').setScale(1);
        slow.body.setAllowGravity(false);
        slow.body.setVelocityX(-1);
 
     // • Colisión jugador ↔ enemigos
     this.physics.add.collider(this.player, this.enemies, () => {
       console.log('Player hit!');
     });
     // • Hachas matan enemigos
     this.physics.add.overlap(this.attackProjectiles, this.enemies, (p, e) => {
       p.destroy();
       e.destroy();
     });
     this.physics.add.overlap(this.fireProjectiles, this.enemies, (p, e) => {
       p.destroy();
       e.destroy();
     });

    // — 10) Animaciones —
    if (!this.anims.exists('walk')) {
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player',{ start: 0, end: 3 }),
        frameRate: 14,
        repeat: -1
      });
      this.anims.create({ key: 'idle', frames:[{ key:'player',frame:0 }], frameRate:10 });
      this.anims.create({ key: 'jump', frames:[{ key:'player',frame:0 }], frameRate:10 });
    }
  }

  collectEgg(player, egg) {
    egg.destroy();
    this.currentWeapon = egg.texture.key === 'huevoAtaque' ? 'attack' : 'fire';
  }

  shoot() {
    if (!this.currentWeapon) return;

    const dir = this.player.flipX ? -1 : 1;
    const spawnX = this.player.x + dir * 20;
    const spawnY = this.player.y - 10;
    const velX = 300 * dir;
    const velY = 100;

    if (this.currentWeapon === 'attack') {
      // Primer ataque: rebota en roca y luego cae
      const b = this.attackProjectiles.create(spawnX, spawnY, 'bolaAtaque')
        .setScale(1)
        .setVelocity(velX, velY)
        .setGravityY(0)
        .setBounce(0, 1)          // solo rebote vertical
        .setCollideWorldBounds(true);

      // Rebote con rocas
      this.physics.add.collider(b, this.rocks, (proj, rock) => {
        proj.setVelocity(0, 0);
        proj.body.setGravityY(200);
      });

      // **Desaparece al tocar plataformas**
      this.physics.add.collider(b, this.platforms, proj => proj.destroy());

    } else {
      // Segundo ataque: destruye rocas y (luego) enemigos
      const b = this.fireProjectiles.create(spawnX, spawnY, 'bolaFuego')
        .setScale(1)
        .setVelocity(velX, velY)
        .setGravityY(0)
        .setCollideWorldBounds(true);

      // Destruye rocas
      this.physics.add.overlap(b, this.rocks, (proj, rock) => {
        proj.destroy();
        rock.destroy();
      });

      // **Desaparece al tocar plataformas**
      this.physics.add.collider(b, this.platforms, proj => proj.destroy());

      // (Luego superponés lo mismo con this.enemies)
    }
  }


  update() {
    // Movimiento horizontal
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-150).setFlipX(true);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(150).setFlipX(false);
      if (this.player.body.blocked.down) this.player.play('walk', true);
    }
    else {
      this.player.setVelocityX(0);
      if (this.player.body.blocked.down) this.player.play('idle', true);
    }

    // Salto
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-250);
      this.player.play('jump', true);
    }
  }
}
