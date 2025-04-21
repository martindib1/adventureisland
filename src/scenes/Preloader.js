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
    this.load.image('boulder','bola.png');
    this.load.image('fire','fire.png');
    this.load.spritesheet('spring','trampolin.png',{frameWidth:24,frameHeight:14});
    this.load.image('huevoAtaque','huevo.png');
    this.load.image('huevoFuego','huevo.png');
    this.load.image('bolaAtaque','hacha.png');
    this.load.image('bolaFuego','fuego2.png');
    this.load.spritesheet('player','correr.png',{frameWidth:18,frameHeight:23});
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
  }
  create() {
     this.scene.start('MainMenu'); 
    }
}