import {BIRD_TYPE, THEME_TYPE} from '@/const';

class Play extends Phaser.Scene {
    constructor() {
        super({key: "menu"});
    }

    create() {
        let {width, height} = this.sys.game.canvas;
        let groundY = height * 0.8;

        this.bg = this.add.tileSprite(0, 0, width, height, 'assets', THEME_TYPE.day).setOrigin(0);
        this.ground = this.add.tileSprite(0, groundY, width, 112, 'assets', 'ground.png').setOrigin(0);

        let bird = this.add.sprite(width / 2, 230, 'bird');
        bird.setSize(34, 24);
        this.anims.create({
            key: BIRD_TYPE.yellow.key,
            frames: this.anims.generateFrameNames('assets', BIRD_TYPE.yellow.config),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: BIRD_TYPE.blue.key,
            frames: this.anims.generateFrameNames('assets', BIRD_TYPE.blue.config),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: BIRD_TYPE.red.key,
            frames: this.anims.generateFrameNames('assets', BIRD_TYPE.red.config),
            frameRate: 12,
            repeat: -1
        });
        bird.anims.play(BIRD_TYPE.yellow.key, true);

        let title = this.add.image(width / 2, 170, 'assets', 'flappy.png');

        let titleGroup = this.add.group();
        titleGroup.add(bird);
        titleGroup.add(title);

        this.add.tween({
            targets: [bird],
            y: "+=5",
            ease: null,
            delay: 0,
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        let btn = this.add.sprite(width / 2, height - 150, 'assets', 'start.png').setInteractive();
        btn.on('pointerdown', () => {
            this.scene.start('play');
        })
    }

    update() {
        this.ground.tilePositionX += 2;
    }
}

export default Play;