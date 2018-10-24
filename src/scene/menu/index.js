export default {
    key: "menu",
    create() {
        console.log("menu", "created");
        let {width, height} = this.sys.game.canvas;
        this.bg = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);
        this.ground = this.add.tileSprite(0, height - 112, width, 112, 'ground').setOrigin(0);

        let bird = this.add.sprite(0, 100, 'bird');
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 3}),
            frameRate: 12,
            repeat: -1
        });
        bird.anims.play('fly', true);

        let title = this.add.image(width / 2 - bird.width + 10, 100, 'title');
        bird.setX(width / 2 + title.width / 2);

        let titleGroup = this.add.group();
        titleGroup.add(bird);
        titleGroup.add(title);
        console.log(titleGroup);

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
        let btn = this.add.sprite(width / 2, height - 180, 'btn').setInteractive();
        btn.on('pointerdown', () => {
            this.scene.start('play');
        })
    },
    update() {
        this.bg.tilePositionX -= 0.1;
        this.ground.tilePositionX -= 1;
    }
}