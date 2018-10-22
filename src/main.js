import 'phaser';

import scenes from './scene'

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 288,
    height: 505,
    scene: scenes,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    }
};

const game = new Phaser.Game(config);
game.scene.start('boot');
