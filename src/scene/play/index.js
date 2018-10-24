export default {
    key: "play",
    preload() {

    },
    create() {
        console.log("play", "created");
        let {width, height} = this.sys.game.canvas;
        //上下管道之间的间隙宽度
        let gap = 140;
        //  游戏速度或管道速度
        this.gameSpeed = -120;
        //  管道生成间隔时间
        this.pipeDelay = 1400;
        //  每次飞行高度
        this.flyHeight = -350;
        //  小鸟重力速度
        this.birdGravity = 220;
        this.labelDebug = this.add.text(40, 40, 'FPS 0', {fontSize: '15px', fill: '#00ff00'});
        this.bg = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);//背景图,这里先不用移动，游戏开始后再动
        this.bg.setDisplaySize(width, height);

        //  分数
        this.score = 0;
        this.labelScore = this.add.bitmapText(width / 2 - 10, 50, "flappy_font", "0").setScale(0.6);
        this.labelScore.setDepth(2);
        // this.labelScore.setVisible(false);
        this.labelScoreGroup = this.add.group();
        this.labelScoreBoard = this.labelScoreGroup.create(width / 2, 200, "score_board").setDepth(1);
        this.labelScoreMedal = this.labelScoreGroup.create(width / 2 - 65, 209, "medals", 0).setDepth(1);
        this.labelScoreGroup.toggleVisible();

        //  结束
        this.gameOver = this.add.sprite(width / 2, 0, "game_over").setVisible(false).setDepth(2);

        //  声音
        this.soundFly = this.sound.add("fly_sound");
        this.soundScore = this.sound.add("score_sound");
        this.soundHitGround = this.sound.add("hit_ground_sound");
        this.soundHitPipe = this.sound.add("hit_pipe_sound");

        //地板，这里先不用移动，游戏开始后再动
        this.ground = this.add.tileSprite(0, height - 112, width, 112, 'ground').setOrigin(0).setDepth(999);
        this.physics.add.existing(this.ground, true);

        this.bird = this.physics.add.sprite(60, 240, 'bird').setOrigin(0.5).setDepth(998);
        //提示点击屏幕的图片
        this.playTip = this.add.image(width / 2, 190, 'play_tip').setOrigin(0.5, 0);
        // this.bird.setBounce(0.2);
        // this.bird.setCollideWorldBounds(true);
        this.bird.debugBodyColor = "#000";
        this.bird.anims.play('fly', true);
        this.bird.body.setGravityY(this.birdGravity);
        this.bird.body.setAllowGravity(false);
        //
        //get ready 文字
        this.readyText = this.add.image(width / 2, 110, 'ready_text').setOrigin(0.5, 0);
        this.hasStarted = false; //游戏是否已开始
        this.gameIsOver = false;
        this.hasHitGround = false;
        this.hasHitPipe = false;
        this.startGame = () => {
            if (!this.hasStarted && !this.gameIsOver) {
                this.gameIsOver = false; //游戏是否已结束的标志
                this.hasHitGround = false; //是否已碰撞到地面的标志
                this.hasStarted = true; //游戏是否已经开始的标志
                this.score = 0; //初始得分
                this.bird.body.setAllowGravity(true);
                this.readyText.destroy();
                this.playTip.destroy();
                this.timer.paused = false;
                this.labelScore.setVisible(true);
                this.physicBirdPipe = this.physics.add.overlap(this.bird, this.pipes, () => {
                    if (this.hasHitPipe) return;
                    this.hasHitPipe = true;
                    this.stopGame();
                    this.soundHitPipe.play();
                }, null, this);
                this.physicBirdGround = this.physics.add.collider(this.bird, this.ground, () => {
                    if (this.hasHitGround) {
                        return;
                    }
                    this.soundHitGround.play();
                    this.hasHitGround = true;
                    this.stopGame();
                }, null, this);
            } else {
                this.fly();
            }
        };
        this.stopGame = () => {
            this.gameIsOver = true;
            this.time.removeAllEvents();
            this.hasStarted = false;
            this.timer.paused = true;
            this.bg.setActive(false);
            this.ground.setActive(false);

            //  计分牌
            this.labelScore.setScale(0.3).setPosition(width / 2 + 60, 180);
            this.labelScoreGroup.toggleVisible();
            if (this.score >= 100) {
                this.labelScoreMedal.setFrame(1);
            } else if (this.score >= 50) {
                this.labelScoreMedal.setFrame(0);
            } else {
                this.labelScoreMedal.setVisible(false);
            }
            this.gameOver.setVisible(true);
            this.add.tween({
                targets: [this.gameOver],
                y: 100,
                duration: 600
            });

            this.bird.setActive(false);
            let targetBirdY = this.ground.y - this.bird.height + 18;
            let duration = 600;
            if (this.bird.y + 10 >= targetBirdY) {
                targetBirdY = this.bird.y - this.bird.height + 5;
                duration = 50;
            } else {
                this.add.tween({
                    targets: [this.bird],
                    y: targetBirdY,
                    // angle: 45,
                    duration: duration,
                });
            }

            let btn = this.add.sprite(width / 2, height / 2 + 50, 'btn').setInteractive().setDepth(1).setVisible(false);
            btn.on('pointerdown', () => {
                this.scene.start('play');
            });
            this.physics.pause();
            setTimeout(function () {
                btn.setVisible(true);
            }, 3000)
        };
        this.flyTween = this.add.tween({
            targets: [this.bird],
            angle: -45,
            duration: 100,
            hold: 300
        });
        this.flyTween.pause();
        this.flyDownTween = this.add.tween({
            targets: [this.bird],
            angle: 45,
            duration: 100
        });
        this.flyDownTween.pause();
        this.fly = () => {
            if (this.hasStarted && !this.gameIsOver) {
                this.bird.body.setVelocityY(this.flyHeight);
                if (this.flyTween.isPlaying) {
                    this.flyTween.play(80);
                } else {
                    this.flyTween.restart();
                }
                this.soundFly.play();
            }
        };
        this.pipes = this.add.group();
        this.addOnePipe = (x, y, frame) => {
            let pipe = this.physics.add.sprite(x, y, 'pipe', frame).setActive().setVelocity(this.gameSpeed, 0).setGravity(0);
            pipe.body.setAllowGravity(false);
            this.pipes.add(pipe);
            // Automatically kill the pipe when it's no longer visible
            // pipe.checkWorldBounds = true;
            // pipe.outOfBoundsKill = true;
        };
        let max = height - gap - 87;
        this.addRowOfPipes = () => {
            let position = Phaser.Math.Between(25, max);
            let topPipeY = position - 160; //上方管道的位置
            let bottomPipeY = position + gap + 160 - 20; //下方管道的位置
            this.addOnePipe(width, topPipeY, 0);
            this.addOnePipe(width, bottomPipeY, 1);
        };
        this.input.on("pointerdown", this.startGame, this);
        //利用时钟事件来循环产生管道
        this.timer = this.time.addEvent({
            delay: this.pipeDelay,
            loop: true,
            callback: this.addRowOfPipes,
            paused: true
        });
    },
    stopObject() {
        this.bg.setActive(false);
        this.ground.setActive(false);
        this.pipes.stop();
        this.bird.setActive(false);
    },
    update() {
        this.bg.tilePositionX -= 0.1;
        if (this.hasStarted) {
            this.ground.tilePositionX -= 1;
            if (this.bird.angle < 45) {
                this.bird.angle += 2;
            }
            //分数检测和更新
            this.pipes.getChildren().forEach(function (pipe, index) {
                if (index % 2 === 0) return false;
                // console.log(index, pipe.visible);
                if (!pipe.hasScored && pipe.x <= this.bird.x + this.bird.width) {
                    pipe.hasScored = true; //标识为已经得过分
                    this.labelScore.setText(++this.score); //更新分数的显示
                    this.soundScore.play(); //得分的音效
                }
            }, this);
        }

        // this.labelDebug.setText("FPS " + this.time.fps);
    }
}