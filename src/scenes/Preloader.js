import { Scene } from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.setPath('assets');
        // Fondo del menú principal
        this.load.image('main', 'principio.png');

        // Tilemap JSON
        this.load.tilemapTiledJSON('mapaCOMPLETO', 'mapafinal.json');

        // Tilesets (los nombres deben coincidir con los que usaste en Tiled)
        this.load.image('arboles final', 'arboles final.png');
        this.load.image('cielo celeste', 'cielo celeste.png');
        this.load.image('intentoarregloparallax', 'intentoarregloparallax.png');
        this.load.image('parte pilares', 'parte pilares.png');
        this.load.image('tilex1', 'tilex1.png');
        this.load.image('tileramp', 'tileramp.png');
        this.load.image('rampinv', 'rampinv.png');
        this.load.image('roca', 'roca.png');

        // Jugador
        this.load.spritesheet('player', 'walkfinal-Sheet.png', {
            frameWidth: 71,
            frameHeight: 94
        });
    }

    create() {
        this.scene.start('MainMenu');
    }
}