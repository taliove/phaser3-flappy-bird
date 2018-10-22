export default {
    key: "menu",
    create() {
        console.log("menu", "created");
        this.bg = this.add.tileSprite(144, 505 / 2, 288, 505, 'background');
        this.ground = this.add.tileSprite(335 / 2, 505 - 112 / 2, 505, 112, 'ground');

        let titleGroup = this.add.group();
        let bird = titleGroup.create(220, 110, 'bird').setOrigin(0);
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 3}),
            frameRate: 12,
            repeat: -1
        });
        bird.anims.play('fly', true);
        let title = titleGroup.create(30, 100, 'title').setOrigin(0);

        this.add.tween({
            targets: [title, bird],
            y: 120,
            ease: null,
            delay: 0,
            autoStart: true,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        let {width, height} = this.sys.game.canvas;
        let btn = this.add.sprite(width / 2, height / 2, 'btn').setInteractive();
        btn.on('pointerdown', () => {
            this.scene.start('play');
        })
    },
    update() {
        this.bg.tilePositionX -= 0.1;
        this.ground.tilePositionX -= 1;
    }
}