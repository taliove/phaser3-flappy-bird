import 'phaser';

import scenes from './scene'

window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        parent: 'phaser-app',
        width: 288,
        height: 505,
        zoom: 2,
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

    function resize() {
        // game.resize(window.innerWidth, window.innerHeight);
        var canvas = document.querySelector("canvas");
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var gameRatio = config.width / config.height;

        //  以高度优先
        // canvas.style.width = (windowHeight * gameRatio) + "px";
        // canvas.style.height = "100%";

        //  以宽度优先
        canvas.style.width = "100%";
        canvas.style.height = windowWidth / gameRatio + "px";
    }

    //
    window.addEventListener('resize', resize, false);
    resize();
}