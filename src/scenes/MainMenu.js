import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Fondo del menú principal en el centro
        const bg = this.add.image(0, 0, 'main').setOrigin(0, 0);

        // === Sprite decorativo animado (quieto) ===
        // Crear animación solo si no existe ya
        if (!this.anims.exists('walk')) {
            this.anims.create({
                key: 'walk',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        }

        // Sprite del personaje en la esquina superior izquierda
        const walkingSprite = this.add.sprite(35, 85, 'player');
        walkingSprite.play('walk');

        // Escala opcional si querés que se vea más grande o chico
        walkingSprite.setScale(1);

        // Iniciar juego con tecla o clic
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game2');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}