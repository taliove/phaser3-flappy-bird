import 'phaser';

import scenes from './scene'

window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        parent: 'phaser-app',
        width: 288,
        height: 505,
        autoResize: true,
        scene: scenes,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 800}
            }
        }
    };

    const game = new Phaser.Game(config);
    game.scene.start('boot');


    window.addEventListener('resize', function (event) {
        game.resize(window.innerWidth, window.innerHeight);
    }, false);
}