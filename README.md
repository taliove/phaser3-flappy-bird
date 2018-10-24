# Phaser 3 Flappy Example

## 启动一个场景

```javascript
game.scene.start('scene name');
```

## 创建一个动画

```javascript
    let bird = titleGroup.create(220, 110, 'bird').setOrigin(0);
    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 3}),
        frameRate: 12,
        repeat: -1
    });
    bird.anims.play('fly', true);
```

## 创建tween

```javascript
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
```

## 创建按钮

```javascript
this.startBtn = this.add.sprite(100, 100, 'startBtn').setInteractive();

this.startBtn.on('pointerover', function (event) { /* Do something when the mouse enters */ });
this.startBtn.on('pointerout', function (event) { /* Do something when the mouse exits. */ });
this.startBtn.on('pointerdown', startGame); // Start game on click.
```

* 例子：https://www.cnblogs.com/2050/p/3790279.html
* [API文档](https://photonstorm.github.io/phaser3-docs/index.html)
* [Phaser 3 Scene / Phaser 2 State - passing data to init when start](http://www.html5gamedevs.com/topic/36148-phaser-3-scene-phaser-2-state-passing-data-to-init-when-start/)

# 音频

### 音频载入

```javascript
this.load.audio("xx", ['xx.ogg','xx.mp3']);
```

### 音频转换

## OGG转MP3

https://stackoverflow.com/questions/3255674/convert-audio-files-to-mp3-using-ffmpeg

```
ffmpeg -i input.wav -vn -ar 44100 -ac 2 -ab 192k -f mp3 output.mp3
```