import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.setPath('assets');
    
    this.load.image('mapita','mapa.png');
    this.load.image('main',       'principio2.png');
    this.load.image('roca',       'roca.png');
    this.load.image('plataforma', 'prosa.png');
    this.load.image('huevoAtaque', 'huevo.png');
    this.load.image('huevoFuego',   'huevo.png');
    this.load.image('bolaAtaque',   'hacha.png');
    this.load.image('bolaFuego',     'fuego2.png');
    this.load.image('enemyFlyer',   'pajaro.png');
    this.load.image('enemyWalker', 'caracol.png');

    this.load.spritesheet('player','correr.png',{
      frameWidth: 18,
      frameHeight: 23
    });
  }

  create() {
    this.scene.start('MainMenu');
  }
}
