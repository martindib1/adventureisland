import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Fondo del menú principal
        this.add.image(128, 128, 'main');

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
            this.scene.start('Game');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game2');
        });
    }
}