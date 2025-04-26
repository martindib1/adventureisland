// Preloader.js
import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() { super('Preloader'); }
  preload() {
    this.load.setPath('assets');
    this.load.image('mapita','public/assets/mapa.png');
    this.load.image('main','public/assets/princ.png');
    this.load.image('plataforma','public/assets/prosa.png');
    this.load.image('pvio','public/assets/pvio.png');
    this.load.image('psal','public/assets/despramp.png');
    this.load.image('paz','public/assets/124.png');
    this.load.image('pam','public/assets/3.png');
    this.load.image('proj','public/assets/proj.png');
    this.load.image('pdeath','public/assets/fondo.png');
    this.load.image('roca','public/assets/roca.png');
    this.load.image('fallRock','public/assets/bola.png');
    this.load.image('fire','public/assets/fire.png');
    this.load.spritesheet('spring','public/assets/trampolin.png',{frameWidth:24,frameHeight:14});
    this.load.image('powerAttack', 'public/assets/hacha.png');
    this.load.image('powerFire',   'public/assets/fuego4.png');
    this.load.image('bolaAtaque','public/assets/hacha.png');
    this.load.image('bolaFuego','public/assets/fuego4.png');
    this.load.spritesheet('snail','public/assets/caracolanim.png',{frameWidth:24,frameHeight:24});
    this.load.spritesheet('crow','public/assets/crow.png',{frameWidth:16,frameHeight:15});
    this.load.image('cobraFireball','public/assets/cobrafireball.png');
    this.load.spritesheet('cobra','public/assets/cobrad.png',{frameWidth:16,frameHeight:23});
    this.load.spritesheet('kelloGreen','public/assets/kellogreen.png',{frameWidth:16,frameHeight:16});
    this.load.spritesheet('kelloBrown','public/assets/kellobrown.png',{frameWidth:16,frameHeight:16});
    this.load.image('kelloDeath','public/assets/deathkello.png');
    this.load.image('snailDeath','public/assets/deathcaracol.png');
    this.load.image('crowDeath','public/assets/deathcrow.png');
    this.load.image('cobraDeath','public/assets/deathcobra.png');
    this.load.spritesheet('huevoAtaque', 'public/assets/huevoroto.png', { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('huevoFuego',   'public/assets/huevoroto.png',   { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('huevoPatineta',   'public/assets/huevoroto.png',   { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('playerSkate','public/assets/patineta.png',{frameWidth:24,frameHeight:32});
    this.load.image('powerpatineta','public/assets/patin.png');
    this.load.spritesheet('player','public/assets/walki.png',{frameWidth:18,frameHeight:32});
    this.load.spritesheet('idlep','public/assets/idle.png',{frameWidth:16,frameHeight:32});
    this.load.spritesheet('jumpp','public/assets/jumpp.png',{frameWidth:20,frameHeight:32});
    this.load.spritesheet('playerDeath', 'public/assets/playerdeath.png', { frameWidth: 24, frameHeight: 24 });
    this.load.image('apple', 'public/assets/apple.png');
    this.load.image('banana', 'public/assets/banana.png');
    this.load.image('peach', 'public/assets/peach.png');
    this.load.image('carrot', 'public/assets/carrot.png');
    this.load.image('score50', 'public/assets/50pts.png');
    this.load.image('score100','public/assets/100pts.png');
    this.load.image('vida','public/assets/vidachico.png');
    this.load.image('jarron',  'public/assets/jarron.png');
    this.load.image('score1000', 'public/assets/1000pts.png');
    this.load.spritesheet('axea', 'public/assets/axespin.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('firea', 'public/assets/fireflicker.png', { frameWidth: 16, frameHeight: 16 });

    //solo para juego2

    this.load.image('mapa2','public/assets/mapasinnada.png');
    this.load.image('plat21','public/assets/plat2.png');
    this.load.image('cuadrao','public/assets/cuadrado.png');
    this.load.image('plat22','public/assets/plat22.png');
    this.load.image('plat23','public/assets/plat23.png');
    this.load.image('plat24','public/assets/platlvl2.png');
    this.load.image('plat25','public/assets/platboss.png');
    this.load.spritesheet('araña', 'public/assets/araña.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('arañaDeath','public/assets/deatharaña.png');
  }
  create() {

     // Animaciones del jugador
     this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player',{ start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idlep',{ start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jumpp',{ start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    // Animaciones enemigos
    this.anims.create({
      key: 'snailIdle',
      frames: this.anims.generateFrameNumbers('snail', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'crowFly',
      frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 1 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'cobraIdle',
      frames: this.anims.generateFrameNumbers('cobra', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
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
    this.anims.create({
      key: 'skate',
      frames: this.anims.generateFrameNumbers('playerSkate',{ start:0, end:1 }),
      frameRate: 12, repeat: -1
    });
    this.anims.create({
      key: 'playerDeathAnim',
      frames: this.anims.generateFrameNumbers('playerDeath',{ start:0, end:3 }),
      frameRate: 6, repeat: -1
    });
    this.anims.create({
      key: 'axeSpin',
      frames: this.anims.generateFrameNumbers('axea',{ start:0, end:3 }),
      frameRate: 10, repeat: -1
    });
    this.anims.create({
      key: 'fireFlicker',
      frames: this.anims.generateFrameNumbers('firea',{ start:0, end:3 }),
      frameRate: 12, repeat: -1
    });
    this.anims.create({
      key: 'arañaIdle',
      frames: this.anims.generateFrameNumbers('araña',{ start:0, end:1 }),
      frameRate: 10, repeat: -1
    });

     this.scene.start('MainMenu'); 
    }
}