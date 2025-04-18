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
    this.load.image('psal','psal2.png');
    this.load.image('paz','paz.png');
    this.load.image('pam','pam.png');
    this.load.image('proj','proj.png');
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
    this.load.image('cobra','cobra.png');
    this.load.image('cobraFireball','cobrafireball.png');
    this.load.spritesheet('kelloGreen','kellogreen.png',{frameWidth:16,frameHeight:16});
    this.load.spritesheet('kelloBrown','kellobrown.png',{frameWidth:16,frameHeight:16});
    this.load.spritesheet('kelloDeath','kellodeath.png',{frameWidth:16,frameHeight:22});
    this.load.spritesheet('snailDeath','caracoldeath.png',{frameWidth:24,frameHeight:24});
    this.load.spritesheet('crowDeath','crowdeath.png',{frameWidth:16,frameHeight:15});
  }
  create() { this.scene.start('MainMenu'); }
}