import { Scene } from 'phaser';

export class Game2 extends Scene {
  constructor() {
    super('Game2');
  }

  init(data) {
    // Inicializamos vidas, si vienen por restart
    this.lives = data.lives != null ? data.lives : 3;
  }

  create() {
    // — 1) Fondo —
    const bg = this.add.image(0, 0, 'mapita').setOrigin(0, 0);

    this.lifeIcon = this.add
    .image(35, 20, 'vida')      // posición en pantalla (pixels), ajusta a tu gusto
    .setOrigin(0, 0)             // esquina superior izquierda
    .setScrollFactor(0)          // queda fijo en pantalla


    // — VIDAS —
    this.livesText = this.add.text(
      45, 17,
      `${this.lives}`,
      {
        fontSize: '12px',
        color: '#ff0000'
      }
    )
      .setScrollFactor(0)
      .setOrigin(0, 0);
    

    // — 2) Plataformas fijas —
    this.platforms  = this.physics.add.staticGroup();
    this.platforms.create(2430, 414, 'plataforma');
    this.platforms2 = this.physics.add.staticGroup();
    this.platforms2.create(6225, 317, 'psal');
    this.platforms3 = this.physics.add.staticGroup();
    [6776, 7160, 8216].forEach(x => this.platforms3.create(x, 317, 'paz'));
    this.platforms4 = this.physics.add.staticGroup();
    this.platforms4.create(7560, 317, 'pam');
    this.platforms5 = this.physics.add.staticGroup();
    [[6960,135],[7745,168],[7840,200],[8032,120]]
      .forEach(([x,y]) => this.platforms5.create(x, y, 'proj'));
    // Plataforma de muerte
    this.platforms6 = this.physics.add.staticGroup();
    this.platforms6.create(7230, 230, 'pdeath');

    // — 3) Rocas estáticas —
    this.rocks = this.physics.add.staticGroup();
    [1376,1601,3695,3984,4383,4448].forEach(x => this.rocks.create(x, 402, 'roca'));
    [6832,7072,7104].forEach(x => this.rocks.create(x, 146, 'roca'));

    // — 4) Rampa de bloques 12×12 —
    this.ramp = this.physics.add.staticGroup();
    const blockSize = 12, steps = 85, rise = 3;
    for (let i = 0; i < steps; i++) {
      this.ramp.create(4870 + i*blockSize, 420 - i*rise, 'pvio')
        .setOrigin(0,1).refreshBody();
    }

    // — 5) Jugador —
    this.player = this.physics.add.sprite(100, 350, 'player')
      .setBounce(0.1)
      .setCollideWorldBounds(true);
    this.playerSpeed   = 150;
    this.hasSpeedBoost = false;

    // collider jugador ↔ estáticos
    [
      this.platforms, this.platforms2, this.platforms3,
      this.platforms4, this.platforms5, this.platforms6,
      this.rocks, this.ramp
    ].forEach(g => this.physics.add.collider(this.player, g));

    // — 6) Resortes —
    const spring = this.physics.add.staticImage(7370,148,'spring').refreshBody();
    this.physics.add.collider(this.player, spring, p => {
      if (p.body.blocked.down) {
        p.setVelocityY(-300);
        spring.setFrame(1);
        this.time.delayedCall(100, ()=> spring.setFrame(0));
      }
    });

    // — 7) Plataforma móvil —
    const startX = 7935, startY = 170;
    this.platformCollider = this.physics.add
      .staticImage(startX, startY, 'proj')
      .setOrigin(0.5,1).refreshBody();
    this.platformDisplay = this.add.image(startX, startY, 'proj').setOrigin(0.5,1);
    this.physics.add.collider(this.player, this.platformCollider);
    this.tweens.add({
      targets: { y: startY },
      props: { y: { getEnd: ()=> startY - 50 } },
      duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      onUpdate: (tween, obj) => {
        this.platformDisplay.y  = obj.y;
        this.platformCollider.y = obj.y;
        this.platformCollider.refreshBody();
      }
    });

    // — 8) Mundo & cámara —
    this.cameras.main.setBounds(0,0,bg.width,bg.height);
    this.physics.world.setBounds(0,0,bg.width,bg.height);

    // — 9) Proyectiles —
    this.attackProjectiles = this.physics.add.group();
    this.fireProjectiles   = this.physics.add.group();
    const destroyOnHit = p => p.destroy();
    [this.platforms, this.platforms2, this.platforms3, this.platforms4, this.platforms5, this.ramp]
      .forEach(g => {
        this.physics.add.collider(this.attackProjectiles, g, destroyOnHit);
        this.physics.add.collider(this.fireProjectiles,   g, destroyOnHit);
      });
    // fuego destruye roca estática + 50 pts
    this.physics.add.overlap(this.fireProjectiles, this.rocks, (proj, rock) => {
      proj.destroy();
      const { x, y } = rock;
      rock.destroy();
      this.addPoints(50, x, y);
    });

    // — 10) Huevos (power-ups) —
    this.eggs = this.physics.add.group();
    const spawnEgg = (x,y,key,powerKey) => {
      const egg = this.eggs.create(x,y,key)
        .setOrigin(0.5,1)
        .setData('health',2)
        .setData('powerKey',powerKey)
        .setFrame(0);
      egg.body.setAllowGravity(false);
      egg.setImmovable(true);
    };
    spawnEgg(400,410,'huevoAtaque','powerAttack');
    spawnEgg(800,410,'huevoFuego',  'powerFire');
    spawnEgg(1200,410,'huevoPatineta','powerpatineta');
    this.physics.add.collider(this.player, this.eggs, (_p,e)=>this.hitEgg(e));
    this.physics.add.overlap(this.attackProjectiles, this.eggs, (p,e)=>{ p.destroy(); this.hitEgg(e); });
    this.physics.add.overlap(this.fireProjectiles,   this.eggs, (p,e)=>{ p.destroy(); this.hitEgg(e); });

    // — 11) Disparo —
    this.input.keyboard.on('keydown-SPACE', ()=>this.shoot(), this);

    // — 12) Cámara & cursores —
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1, -60, 0);

    // — 13) Enemigos generales —
    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.player, this.enemies, this.onPlayerHitEnemy, null, this);
    // Caracoles
    const createSnail = (x,y) => {
      const s = this.enemies.create(x,y,'snail').play('snailIdle');
      s.body.setAllowGravity(false);
      s.setImmovable(true);
      s.setData('type','snail');
    };
    [770,930,980,1705,1800,1850,1900].forEach(x=>createSnail.call(this,x,397));
    [6720,7185,7230].forEach(x=>createSnail.call(this,x,141));
    // Cuervos
    const createCrow = (x,y) => {
      const c = this.enemies.create(x,y,'crow').play('crowFly');
      c.body.setAllowGravity(false);
      c.setData('type','crow');
      this.tweens.add({
        targets: c, x: x - 80, y: y - 40,
        yoyo: true, repeat: -1,
        duration: 1000, ease: 'Sine.easeInOut'
      });
    };
    [2860,3023,3172].forEach(x=>createCrow.call(this,x,400));
    // Kello
    const kello = this.enemies.create(7555,146,'kelloGreen')
      .play('kelloGreenIdle')
      .setData('type','kello')
      .setData('health',2);
    kello.body.setAllowGravity(false);
    kello.setImmovable(true);

    // matar enemigos +100 pts
    this.physics.add.overlap(this.attackProjectiles, this.enemies, this.killHandler, null, this);
    this.physics.add.overlap(this.fireProjectiles,   this.enemies, this.killHandler, null, this);

    // — Cobras & fireballs —
    const cobraSpawns = [ {x:4828,y:400}, {x:6000,y:141}, {x:6150,y:141} ];
    this.cobras          = this.physics.add.group();
    this.cobraFireballs = this.physics.add.group();
    cobraSpawns.forEach(({x,y})=> {
      const cb = this.cobras.create(x,y,'cobra').play('cobraIdle');
      cb.body.setAllowGravity(false);
      cb.setData('type','cobra');
      this.time.addEvent({
        delay: 3000, loop: true,
        callback: () => {
          if (!cb.active) return;
          const fb = this.cobraFireballs.create(cb.x-20, cb.y, 'cobraFireball');
          fb.body.setAllowGravity(false);
          fb.setVelocityX(-100);
          this.time.delayedCall(1500, ()=> fb.active && fb.destroy());
        }
      });
    });
    this.physics.add.overlap(this.cobraFireballs, this.player, this.onHitByFireball, null, this);
    this.physics.add.overlap(this.attackProjectiles, this.cobras, this.killHandler, null, this);
    this.physics.add.overlap(this.fireProjectiles,   this.cobras, this.killHandler, null, this);
    this.physics.add.collider(this.player, this.cobras, this.onPlayerHitEnemy, null, this);

    // — 14) Obstáculo fuego —
    this.fires = this.physics.add.staticGroup();
    this.fires.create(4560,397,'fire');
    this.fires.create(6465,141,'fire');
    this.physics.add.overlap(this.player, this.fires, this.onFireTouch, null, this);

    // — 15) Rocas “activables” en la rampa —
    this.fallingRocks        = this.physics.add.group();
    this.rockSpawned         = false;
    this.rockSpawnThresholdX = 4850;
    this.physics.add.collider(this.fallingRocks, this.ramp);
    [
      { x: 5100, y: 335 },
      { x: 5400, y: 260 },
      { x: 5700, y: 185 },
    ].forEach(({x,y}) => {
      const rock = this.fallingRocks.create(x,y,'fallRock');
      rock.body.setAllowGravity(false);
      rock.setBounce(0.2).setCollideWorldBounds(true).setData('activated', false);
    });
    // fuego destruye rocas +50 pts
    this.physics.add.overlap(this.fireProjectiles, this.fallingRocks, (proj, rock) => {
      proj.destroy();
      const { x, y } = rock;
      rock.destroy();
      this.addPoints(50, x, y);
    });
    // jugador con patineta destruye rocas +50 pts
    this.physics.add.collider(this.player, this.fallingRocks, (player, rock) => {
      const { x, y } = rock;
      rock.destroy();
      if (this.hasSpeedBoost) {
        this.hasSpeedBoost = false;
        this.playerSpeed   = 150;
        this.player.setTexture('player');
        this.player.play('idle', true);
        this.addPoints(50, x, y);
      } else {
        this.handlePlayerDeath();
      }
    });

    // — 16) Plataforma de muerte —
    this.physics.add.collider(this.player, this.platforms6, ()=> {
      this.handlePlayerDeath();
    });

    // —–––––––– PUNTUACIÓN –––––––––—
    this.score = 0;
    this.scoreText = this.add.text(
      this.cameras.main.width/2, 16,
      '0',
      { fontSize: '12px', fill: '#ffffff' }
    )
    .setScrollFactor(0)
    .setOrigin(0.5, 0);

    // —–––––––– RECOLECTABLES –––––––––—
    this.collectibles = this.physics.add.group();
    const fruits = [
      { x: 200,  y: 350, key: 'apple',  points:  50 },
      { x: 3200, y: 350, key: 'banana', points:  50 },
      { x: 3400, y: 350, key: 'peach',  points: 100 },
      { x: 3600, y: 350, key: 'carrot', points: 100 }
    ];
    fruits.forEach(({x,y,key,points}) => {
      const f = this.collectibles.create(x,y,key);
      f.body.setAllowGravity(false);
      f.setData('points', points);
    });
    this.physics.add.overlap(this.player, this.collectibles, this.collectFruit, null, this);

  }

  update() {
    // — movimiento & animaciones —
    if (this.player.active) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-this.playerSpeed).setFlipX(true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(this.playerSpeed).setFlipX(false);
      } else {
        this.player.setVelocityX(0);
      }
      if (this.hasSpeedBoost) {
        this.player.play('skate', true);
      } else if (this.player.body.blocked.down) {
        this.player.body.velocity.x === 0
          ? this.player.play('idle', true)
          : this.player.play('walk', true);
      } else {
        this.player.play('jump', true);
      }
      if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-250);
      }
    }

    // — activar rocas en la rampa —
    if (!this.rockSpawned && this.player.x > this.rockSpawnThresholdX) {
      const vx = -50;
      const vy = vx * (-0.25); // ≈ +12.5
      this.fallingRocks.getChildren().forEach(rock => {
        if (!rock.getData('activated')) {
          rock.setData('activated', true);
          rock.body.setAllowGravity(false);
          rock.setVelocity(vx, vy);
        }
      });
      this.rockSpawned = true;
    }
  }

  // — Métodos auxiliares —

  shoot() {
    if (!this.currentWeapon) return;
    const dir = this.player.flipX ? -1 : 1;
    const sx  = this.player.x + dir*20;
    const sy  = this.player.y - 10;
    const vx  = 300*dir, vy = 100;
    const grp = this.currentWeapon === 'attack'
      ? this.attackProjectiles
      : this.fireProjectiles;
    const key = this.currentWeapon === 'attack'
      ? 'bolaAtaque'
      : 'bolaFuego';

    grp.create(sx,sy,key)
      .setVelocity(vx,vy)
      .setGravityY(0)
      .setBounce(this.currentWeapon==='attack'?1:0)
      .setCollideWorldBounds(true);
  }

  onHitByFireball(player, fireball) {
    fireball.destroy();
    if (this.hasSpeedBoost) {
      this.hasSpeedBoost = false;
      this.playerSpeed   = 150;
      this.player.setTexture('player');
      this.player.play('idle', true);
    } else {
      this.handlePlayerDeath();
    }
  }

  onFireTouch(player, fire) {
    if (this.hasSpeedBoost) {
      fire.destroy();
      this.hasSpeedBoost = false;
      this.playerSpeed   = 150;
      this.player.setTexture('player');
      this.player.play('idle', true);
    } else {
      this.handlePlayerDeath();
    }
  }

  hitEgg(egg) {
    if (!egg.active) return;
    let hp = egg.getData('health') - 1;
    egg.setData('health', hp);
  
    if (hp === 1) {
      egg.setFrame(1);
      this.tweens.add({ targets: egg, y: egg.y - 30, duration: 150, yoyo: true });    }
    else if (hp <= 0) {
      const { x, y, data } = egg;
      const key = data.get('powerKey');
  
      // animación de rotura (o shake, o frame final…)
      this.tweens.add({
        targets: egg,
        y: egg.y - 40,
        angle:  50,      // por ejemplo rotamos
        duration: 200,
        onComplete: () => {
          egg.destroy();
          this.spawnPowerUp(x+25, y-5, key);
        }
      });
    }
  }

  spawnPowerUp(x, y, key) {
    const item = this.physics.add.sprite(x, y, key)
      .setBounce(0.2)
      .setCollideWorldBounds(true);
    item.body.setAllowGravity(false);
  
    if (key === 'powerpatineta') {
      this.physics.add.overlap(this.player, item, () => {
        this.hasSpeedBoost = true;
        this.playerSpeed   = 250;
        this.player.setTexture('playerSkate');
        this.player.play('skate', true);
        item.destroy();
      }, null, this);
    } else {
      this.physics.add.overlap(this.player, item, () => {
        this.currentWeapon = key === 'powerAttack' ? 'attack' : 'fire';
        item.destroy();
      }, null, this);
    }
  }

  killHandler(proj, enemy) {
    proj.destroy();
    if (!enemy || !enemy.active) return;
    if (enemy.getData('type') === 'kello') {
      let hp = enemy.getData('health') - 1;
      enemy.setData('health', hp);
      if (hp === 1) {
        enemy.setTexture('kelloBrown');
        enemy.play('kelloBrownIdle');
        return;
      }
    }
    const deathKey = enemy.getData('type') + 'Death';
    const fx = this.add.sprite(enemy.x, enemy.y, deathKey).setScale(1);
    this.tweens.add({
      targets: fx,
      y: fx.y - 20,
      duration: 200,
      yoyo: true,
      onComplete: ()=> fx.destroy()
    });

    // +100 pts por enemigo
    this.addPoints(100, enemy.x, enemy.y);
    enemy.destroy();
  }

  collectFruit(player, fruit) {
    const pts = fruit.getData('points');
    this.addPoints(pts, fruit.x, fruit.y);
    fruit.destroy();
  }

  addPoints(points, worldX, worldY) {
    // 1) sumar
    this.score += points;
    this.scoreText.setText(this.score);

    // 2) pantalla
    const cam = this.cameras.main;
    const sx = worldX - cam.scrollX;
    const sy = worldY - cam.scrollY;

    // 3) popup
    const key   = points === 100 ? 'score100' : 'score50';
    const popup = this.add.image(sx, sy - 20, key)
      .setScrollFactor(0)
      .setOrigin(0.5,1)
      .setDepth(10);

    this.tweens.add({
      targets: popup,
      y: popup.y - 20,
      alpha: { from: 1, to: 0 },
      duration: 500,
      ease: 'Power1',
      onComplete: ()=> popup.destroy()
    });
  }

  handlePlayerDeath() {
    // mini animación de muerte
    const death = this.add.sprite(this.player.x, this.player.y, 'playerDeath');
    death.play('playerDeathAnim');
    this.player.disableBody(true, true);
  
    // resetear arma
    this.currentWeapon = null;
  
    // restar vida y actualizar UI
    this.lives--;
    this.livesText.setText(`${this.lives}`);
  
    // reiniciar o GameOver
    this.time.delayedCall(1000, () => {
      if (this.lives > 0) {
        this.scene.restart({ lives: this.lives });
      } else {
        this.scene.start('GameOver');
      }
    });
  }

  onPlayerHitEnemy(player, enemy) {
    if (this.hasSpeedBoost) {
      enemy && enemy.destroy();
      this.hasSpeedBoost = false;
      this.playerSpeed   = 150;
      this.player.setTexture('player');
      this.player.play('idle', true);
    } else {
      this.handlePlayerDeath();
    }
  }
}
