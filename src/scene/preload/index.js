/**
 * 加载页面
 */
export default {
    preload() {
        this.load.image("loading", "assets/preloader.gif");
        this.load.image("background", "assets/background.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("title", "assets/title.png");

        this.load.spritesheet("bird", 'assets/bird.png', {
            frameWidth: 34, frameHeight: 24
        }); //鸟
        this.load.image("btn", 'assets/start-button.png');  //按钮
        this.load.spritesheet("pipe", 'assets/pipes.png', {
            frameWidth: 54, frameHeight: 320
        }); //管道
        this.load.bitmapFont("flappy_font", 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        this.load.audio("fly_sound", 'assets/flap.wav');//飞翔的音效
        this.load.audio("score_sound", 'assets/score.wav');//得分的音效
        this.load.audio("hit_pipe_sound", 'assets/pipe-hit.wav'); //撞击管道的音效
        this.load.audio("hit_ground_sound", 'assets/ouch.wav'); //撞击地面的音效

        this.load.image('ready_text', 'assets/get-ready.png'); //get ready图片
        this.load.image('play_tip', 'assets/instructions.png'); //玩法提示图片
        this.load.image('game_over', 'assets/gameover.png'); //gameover图片
        this.load.image('score_board', 'assets/scoreboard.png'); //得分板
    },
    create() {
        this.bg = this.add.tileSprite(144, 505 / 2, 288, 505, 'background');
        this.ground = this.add.tileSprite(335 / 2, 505 - 112 / 2, 505, 112, 'ground');

        var titleGroup = this.add.group([{
            key: "title",
            setXY: {
                x: 335/2,
                y: 100,
                stepX: 40
            }
        }, {
            key: "bird",
            setXY: {
                x: 100,
                y: 100
            }
        }]);
        // titleGroup.create(179 / 2, 48 / 2, 'title');
        // var bird = titleGroup.create(190, 10, 'bird');
        // bird.animations.add("fly");
        // bird.animations.add("fly", 12, true);

        this.add.tween({
            targets: titleGroup,
            y: 120,
            ease: null,
            delay: 0,
            autoStart: true,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    },
    update() {
        this.bg.tilePositionX -= 0.1;
        this.ground.tilePositionX -= 1;
    }
}