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
    
    this.platforms2 = this.physics.add.staticGroup();
    this.platforms2.create(6225, 317, 'psal').setScale(1);

    this.platforms3 = this.physics.add.staticGroup();
    this.platforms3.create(6776, 317, 'paz').setScale(1);
    this.platforms3.create(7160, 317, 'paz').setScale(1);
    this.platforms3.create(8216, 317, 'paz').setScale(1);

    this.platforms4 = this.physics.add.staticGroup();
    this.platforms4.create(7560, 317, 'pam').setScale(1);

    this.platforms5 = this.physics.add.staticGroup();
    this.platforms5.create(6960, 135, 'proj').setScale(1);
    this.platforms5.create(7745, 168, 'proj').setScale(1);
    this.platforms5.create(7840, 200, 'proj').setScale(1);
    this.platforms5.create(8032, 120, 'proj').setScale(1);

    this.platforms6 = this.physics.add.staticGroup();
    this.platforms6.create(7230, 230, 'pdeath').setScale(1);
    

    // — 2b) Rocas (obstáculo para proyectiles y jugador) —
    this.rocks = this.physics.add.staticGroup();
    this.rocks.create(1376, 402, 'roca').setScale(1);
    this.rocks.create(1601, 402, 'roca').setScale(1);
    this.rocks.create(3695, 402, 'roca').setScale(1);
    this.rocks.create(3984, 402, 'roca').setScale(1);
    this.rocks.create(4383, 402, 'roca').setScale(1);
    this.rocks.create(4448, 402, 'roca').setScale(1);
    this.rocks.create(6832, 146, 'roca').setScale(1);
    this.rocks.create(7072, 146, 'roca').setScale(1);
    this.rocks.create(7104, 146, 'roca').setScale(1);

    // — 2c) Rampa hecha de bloques 12×12 —
    const blockSize  = 12;   // tamaño de tu sprite
    const rampSteps  = 85;   // cuántos peldaños
    const stepRise   = 3;    // cuántos px sube cada bloque
    const startX     = 4870;  // origen X de la rampa
    const startY     = 420;  // origen Y (encima de la plataforma)

    this.ramp = this.physics.add.staticGroup();
    for (let i = 0; i < rampSteps; i++) {
      const x = startX + i * blockSize;
      const y = startY - i * stepRise;
      this.ramp.create(x, y, 'pvio')
        .setOrigin(0, 1)      // el bloque asienta con su base
        .refreshBody();
    }

    // — 3) Jugador + colisiones contra plataformas y rocas —
    this.player = this.physics.add.sprite(100, 350, 'player')
      .setBounce(0.1)
      .setCollideWorldBounds(true)
      .setScale(1);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.collider(this.player, this.ramp);
    this.physics.add.collider(this.player, this.platforms2); 
    this.physics.add.collider(this.player, this.platforms3);
    this.physics.add.collider(this.player, this.platforms4);
    this.physics.add.collider(this.player, this.platforms5);
    this.physics.add.collider(this.player, this.platforms6);



    // — 2d) Resortes (salto potenciado) —
    this.springs = this.physics.add.staticGroup();
    const spring = this.springs.create(7370, 148, 'spring').setScale(1).refreshBody();

    this.physics.add.collider(this.player, spring, p => {
      if (p.body.blocked.down) {
        p.setVelocityY(-300);         // impulso hacia arriba
        spring.setFrame(1);           // cambiar a frame comprimido
        this.time.delayedCall(100, () => spring.setFrame(0)); // volver al frame original
      }
    });


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

    // — 11) Animaciones de enemigos —
    // Caracol
    this.anims.create({
      key: 'snailIdle',
      frames: this.anims.generateFrameNumbers('snail', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    // Cuervo
    this.anims.create({
      key: 'crowFly',
      frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1
    });
    // Cobra
    this.anims.create({
      key: 'cobraIdle',
      frames: this.anims.generateFrameNumbers('cobra', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    // Kello verde / marrón (cambian con damage)
    this.anims.create({
      key: 'kelloGreenIdle',
      frames: this.anims.generateFrameNumbers('kelloGreen', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'kelloBrownIdle',
      frames: this.anims.generateFrameNumbers('kelloBrown', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    // — 12) Crear grupo general de enemigos —
    this.enemies = this.physics.add.group();

    // Caracol
    const createSnail = (x, y) => {
      const snail = this.enemies.create(x, y, 'snail').setScale(1).play('snailIdle');
      snail.body.setAllowGravity(false);
      snail.setImmovable(true);
      snail.setData('type', 'snail');
    };

    createSnail.call(this, 770, 397);
    createSnail.call(this, 930, 397);
    createSnail.call(this, 980, 397);
    createSnail.call(this, 1705, 397);
    createSnail.call(this, 1800, 397);
    createSnail.call(this, 1850, 397);
    createSnail.call(this, 1900, 397);

    // Cuervo
    const createCrow = (x, y) => {
  const crow = this.enemies.create(x, y, 'crow').setScale(1).play('crowFly');
  crow.body.setAllowGravity(false);
  crow.setData('type', 'crow');

  // Movimiento horizontal y vertical en bucle (x ±25, y ±15)
  this.tweens.add({
    targets: crow,
    x: x - 80, // se mueve 25px a la izquierda desde su posición original
    y: y - 40, // y también sube un poco
    yoyo: true,
    repeat: -1,
    duration: 1000,
    ease: 'Sine.easeInOut',
  });
};

    createCrow.call(this, 2860, 400);
    createCrow.call(this, 3023, 400);
    createCrow.call(this, 3172, 400);

    // ---- Cobra (dispara bolas) ----
    this.cobras = this.physics.add.group();
    const cobra = this.enemies.create(4828, 400, 'cobra').setScale(1).play('cobraIdle');
    cobra.body.setAllowGravity(false);
    cobra.setImmovable(true);
    cobra.setData('type', 'cobra');
    this.cobraFireballs = this.physics.add.group();

    // fireball ↔ jugador
    this.physics.add.overlap(this.cobraFireballs, this.player, () => this.playerDie());

    // disparo periódico
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        const fb = this.cobraFireballs.create(cobra.x - 20, cobra.y, 'cobraFireball');
        fb.body.setAllowGravity(false);
        fb.setVelocityX(-100);
    
        // Destruir la fireball a los 1500 ms
        this.time.delayedCall(1500, () => {
          if (fb.active) fb.destroy();
        });
      }
    });

    this.physics.add.overlap(this.attackProjectiles, this.cobraFireballs, (p, f) => {
      p.destroy();
      f.destroy();
    });
    this.physics.add.overlap(this.fireProjectiles, this.cobraFireballs, (p, f) => {
      p.destroy();
      f.destroy();
    });

    // ---- Kello (verde → marrón → muere) ----
    this.kellos = this.physics.add.group();
    const kello = this.enemies.create(1100, 380, 'kelloGreen')
      .setScale(1)
      .play('kelloGreenIdle')
      .setData('health', 2)
      .setData('type', 'kello');
    kello.body.setAllowGravity(false);
    kello.setImmovable(true);

    // — 13) Colisiones y overlaps enemigo↔jugador, proyectil↔enemigo —
    this.physics.add.collider(this.player, this.enemies, () => playerDie());

    const killHandler = (proj, enemy) => {
      proj.destroy();
    
      // Si es Kello, revisar vida antes de mostrar animación
      if (enemy.getData('type') === 'kello') {
        let hp = enemy.getData('health') - 1;
        enemy.setData('health', hp);
        if (hp === 1) {
          enemy.setTexture('kelloBrown');
          enemy.play('kelloBrownIdle');
          enemy.body.setAllowGravity(false);  // que NO caiga
          enemy.setImmovable(true);
          return;  // Salimos antes de hacer la animación de muerte
        }
      }
    
      // animación de muerte (mini salto) con PNG
      const deathKey = enemy.getData('type') + 'Death';
      const fx = this.add.sprite(enemy.x, enemy.y, deathKey).setScale(1);
      this.tweens.add({
        targets: fx,
        y: fx.y - 20,
        duration: 200,
        yoyo: true,
        onComplete: () => fx.destroy()
      });
    
      enemy.destroy();
    };

    this.physics.add.overlap(this.attackProjectiles, this.enemies, killHandler);
    this.physics.add.overlap(this.fireProjectiles,   this.enemies, killHandler);

    // si el personaje toca con la plataforma6 se reinicia la escena
    this.physics.add.overlap(this.player, this.platforms6, () => {
      this.scene.restart();
    });

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
      this.physics.add.collider(b, this.platforms2, proj => proj.destroy());
      this.physics.add.collider(b, this.platforms3, proj => proj.destroy());
      this.physics.add.collider(b, this.platforms4, proj => proj.destroy());
      this.physics.add.collider(b, this.ramp, proj => proj.destroy());

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
      this.physics.add.collider(b, this.platforms2, proj => proj.destroy());
      this.physics.add.collider(b, this.platforms3, proj => proj.destroy());
      this.physics.add.collider(b, this.platforms4, proj => proj.destroy());
      this.physics.add.collider(b, this.ramp, proj => proj.destroy());

    }
  }
  //cuando playerdie este activa quiero q te mande a gameover
  playerDie() {
    this.scene.start('GameOver'); 
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
