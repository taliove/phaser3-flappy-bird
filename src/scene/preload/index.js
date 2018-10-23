/**
 * 加载页面
 */
export default {
    key: "preload",
    preload() {
        let preloadSpring = this.add.sprite(50, this.height / 2, 'loading');
        this.load.image("background", "static/assets/background.png");
        this.load.image("ground", "static/assets/ground.png");
        this.load.image("title", "static/assets/title.png");

        this.load.spritesheet("bird", 'static/assets/bird.png', {
            frameWidth: 34, frameHeight: 24
        }); //鸟
        this.load.image("btn", 'static/assets/start-button.png');  //按钮
        this.load.spritesheet("pipe", 'static/assets/pipes.png', {
            frameWidth: 54, frameHeight: 320
        }); //管道
        this.load.bitmapFont("flappy_font", 'static/assets/fonts/flappyfont/flappyfont.png', 'static/assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        this.load.audio("fly_sound", 'static/assets/flap.wav');//飞翔的音效
        this.load.audio("score_sound", 'static/assets/score.wav');//得分的音效
        this.load.audio("hit_pipe_sound", 'static/assets/pipe-hit.wav'); //撞击管道的音效
        this.load.audio("hit_ground_sound", 'static/assets/ouch.wav'); //撞击地面的音效

        this.load.image('ready_text', 'static/assets/get-ready.png'); //get ready图片
        this.load.image('play_tip', 'static/assets/instructions.png'); //玩法提示图片
        this.load.image('game_over', 'static/assets/gameover.png'); //gameover图片
        this.load.image('score_board', 'static/assets/scoreboard.png'); //得分板
        this.load.spritesheet('medals', 'static/assets/medals.png', {
            frameWidth: 44, frameHeight: 46
        }); //得分板
    },
    create() {
        console.log('preload', "created");
        this.scene.start('menu');
    },
    update() {

    }
}