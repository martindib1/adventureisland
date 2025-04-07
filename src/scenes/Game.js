import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        
        // Crear jugador
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setCollideWorldBounds(true); // No se sale de la pantalla
        this.player.setGravityY(2500);

        // Colisión entre jugador y plataformas
        this.physics.add.collider(this.player, this.platforms);

        // Cámara
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 4000, 600);
        this.physics.world.setBounds(0, 0, 4000, 600);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Animaciones
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 14,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 10
        });

        // Crear grupo estático para las plataformas
        this.platforms = this.physics.add.staticGroup();

        // Cantidad de tiles necesarios (ajustá según el tamaño del nivel)
        const tileWidth = 130;
        const tileHeight = 216;
        const tilesToFill = Math.ceil(4000 / tileWidth); // si tu nivel mide 4000px

        for (let i = 0; i < tilesToFill; i++) {
        this.platforms.create(i * tileWidth, 768 - tileHeight / 2, 'groundTile')
        .setOrigin(0, 0.5)
        .refreshBody();
        }
        this.physics.add.collider(this.player, this.platforms);

        // === Parallax de fondo decorativo ===
        this.parallaxTiles = [];
        this.parallaxTileWidth = 516;
        const parallaxTilesToFill = Math.ceil(4000 / this.parallaxTileWidth); // o el largo de tu nivel

        for (let i = 0; i < parallaxTilesToFill; i++) {
            const tile = this.add.image(i * this.parallaxTileWidth, 384, 'parallaxTile')
                .setOrigin(0, 0.5)
                .setScrollFactor(0)
                .setDepth(-10); // bien atrás

        this.parallaxTiles.push(tile);
}


    }

    update() {
        // Movimiento lateral
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-550);
            this.player.setFlipX(true);
            if (this.player.body.touching.down) {
                this.player.anims.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(550);
            this.player.setFlipX(false);
            if (this.player.body.touching.down) {
                this.player.anims.play('walk', true);
            }
        } else {
            this.player.setVelocityX(0);
            if (this.player.body.touching.down) {
                this.player.anims.play('idle', true);
            }
        }

        // Salto
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-1050);
            this.player.anims.play('jump', true);
        }

        const scrollX = this.cameras.main.scrollX;
        const parallaxSpeed = 0.3;

        this.parallaxTiles.forEach((tile, i) => {
        tile.x = i * this.parallaxTileWidth - scrollX * (1 - parallaxSpeed);
        });

    }
}
