import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        //color del fondo negro
    this.cameras.main.setBackgroundColor('#000000');

    this.add
      .text(this.cameras.main.centerX, 100, `GAME OVER`, {
        fontFamily: 'pixelart', fontSize: '48px', color: '#ffffff'
      })
      .setOrigin(0.5).setScale(0.5);
    this.add
      .text(this.cameras.main.centerX, 160, `Press ANY KEY to restart`, {
        fontFamily: 'pixelart', fontSize: '32px', color: '#ffffff'
      })
      .setOrigin(0.5).setScale(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');

        });
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        });
    }
}
