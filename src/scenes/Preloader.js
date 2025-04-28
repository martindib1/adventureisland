// Preloader.js
import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() { super('Preloader'); }
  preload() {
    this.load.setPath('assets');
    this.load.image('mapita','mapa.png');
    this.load.image('main','princ.png');
    this.load.image('plataforma','prosa.png');
    this.load.image('pvio','pvio.png');
    this.load.image('psal','despramp.png');
    this.load.image('paz','124.png');
    this.load.image('pam','3.png');
    this.load.image('proj','proj.png');
    this.load.image('pdeath','fondo.png');
    this.load.image('roca','roca.png');
    this.load.image('fallRock','bola.png');
    this.load.image('fire','fire.png');
    this.load.image('principio','principio.png');
    this.load.spritesheet('spring','trampolin.png',{frameWidth:24,frameHeight:14});
    this.load.image('powerAttack', 'pistola.png');
    this.load.image('powerFire',   'jsbombasola.png');
    this.load.image('bolaAtaque','pistola.png');
    this.load.image('bolaFuego','jsbombasola.png');
    this.load.spritesheet('snail','caracolanim.png',{frameWidth:24,frameHeight:24});
    this.load.spritesheet('crow','crow.png',{frameWidth:16,frameHeight:15});
    this.load.image('cobraFireball','cobrafireball.png');
    this.load.spritesheet('cobra','cobrad.png',{frameWidth:16,frameHeight:23});
    this.load.spritesheet('kelloGreen','kellogreen.png',{frameWidth:16,frameHeight:16});
    this.load.spritesheet('kelloBrown','kellobrown.png',{frameWidth:16,frameHeight:16});
    this.load.image('kelloDeath','deathkello.png');
    this.load.image('snailDeath','deathcaracol.png');
    this.load.image('crowDeath','deathcrow.png');
    this.load.image('cobraDeath','deathcobra.png');
    this.load.spritesheet('huevoAtaque', 'huevoroto.png', { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('huevoFuego',   'huevoroto.png',   { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('huevoPatineta',   'huevoroto.png',   { frameWidth: 22, frameHeight: 16 });
    this.load.spritesheet('playerSkate','jspatineta.png',{frameWidth:24,frameHeight:32});
    this.load.image('powerpatineta','patinetajs.png');
    this.load.spritesheet('player','jswalk.png',{frameWidth:18,frameHeight:32});
    this.load.spritesheet('idlep','jsidle.png',{frameWidth:16,frameHeight:32});
    this.load.spritesheet('jumpp','jsjump.png',{frameWidth:20,frameHeight:32});
    this.load.spritesheet('playerDeath', 'jsdeath.png', { frameWidth: 24, frameHeight: 24 });
    this.load.image('apple', 'apple.png');
    this.load.image('banana', 'banana.png');
    this.load.image('peach', 'peach.png');
    this.load.image('carrot', 'carrot.png');
    this.load.image('score50', '50pts.png');
    this.load.image('score100','100pts.png');
    this.load.image('vida','vidachico.png');
    this.load.image('jarron',  'jarron.png');
    this.load.image('score1000', '1000pts.png');
    this.load.spritesheet('axea', 'jsaxe.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('firea', 'jsbomba.png', { frameWidth: 16, frameHeight: 16 });

    //solo para juego2

    this.load.image('mapa2','mapasinnada.png');
    this.load.image('plat21','plat2.png');
    this.load.image('cuadrao','cuadrado.png');
    this.load.image('plat22','plat22.png');
    this.load.image('plat23','plat23.png');
    this.load.image('plat24','platlvl2.png');
    this.load.image('plat25','platboss.png');
    this.load.spritesheet('araña', 'araña.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('arañaDeath','deatharaña.png');
    this.load.spritesheet('bossBody', 'bossBody.png', { frameWidth: 40, frameHeight: 54 });
    this.load.spritesheet('bossHead', 'bossHead.png', { frameWidth: 24,  frameHeight: 24  });
    this.load.image('bosshead', 'bossHead.png');
    this.load.spritesheet('bossheadanim', 'bossheadanim.png', { frameWidth: 24,  frameHeight: 24  });
    this.load.spritesheet('bossDeathFS', 'jsvictory.png', { frameWidth: 320, frameHeight: 240 });
    this.load.image('bossDeath', 'deathboss.png');
    this.load.spritesheet('coyoteBlue', 'coyoteblue.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('coyoteRed', 'coyotered.png', { frameWidth: 16, frameHeight: 24 });
    this.load.image('coyoteDeath', 'deathcoyote.png');
    this.load.image('flor','florcoyote.png');

    //sonidos
    this.load.audio('sfx_jump',    'audio/salto.wav');
    this.load.audio('sfx_shoot',   'audio/arma.wav');
    this.load.audio('sfx_enemy',   'audio/enemiedeath.wav');
    this.load.audio('sfx_collect', 'audio/recolectable.wav');
    this.load.audio('bg_music1',    'audio/jungla.mp3');
    this.load.audio('bg_music2',    'audio/junglanoche.mp3');
    this.load.audio('menu_music',    'audio/menu.mp3');
    this.load.audio('victory_music',    'audio/victory.mp3');
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
    this.anims.create({
      key: 'bossWalk',
      frames: this.anims.generateFrameNumbers('bossBody', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'BossHeadIdle',
      frames: this.anims.generateFrameNumbers('bossheadanim', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'bossDeathFSAnim',
      frames: this.anims.generateFrameNumbers('bossDeathFS', { start: 0, end: 38 }),
      frameRate: 12,
      hideOnComplete: true
    });
    this.anims.create({
      key: 'coyoteBlueIdle',
      frames: this.anims.generateFrameNumbers('coyoteBlue', { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'coyoteRun',
      frames: this.anims.generateFrameNumbers('coyoteRed', { start: 0, end: 1 }),
      frameRate: 12,
      repeat: -1
    });

     this.scene.start('MainMenu'); 
    }
}