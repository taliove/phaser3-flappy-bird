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

        this.bird = this.physics.add.sprite(50, 150, 'bird');
        this.bird.setBounce(0.2);
        this.bird.setCollideWorldBounds(true);
        this.bird.anims.play('fly', true);
        //鸟的重力,未开始游戏，先让重力为0，不然鸟会掉下来
        this.bird.body.setAllowGravity(false);
        this.physics.add.collider(this.bird, this.ground);
        //
        //get ready 文字
        this.readyText = this.add.image(width / 2, 40, 'ready_text').setOrigin(0.5, 0);
        //提示点击屏幕的图片
        this.playTip = this.add.image(width / 2, 300, 'play_tip').setOrigin(0.5, 0);
        this.hasStarted = false; //游戏是否已开始
        // this.time.events.loop(900, this.generatePipes, this); //利用时钟事件来循环产生管道
        // this.time.events.stop(false); //先不要启动时钟
        this.startGame = () => {
            this.gameSpeed = 200; //游戏速度
            this.gameIsOver = false; //游戏是否已结束的标志
            this.hasHitGround = false; //是否已碰撞到地面的标志
            this.hasStarted = true; //游戏是否已经开始的标志
            this.score = 0; //初始得分
            this.bird.body.setAllowGravity(true);
            this.readyText.destroy();
            this.playTip.destroy();
        };
        this.fly = () => {
            this.bird.body.setVelocityY(-350);
            this.add.tween({
                targets: [this.bird],
                angle: -30,
                duration: 100,
                autoStart: true,
                yoyo: false
            })
        };
        this.generatePipes = function (gap) { //制造一组上下的管道
            gap = gap || 100; //上下管道之间的间隙宽度
            let position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());//计算出一个上下管道之间的间隙的随机位置
            let topPipeY = position - 360; //上方管道的位置
            let bottomPipeY = position + gap; //下方管道的位置

            if (this.resetPipe(topPipeY, bottomPipeY)) return; //如果有出了边界的管道，则重置他们，不再制造新的管道了,达到循环利用的目的

            let topPipe = game.add.sprite(game.width, topPipeY, 'pipe', 0, this.pipeGroup); //上方的管道
            let bottomPipe = game.add.sprite(game.width, bottomPipeY, 'pipe', 1, this.pipeGroup); //下方的管道
            this.pipeGroup.setAll('checkWorldBounds', true); //边界检测
            this.pipeGroup.setAll('outOfBoundsKill', true); //出边界后自动kill
            this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed); //设置管道运动的速度
        }
        this.input.on("pointerdown", this.startGame, this);

    },
    update() {
        this.bg.tilePositionX -= 0.1;
        if (this.hasStarted) {
            this.ground.tilePositionX -= 1;
        }
    }
}