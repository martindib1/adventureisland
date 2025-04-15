import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();

        const map = this.make.tilemap({ key: 'mapaCOMPLETO' });

        // Incluir todos los tilesets usados en Tiled para que la capa "plataforma" dibuje los tiles correctos
        const tilesets = [
            map.addTilesetImage('arboles final'),
            map.addTilesetImage('cielo celeste'),
            map.addTilesetImage('intentoarregloparallax'),
            map.addTilesetImage('parte pilares'),
        ];

        // Capas visuales
        map.createLayer('fondo celeste', tilesets, 0, 0)?.setDepth(-10);
        map.createLayer('parallax', tilesets, 0, 0)?.setDepth(-5);

        // Capa de plataformas con colisión
        const plataformaLayer = map.createLayer('plataforma', tilesets, 0, 0);
        plataformaLayer?.setDepth(0);
        plataformaLayer?.setCollisionByProperty({ collides: true });

        // Jugador
        this.player = this.physics.add.sprite(100, 100, 'player', 0);
        this.physics.add.collider(this.player, plataformaLayer);

        // Configurar la cámara para que siga al jugador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Animaciones
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 3 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 5
        });

        this.player.play('idle');
    }

    update() {
        if (!this.cursors) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-550);
            this.player.setFlipX(true);
            if (this.player.body.blocked.down) {
                this.player.anims.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(550);
            this.player.setFlipX(false);
            if (this.player.body.blocked.down) {
                this.player.anims.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.blocked.down) {
                this.player.anims.play('idle', true);
            }
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-1050);
            this.player.anims.play('jump', true);
        }
    }
}
