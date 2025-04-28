import { Scene } from 'phaser';

export class VictoryScene extends Scene {
  constructor() {
    super('VictoryScene');
  }

  init(data) {
    this.finalScore = data.score;
    this.finalLives = data.lives;
  }

  create() {
    //color del fondo negro
    this.cameras.main.setBackgroundColor('#000000');

    this.bgMusic = this.sound.add('victory_music', { volume: 0.5, loop: false });
        this.bgMusic.play();
    // 1) Texto de puntuación y vidas finales
    this.add
      .text(this.cameras.main.centerX, 100, `Score: ${this.finalScore}`, {
        fontFamily: 'pixelart', fontSize: '48px', color: '#ffffff'
      })
      .setOrigin(0.5).setScale(0.5);
    this.add
      .text(this.cameras.main.centerX, 160, `Lives: ${this.finalLives}`, {
        fontFamily: 'pixelart', fontSize: '32px', color: '#ffffff'
      })
      .setOrigin(0.5).setScale(0.5);

    // 2) Animación Full-Screen de la muerte del boss
    const deathFS = this.add
      .sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'bossDeathFS'
      )
      .setScrollFactor(0)
      .setOrigin(0.5);

    deathFS.play('bossDeathFSAnim');

    // 3) Al terminar la animación, puedes, por ejemplo,
    //    mostrar un botón de “Reiniciar” o “Menú principal”.
    deathFS.on('animationcomplete', () => {
      // aquí podrías habilitar input para reiniciar
      this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 200,
          'PULSA ESPACIO PARA VOLVER AL MENÚ',
          { fontFamily: 'pixelart', fontSize: '24px', color: '#ffff00' }
        )
        .setOrigin(0.5);

      this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('MainMenu');
      });
    });
  }
}