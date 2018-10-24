/**
 * 加载页面
 */
export default {
    key: "preload",
    preload() {
        let preloadSpring = this.add.sprite(50, this.height / 2, 'loading');
        this.load.multiatlas('assets', 'static/assets/atlas.json', "static/assets");
        this.load.bitmapFont("flappy_font", 'static/assets/fonts/flappyfont/flappyfont.png', 'static/assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        //飞翔的音效
        this.load.audio("fly_sound", 'static/assets/sounds/wing.ogg');
        //得分的音效
        this.load.audio("score_sound", 'static/assets/sounds/point.ogg');
        //撞击管道的音效
        this.load.audio("hit_pipe_sound", 'static/assets/sounds/hit.ogg');
        //撞击地面的音效
        this.load.audio("hit_ground_sound", 'static/assets/sounds/die.ogg');
        //得分板
        this.load.image('score_board', 'static/assets/scoreboard.png');

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