# Phaser 3 Flappy Bird Example
> Phaser3 Flappy Bird 例子

![version](https://img.shields.io/badge/phaser3--flappy--bird-1.0.0-orange.svg)
![build](https://img.shields.io/badge/build-pass-brightgreen.svg)

初学`Phaser3`与H5游戏制作。按照网上搜索的一些例子与教程，完整的做出来了。有些小问题还没有找到更好的方式去解决等。

尚未处理的事情有：

- 鸟的飞行姿态是否可以使用重力去实现
- 转场特效
- 小鸟飞行轨迹
- 按钮点按效果
- 微信小程序兼容

[在线体验 online demo](https://taliove.github.io/phaser3-flappy-bird/index.html)

## 环境配置

|库|版本|
|:---|:---|
|Phaser3|\>=3.15.1|

## 开发与编译

```
npm install
npm run dev // 开发
npm run build // 编译
```

## 相关链接

* [官方示例库](http://labs.phaser.io/index.html)
* [用Phaser来制作一个html5游戏——flappy bird](https://www.cnblogs.com/2050/p/3790279.html)
* [API文档](https://photonstorm.github.io/phaser3-docs/index.html)
* [Phaser 3 Scene / Phaser 2 State - passing data to init when start](http://www.html5gamedevs.com/topic/36148-phaser-3-scene-phaser-2-state-passing-data-to-init-when-start/)

## Phaser3其它说明

### 启动一个场景

```javascript
game.scene.start('scene name');
```

### 创建一个动画

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

### 创建tween

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

### 创建按钮

```javascript
this.startBtn = this.add.sprite(100, 100, 'startBtn').setInteractive();

this.startBtn.on('pointerover', function (event) { /* Do something when the mouse enters */ });
this.startBtn.on('pointerout', function (event) { /* Do something when the mouse exits. */ });
this.startBtn.on('pointerdown', startGame); // Start game on click.
```

### 加载atlas

使用`TexturePacker`进行打包资源后，在`phaser3`里面加载，[参考](https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3)。

```javascript
//  load
this.load.multiatlas('cityscene', 'assets/cityscene.json', 'assets');

//  create sprite
var frameNames = this.anims.generateFrameNames('cityscene', {
    start: 1, end: 8, zeroPad: 4,
    prefix: 'capguy/walk/', suffix: '.png'
});
this.anims.create({ key: 'walk', frames: frameNames, frameRate: 10, repeat: -1 });
capguy.anims.play('walk');
```

### 音频

#### 音频载入

`IOS`系统好像并不支持`ogg`格式，所以需要转换成其它格式。载入时，优先载入`ogg`格式，其次再载入`mp3`格式。

```javascript
this.load.audio("xx", ['xx.ogg','xx.mp3']);
```

#### 音频转换

##### OGG转MP3

使用`ffmpeg`做转换即可，[参考](https://stackoverflow.com/questions/3255674/convert-audio-files-to-mp3-using-ffmpeg)。

```
ffmpeg -i input.wav -vn -ar 44100 -ac 2 -ab 192k -f mp3 output.mp3
```

# License

MIT

[taliove](http://www.taliove.com) 2018