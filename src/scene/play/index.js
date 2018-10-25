import {BIRD_TYPE, THEME_TYPE} from '@/const';

class Play extends Phaser.Scene {
    constructor() {
        super({key: "play"});
        /**
         * 管道索引
         * @type {number}
         */
        this.pipeIndex = 0;
        /**
         * 分数
         * @type {number}
         */
        this.score = 0;
        /**
         * 游戏场景宽度
         * @type {number}
         */
        this.width = 0;
        /**
         * 游戏场景高度
         * @type {number}
         */
        this.height = 0;
        /**
         * 上下管道之间的间隙宽度
         * @type {number}
         */
        this.gap = 165;
        /**
         * 游戏速度或管道速度
         * @type {number}
         */
        this.gameSpeed = -110;
        /**
         * 管道生成间隔时间
         * @type {number}
         */
        this.pipeDelay = 1350;
        /**
         * 每次飞行高度
         * @type {number}
         */
        this.flyHeight = -300;
        /**
         * 小鸟重力速度
         * @type {number}
         */
        this.birdGravity = 250;

        /**
         * 游戏是否已开始
         * @type {boolean}
         */
        this.hasStarted = false;
        /**
         * 游戏是否已结束
         * @type {boolean}
         */
        this.gameIsOver = false;
        /**
         * 是否已撞击地面
         * @type {boolean}
         */
        this.hasHitGround = false;
        /**
         * 是否已撞击管道
         * @type {boolean}
         */
        this.hasHitPipe = false;
    }

    init() {
        let {width, height} = this.sys.game.canvas;
        this.width = width;
        this.height = height;
        this.hasStarted = false;
        this.gameIsOver = false;
        this.hasHitGround = false;
        this.hasHitPipe = false;
        //  重置主题与鸟样式
        /**
         * 主题
         * @type {{bg: *}}
         */
        this.theme = {
            /**
             * 背景
             */
            bg: THEME_TYPE.getRandom(),
            /**
             * 鸟儿配置
             */
            bird: BIRD_TYPE.getRandom()
        };
    }

    create() {
        let {width, height} = this.sys.game.canvas;
        this.init();
        /**
         * 背景
         */
        this.bg = this.add.tileSprite(0, 0, width, height, 'assets', this.theme.bg).setOrigin(0);
        /**
         * 地板
         * @type {*|Phaser.GameObjects.Group}
         */
        this.ground = this.add.tileSprite(0, height - 112, width, 112, 'assets', 'ground.png').setOrigin(0).setDepth(999);
        this.physics.add.existing(this.ground, true);

        /**
         * 分数展示
         * @type {void | * | Phaser.GameObjects.Particles.ParticleEmitter}
         */
        this.labelScore = this.add.bitmapText(width / 2 - 10, 50, "flappy_font", "0").setScale(0.6);
        this.labelScoreGroup = this.add.group();
        this.labelScoreGroup.add(this.labelScore, true);
        this.labelScore.setDepth(2);
        this.labelScoreBoard = this.labelScoreGroup.create(width / 2, 100, "score_board").setDepth(1);
        this.labelScoreMedal = this.labelScoreGroup.create(width / 2 - 65, 140, "medals", 0).setDepth(1);
        this.gameOver = this.labelScoreGroup.create(width / 2, 0, 'assets', "gameover.png").setDepth(2);
        let btn = this.labelScoreGroup.create(width / 2, height / 2 - 50, 'assets', 'start.png').setInteractive().setDepth(1);
        btn.on('pointerdown', () => {
            this.scene.start('play');
        });
        this.labelScoreGroup.toggleVisible();

        //  声音
        this.soundFly = this.sound.add("fly_sound");
        this.soundScore = this.sound.add("score_sound");
        this.soundHitGround = this.sound.add("hit_pipe_sound");
        this.soundHitPipe = this.sound.add("hit_pipe_sound");

        /**
         * 我们的主角，鸟儿
         * @type {*|Phaser.GameObjects.Group}
         */
        this.bird = this.physics.add.sprite(90, 260, 'bird').setDepth(1);
        this.bird.body.setCircle(13, 2, -2);
        this.bird.setBounce(0.4);
        this.bird.setCollideWorldBounds(true);
        this.birdTween = this.add.tween({
            targets: [this.bird],
            y: "+=5",
            delay: 0,
            duration: 400,
            yoyo: true,
            repeat: -1
        });
        //提示点击屏幕的图片
        this.playTip = this.add.image(width / 2, 230, 'assets', 'tips.png').setOrigin(0.5, 0);
        this.bird.setBounce(0.1);
        this.bird.setCollideWorldBounds(true);
        this.bird.anims.play(this.theme.bird.key, true);
        this.bird.body.setGravityY(this.birdGravity);
        this.bird.body.setAllowGravity(false);
        //
        //get ready 文字
        this.readyText = this.add.image(width / 2, 110, 'assets', 'ready.png').setOrigin(0.5, 0);

        /**
         * 小鸟飞行姿态
         * @type {Phaser.Tweens.Tween}
         */
        this.flyTween = this.tweens.add({
            targets: [this.bird],
            angle: {
                getStart(target, key, value) {
                    let angle = target[key];
                    if (angle <= -45) {
                        return -45;
                    }
                    if (angle >= 0) {
                        return -45;
                    }
                    return target[key];
                },
                getEnd() {
                    return -45;
                }
            },
            duration: 350,
            onStart: (tween, target) => {
                this.flyDoing = true;
            },
            onComplete: (tween, target) => {
                if (this.flyDoing) {
                    this.flyDoing = false;
                    if (this.flyDownTween.isPlaying()) {
                        this.flyDownTween.stop();
                        return;
                    }
                }
                this.flyDownTween.restart();
            }
        });
        this.flyTween.pause();
        /**
         * 小鸟下降姿态
         */
        this.flyDownTween = this.tweens.add({
            delay: (v1, v2) => {
                let y = this.bird.body.velocity.y;
                let delay = Math.abs(y) * 10;
                delay = delay <= 50 ? 200 : (delay >= 500 ? 500 : delay);
                // console.log("delay", delay);
                return delay;
            },
            targets: [this.bird],
            angle: {
                getStart(target, key, value) {
                    return target[key];
                },
                getEnd() {
                    return 90;
                }
            },
            duration: () => {
                let duration = this.getBirdHeight() * 1.5;
                duration = duration <= 200 ? 300 : 500;
                // console.log("duration", duration, "height", this.getBirdHeight());
                return duration;
            }
        });
        this.flyDownTween.pause();
        this.pipes = this.add.group();

        this.input.on("pointerdown", this.startGame, this);
        //利用时钟事件来循环产生管道
        this.timer = this.time.addEvent({
            delay: this.pipeDelay,
            loop: true,
            callback: this.addColumnPipes,
            paused: true,
            callbackScope: this
        });
        this.physicBirdPipe = this.physics.add.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        this.physicBirdGround = this.physics.add.collider(this.bird, this.ground, this.hitGround, null, this);
    }

    /**
     * 开始游戏
     */
    startGame() {
        if (!this.hasStarted && !this.gameIsOver) {
            this.gameIsOver = false; //游戏是否已结束的标志
            this.hasHitGround = false; //是否已碰撞到地面的标志
            this.hasStarted = true; //游戏是否已经开始的标志
            this.score = 0; //初始得分
            this.birdTween.stop();
            this.bird.body.setAllowGravity(true);
            this.readyText.destroy();
            this.playTip.destroy();
            this.timer.paused = false;
            this.labelScore.setVisible(true);
        } else {
            this.fly();
        }
    }

    /**
     * 游戏结束
     */
    stopGame() {
        this.cameras.main.shake(40);
        this.gameIsOver = true;
        this.time.removeAllEvents();
        this.hasStarted = false;
        this.timer.paused = true;
        // this.bg.setActive(false);
        // this.ground.setActive(false);
        this.labelScoreGroup.toggleVisible();
        //  计分牌
        this.labelScore.setScale(0.3).setPosition(this.width / 2 + 80, 80).setVisible(true);
        if (this.score >= 100) {
            this.labelScoreMedal.setFrame(1);
        } else if (this.score >= 50) {
            this.labelScoreMedal.setFrame(0);
        } else {
            this.labelScoreMedal.setVisible(false);
        }
        this.add.tween({
            targets: this.labelScoreGroup.getChildren(),
            y: "+=100",
            alpha: 1,
            duration: 600
        });
        this.add.tween({
            targets: this.bird,
            angle: () => {
                if (this.bird.angle < 90 && this.bird.angle >= 0) {
                    return 90;
                }
                return this.bird.angle;
            },
            duration: () => {
                let duration = this.getBirdHeight() * 1.5;
                return duration <= 0 ? 10 : duration;
            },
            state() {
                if (this.duration <= 0) {
                    return 1;
                }
                return 0;
            }
        });
        //  控制鸟在死亡后的掉落
        this.bird.setActive(false);
        // let targetBirdY = this.ground.y - this.bird.height + 18;
        // let duration = 600;
        // if (this.bird.y + 10 >= targetBirdY) {
        //     targetBirdY = this.bird.y - this.bird.height + 5;
        //     duration = 50;
        // } else {
        //     this.add.tween({
        //         targets: [this.bird],
        //         y: targetBirdY,
        //         // angle: 45,
        //         duration: duration,
        //     });
        // }

        //  管道停止运动
        // this.pipes.active = false;
        this.pipes.getChildren().forEach(pipe => {
            pipe.body.setAllowGravity(false);
            pipe.setActive(false).setVelocity(0);
        });
    };

    /**
     * 获取鸟儿离地面的高度
     * @returns {number}
     */
    getBirdHeight() {
        return this.ground.y - this.bird.y - this.bird.height / 2;
    }

    /**
     * 撞击管道时结束游戏
     */
    hitPipe() {
        if (this.hasHitPipe || this.hasHitGround) return;
        this.hasHitPipe = true;
        // console.log("hit pipe");
        this.physicBirdPipe.destroy();
        this.stopGame();
        this.soundHitPipe.play();
    }

    /**
     * 撞击地面时，结束游戏
     */
    hitGround() {
        if (this.hasHitGround || this.hasHitPipe) {
            return;
        }
        // console.log("hit ground");
        // this.physics.world.removeCollider(this.physicBirdGround);
        this.soundHitGround.play();
        this.hasHitGround = true;
        this.stopGame();
    }

    /**
     * 小鸟飞
     */
    fly() {
        if (this.hasStarted && !this.gameIsOver) {
            this.bird.body.setVelocityY(this.flyHeight);
            // if (this.isDown) {
            //     this.flyDownTween.restart();
            // } else {
            this.flyTween.restart();
            // }
            this.soundFly.play();
        }
    }

    /**
     * 添加一列管道
     */
    addColumnPipes() {
        let max = this.height - this.gap - 87;
        let position = Phaser.Math.Between(25, max);
        //上方管道的位置
        let topPipeY = position - 160;
        //下方管道的位置
        let bottomPipeY = position + this.gap + 100;
        this.addOnePipe(this.width, topPipeY, bottomPipeY);
    }

    /**
     * 添加一组管道
     * @param x 横坐标
     * @param y1 上部管道Y坐标
     * @param y2 下部管道Y坐标
     */
    addOnePipe(x, y1, y2) {
        let children = this.pipes.getChildren();
        if (children.length >= 6) {
            let pipe1 = children[0];
            let pipe2 = children[1];
            this.pipes.remove(pipe1);
            this.pipes.remove(pipe2);
            pipe1.hasScored = false;
            pipe2.hasScored = false;
            pipe1.setPosition(x, y1);
            pipe2.setPosition(x, y2);
            this.pipes.add(pipe1);
            this.pipes.add(pipe2);
        } else {
            let pipe1 = this.physics.add.sprite(x, y1, 'assets', 'pipe-green-top.png').setActive(true).setVelocity(this.gameSpeed, 0).setGravity(0);
            let pipe2 = this.physics.add.sprite(x, y2, 'assets', 'pipe-green-bottom.png').setActive(true).setVelocity(this.gameSpeed, 0).setGravity(0);

            pipe1.body.setAllowGravity(false);
            pipe2.body.setAllowGravity(false);
            pipe1.pipeIndex = this.pipeIndex;
            pipe2.pipeIndex = this.pipeIndex;

            this.pipes.add(pipe1);
            this.pipes.add(pipe2);
        }
        this.pipeIndex++;
        // Automatically kill the pipe when it's no longer visible
        // pipe.checkWorldBounds = true;
        // pipe.outOfBoundsKill = true;
    }

    /**
     * 游戏的实时更新
     */
    update() {
        if (!this.gameIsOver) {
            this.ground.tilePositionX += 2;
        }
        if (this.hasStarted) {
            // if (this.bird.angle <= 88.25) {
            //     this.bird.angle += 1.25;
            // }
            //分数检测和更新
            this.pipes.getChildren().forEach(function (pipe, index) {
                if (index % 2 === 0) return false;
                if (!pipe.hasScored && pipe.x <= this.bird.x + this.bird.width) {
                    pipe.hasScored = true; //标识为已经得过分
                    this.labelScore.setText(++this.score); //更新分数的显示
                    this.soundScore.play(); //得分的音效
                }
            }, this);
        }
    }
}

export default Play;