export default {
    key: "menu",
    create() {
        console.log("menu", "created");
        let {width, height} = this.sys.game.canvas;
        let groundY = height * 0.8;

        this.bg = this.add.tileSprite(0, 0, width, height, 'assets', 'bg-day.png').setOrigin(0);
        this.ground = this.add.tileSprite(0, groundY, width, 112, 'assets', 'ground.png').setOrigin(0);

        let bird = this.add.sprite(width / 2, 230, 'bird');
        let framesBird = this.anims.generateFrameNames('assets', {
            start: 1,
            end: 3,
            prefix: "yellow-bird",
            suffix: ".png"
        });
        this.anims.create({
            key: 'fly',
            frames: framesBird,
            frameRate: 12,
            repeat: -1
        });
        bird.anims.play('fly', true);

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
    },
    update() {
        this.ground.tilePositionX += 2;
    }
}