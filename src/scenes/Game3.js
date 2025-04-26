import { Scene } from 'phaser';

export class Game3 extends Scene {
  constructor() {
    super('Game3');
  }

  init(data) {
    this.lives = data.lives != null ? data.lives : 3;
    this.score = data.score != null ? data.score : 0;
  }

  create() {
    // — 1) Fondo —
    const bg = this.add.image(0, 0, 'mapa2').setOrigin(0, 0);
    this.mapWidth = bg.width;          // ancho del mapa para el auto‐walk
    this.autoWalk = false;

    this.lifeIcon = this.add
    .image(35, 20, 'vida')
    .setOrigin(0, 0)
    .setScrollFactor(0);

    // — VIDAS —
    this.livesText = this.add.text(45, 10, `${this.lives}`, {
      fontFamily: 'pixelart', fontSize: '100px', color: '#ffffff'
    })
      .setScrollFactor(0)
      .setOrigin(0, 0)
      .setScale(0.2);

    // — 2) Plataformas fijas —
    this.platforms  = this.physics.add.staticGroup();
    this.platforms.create(3810, 205, 'plat21');
    this.platforms.create(7037, 143, 'plat22');
    this.platforms.create(6719, 110, 'plat23');
    this.platforms.create(7712, 184, 'plat24');
    this.platforms.create(7840, 168, 'plat24');
    this.platforms.create(8096, 200, 'plat25');
    this.platforms6 = this.physics.add.staticGroup();
    this.platforms6.create(7230, 230, 'pdeath');

    // — 3) Rocas estáticas —
    this.rocks = this.physics.add.staticGroup();
    [150].forEach(x => this.rocks.create(x, 402, 'roca'));

    // — 4) Rampa de bloques —
    this.ramp = this.physics.add.staticGroup();
    const blockSize = 12, steps = 22, rise = 3;
    for (let i = 0; i < steps; i++) {
      this.ramp.create(6390 + i * blockSize, 182 - i * rise, 'cuadrao')
        .setOrigin(0,1).refreshBody();
    }
    for (let i = 0; i < steps; i++) {
        this.ramp.create(6790 + i * blockSize, 120 + i * rise, 'cuadrao')
          .setOrigin(0,1).refreshBody();
      }
      for (let i = 0; i < steps; i++) {
        this.ramp.create(7030 + i * blockSize, 182 - i * rise, 'cuadrao')
          .setOrigin(0,1).refreshBody();
      }
      for (let i = 0; i < steps; i++) {
          this.ramp.create(7300 + i * blockSize, 120 + i * rise, 'cuadrao')
            .setOrigin(0,1).refreshBody();
        }
    

    // — 5) Jugador —
    this.player = this.physics.add.sprite(100, 100, 'player')
      .setBounce(0.1);
    this.playerSpeed   = 150;
    this.hasSpeedBoost = false;

    // colliders estáticos
    [ this.platforms, this.rocks, this.ramp ]
      .forEach(g => this.physics.add.collider(this.player, g));

    // — 6) Resortes —
    const spring = this.physics.add.staticImage(3695,163,'spring').refreshBody();
    this.physics.add.collider(this.player, spring, p => {
      if (p.body.blocked.down) {
        p.setVelocityY(-300);
        spring.setFrame(1);
        this.time.delayedCall(100, ()=> spring.setFrame(0));
      }
    });

    // — 8) Mundo & cámara —
    this.cameras.main.setBounds(0,0,bg.width,bg.height);
    this.physics.world.setBounds(0,0,bg.width,bg.height);

    // — 9) Proyectiles —
    this.attackProjectiles = this.physics.add.group();
    this.fireProjectiles   = this.physics.add.group();
    const destroyOnHit = p => p.destroy();
    [ this.platforms, this.ramp ]
      .forEach(g => {
        this.physics.add.collider(this.attackProjectiles, g, destroyOnHit);
        this.physics.add.collider(this.fireProjectiles,   g, destroyOnHit);
      });
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
        .setData('health', 2)
        .setData('powerKey', powerKey)
        .setFrame(0);
      egg.body.setAllowGravity(false);
      egg.setImmovable(true);
    };
    spawnEgg(200,163,'huevoFuego',  'powerFire');
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
    const createAraña = (x,y) => {
      const a = this.enemies.create(x,y,'araña').play('arañaIdle');
      a.body.setAllowGravity(false);
      a.setData('type','araña');
      this.tweens.add({
        targets: a, y: y - 40,
        yoyo: true, repeat: -1,
        duration: 1000, ease: 'Sine.easeInOut'
      });
    };
    [725,950,1170,1250,1690,1770,1815,1860].forEach(x=>createAraña.call(this,x,120));
    [2000].forEach(x=>createAraña.call(this,x,130));
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
    [3070,3443,3788].forEach(x=>createCrow.call(this,x,400));
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
    const cobraSpawns = [ {x:4828,y:397}, {x:6000,y:141}, {x:6150,y:141} ];
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
    // ** NUEVO: destruir fireballs con tus ataques **
    this.physics.add.overlap(this.attackProjectiles, this.cobraFireballs, (proj, fb) => {
      proj.destroy();
      fb.destroy();
    });
    this.physics.add.overlap(this.fireProjectiles, this.cobraFireballs, (proj, fb) => {
      proj.destroy();
      fb.destroy();
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
    this.rockSpawnThresholdX = 6400;
    this.physics.add.collider(this.fallingRocks, this.ramp);
    [
      { x: 6500, y: 127 },
      { x: 6600, y: 102 },
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

    // — 16) Plataforma de muerte — ahora overlap
    this.physics.add.overlap(this.player, this.platforms6, () => {
      this.handlePlayerDeath();
    });

    // —–––––––– PUNTUACIÓN –––––––––—
    this.score = 0;
    this.scoreText = this.add.text(
      this.cameras.main.width/2, 16,
      '0',
      { fontFamily: 'pixelart', fontSize: '150px', fill: '#ffffff' }
    )
    .setScrollFactor(0)
    .setOrigin(0.5, 0)
    .setScale(0.1);

    // —–––––––– RECOLECTABLES –––––––––—
    this.collectibles = this.physics.add.group();
    const collectiblesData = [
      { x:  325, y: 390, key: 'apple',  points:  50  },
      { x:  1601, y: 370, key: 'apple',  points:  50  },
      { x:  1733, y: 370, key: 'apple',  points:  50  },
      { x:  2085, y: 370, key: 'apple',  points:  50  },
      { x:  2649, y: 370, key: 'apple',  points:  50  },
      { x:  2771, y: 370, key: 'apple',  points:  50  },
      { x:  3648, y: 370, key: 'apple',  points:  50  },
      { x:  4060, y: 370, key: 'apple',  points:  50  },
      { x:  4248, y: 370, key: 'apple',  points:  50  },
      { x:  5199, y: 260, key: 'apple',  points:  50  },
      { x:  5793, y: 151, key: 'apple',  points:  50  },
      { x:  6216, y: 124, key: 'apple',  points:  50  },
      { x:  6233, y: 124, key: 'apple',  points:  50  },
      { x:  6795, y: 129, key: 'apple',  points:  50  },
      { x: 430, y: 350, key: 'banana', points:  50  },
      { x: 1056, y: 350, key: 'banana', points:  50  },
      { x: 1345, y: 350, key: 'banana', points:  50  },
      { x: 1852, y: 350, key: 'banana', points:  50  },
      { x: 2226, y: 350, key: 'banana', points:  50  },
      { x: 2579, y: 350, key: 'banana', points:  50  },
      { x: 2846, y: 350, key: 'banana', points:  50  },
      { x: 3834, y: 350, key: 'banana', points:  50  },
      { x: 3995, y: 350, key: 'banana', points:  50  },
      { x: 4495, y: 335, key: 'banana', points:  50  },
      { x: 4970, y: 303, key: 'banana', points:  50  },
      { x: 7067, y: 90, key: 'banana', points:  50  },
      { x: 2558, y: 350, key: 'peach',  points: 100  },
      { x: 4555, y: 350, key: 'peach',  points: 100  },
      { x: 4840, y: 360, key: 'peach',  points: 100  },
      { x: 5464, y: 200, key: 'peach',  points: 100  },
      { x: 6605, y: 90, key: 'peach',  points: 100  },
      { x: 7934, y: 70, key: 'peach',  points: 100  },
      { x: 2893, y: 350, key: 'carrot', points: 100  },
      { x: 3880, y: 350, key: 'carrot',  points: 100  },
      { x: 4712, y: 395, key: 'carrot',  points: 100  },
      { x: 6625, y: 142, key: 'carrot',  points: 100  },
      { x: 8077, y: 142, key: 'carrot',  points: 100  },
      { x: 7390, y: 35, key: 'jarron', points:1000 }   
    ];
    
    // metemos todos los recolectables
    collectiblesData.forEach(({x,y,key,points}) => {
      const itm = this.collectibles.create(x, y, key);
      itm.body.setAllowGravity(false);
      itm.setData('points', points);
    });

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.collectFruit,
      null,
      this
    );

  }

  update() {
    // — 1) ACTIVAR AUTO‐WALK —
    if (!this.autoWalk && this.player.x >= 8230) {
      this.autoWalk = true;
      this.playerSpeed = 100;  // velocidad de auto‐caminar
    }

    // — 2) SI ESTÁ AUTO‐WALK, ignorar input y mover solo a la derecha —
    if (this.autoWalk) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.setFlipX(false);
      this.player.play('walk', true);

      // cuando salga del mapa, vamos a Game3
      if (this.player.x > this.mapWidth + this.player.width) {
        this.scene.start('Game3', { lives: this.lives, score: this.score });
      }
      return;
    }

    // — 3) LÓGICA NORMAL DE CONTROLES —
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
      const vx = -75;
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

  shoot() {
    if (!this.currentWeapon) return;
    const dir = this.player.flipX ? -1 : 1;
    const sx  = this.player.x + dir * 20;
    const sy  = this.player.y - 10;
    const vx  = 300 * dir, vy = 100;
    const grp = this.currentWeapon === 'attack'
      ? this.attackProjectiles
      : this.fireProjectiles;
    const key = this.currentWeapon === 'attack'
      ? 'bolaAtaque'
      : 'bolaFuego';

    const proj = grp.create(sx, sy, key)
      .setVelocity(vx, vy)
      .setGravityY(0)
      .setBounce(this.currentWeapon==='attack'?1:0)
      .setCollideWorldBounds(true);

    // arrancar su animación
    if (key === 'bolaAtaque') {
      proj.play('axeSpin');
    } else {
      proj.play('fireFlicker');
    }
  }

  hitEgg(egg) {
    if (!egg.active) return;
    let hp = egg.getData('health') - 1;
    egg.setData('health', hp);

    if (hp === 1) {
      egg.setFrame(1);
      this.tweens.add({ targets: egg, y: egg.y - 30, duration: 150, yoyo: true });
    }
    else if (hp <= 0) {
      // desactivar física para que no siga colisionando
      egg.body.enable = false;

      const { x, y } = egg;
      const key = egg.getData('powerKey');

      // animación de ruptura
      this.tweens.add({
        targets: egg,
        y: egg.y - 40,
        angle: 50,
        duration: 200,
        onComplete: () => {
          egg.destroy();
          this.spawnPowerUp(x + 25, y - 5, key);
        }
      });
    }
  }

  collectFruit(player, fruit) {
    const pts = fruit.getData('points');
    this.addPoints(pts, fruit.x, fruit.y);
    fruit.destroy();
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
  
    // 2) coordenadas de pantalla
    const cam = this.cameras.main;
    const sx  = worldX - cam.scrollX;
    const sy  = worldY - cam.scrollY;
  
    // 3) popup: elegimos el sprite según los puntos
    const popupKey = `score${points}`;   // 'score50','score100','score1000',…
    const popup = this.add.image(sx, sy - 20, popupKey)
      .setScrollFactor(0)
      .setOrigin(0.5, 1)
      .setDepth(10);
  
    this.tweens.add({
      targets: popup,
      y: popup.y - 20,
      alpha: { from: 1, to: 0 },
      duration: 500,
      ease: 'Power1',
      onComplete: () => popup.destroy()
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
