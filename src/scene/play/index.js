export default {
    key: "play",
    preload() {

    },
    create() {
        console.log("play", "created");
        let {width, height} = this.sys.game.canvas;

        this.bg = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);//背景图,这里先不用移动，游戏开始后再动
        this.pipeGroup = this.add.group();//用于存放管道的组，后面会讲到
        this.pipeGroup.enableBody = true;

        // this.platforms = this.physics.add.staticGroup();
        // this.ground = this.platforms.create(0, height - 112, 'ground').setOrigin(0).refreshBody();

        this.ground = this.add.tileSprite(0, height - 112, width, 112, 'ground').setOrigin(0); //地板，这里先不用移动，游戏开始后再动
        this.physics.add.existing(this.ground, true);

        this.bird = this.physics.add.sprite(50, 150, 'bird').setOrigin(-0.2, 0.5);
        this.bird.setBounce(0.2);
        this.bird.setCollideWorldBounds(true);
        this.bird.anims.play('fly', true);
        this.bird.body.setGravityY(1000);
        this.bird.body.setAngularVelocity(100);
        //鸟的重力,未开始游戏，先让重力为0，不然鸟会掉下来
        this.bird.body.setAllowGravity(false);
        this.physics.add.collider(this.bird, this.ground);
        //
        //get ready 文字
        this.readyText = this.add.image(width / 2, 40, 'ready_text').setOrigin(0.5, 0);
        //提示点击屏幕的图片
        this.playTip = this.add.image(width / 2, 300, 'play_tip').setOrigin(0.5, 0);
        this.hasStarted = false; //游戏是否已开始
        this.startGame = () => {
            if (!this.hasStarted) {
                this.gameSpeed = 200; //游戏速度
                this.gameIsOver = false; //游戏是否已结束的标志
                this.hasHitGround = false; //是否已碰撞到地面的标志
                this.hasStarted = true; //游戏是否已经开始的标志
                this.score = 0; //初始得分
                this.bird.body.setAllowGravity(true);
                this.readyText.destroy();
                this.playTip.destroy();
                this.timer.paused = false;
            } else {
                this.fly();
            }
        };
        this.fly = () => {
            this.bird.body.setVelocityY(-350);
            this.add.tween({
                targets: [this.bird],
                angle: -20,
                duration: 100,
                autoStart: true,
                yoyo: true
            })
        };
        this.pipes = this.add.group();
        this.addOnePipe = (x, y, frame) => {
            // Create a pipe at the position x and y
            let pipe = this.physics.add.sprite(x, y, 'pipe', frame);
            // Add the pipe to our previously created group
            this.pipes.add(pipe);

            // Enable physics on the pipe
            // this.physics.arcade.enable(pipe);
            // this.physics.add.collider(this.bird, pipe);

            pipe.body.setVelocityY(0);
            // Add velocity to the pipe to make it move left
            pipe.body.setVelocityX(-200);

            // Automatically kill the pipe when it's no longer visible
            // pipe.checkWorldBounds = true;
            // pipe.outOfBoundsKill = true;
        };
        this.addRowOfPipes = (gap) => {
            // Randomly pick a number between 1 and 5
            // This will be the hole position
            gap = gap || 100; //上下管道之间的间隙宽度
            let position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());//计算出一个上下管道之间的间隙的随机位置
            let topPipeY = position - 360; //上方管道的位置
            let bottomPipeY = position + gap; //下方管道的位置
            this.addOnePipe(width, topPipeY, 0);
            this.addOnePipe(width, bottomPipeY, 1);
            // let hole = Math.floor(Math.random() * 5) + 1;

            // Add the 6 pipes
            // With one big hole at position 'hole' and 'hole + 1'
            // for (let i = 0; i < 8; i++) {
            //     if (i !== hole && i !== hole + 1) {
            //         this.addOnePipe(400, i * 60 + 10);
            //     }
            // }
        };
        this.input.on("pointerdown", this.startGame, this);
        // this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        //利用时钟事件来循环产生管道
        this.timer = this.time.addEvent({
            delay: 900,
            loop: true,
            callback: this.addRowOfPipes,
            paused: true
        });
    },
    update() {
        this.bg.tilePositionX -= 0.1;
        if (this.hasStarted) {
            this.ground.tilePositionX -= 1;
            // if (this.bird.angle < 20) {
            //     this.bird.angle += 1;
            // }
        }
    }
}