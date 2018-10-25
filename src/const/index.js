import 'phaser';

/**
 * 鸟种类
 * @type {*[]}
 */
let birds = [
    {key: 'yellow-bird', config: {start: 1, end: 3, prefix: "yellow-bird", suffix: ".png"}},
    {key: 'blue-bird', config: {start: 1, end: 3, prefix: "blue-bird", suffix: ".png"}},
    {key: 'red-bird', config: {start: 1, end: 3, prefix: "red-bird", suffix: ".png"}}
];

let themes = [
    "bg-dark.png", "bg-day.png"
];

/**
 * 鸟样式
 * @type {{yellow: string, blue: string, red: string}}
 */
export const BIRD_TYPE = {
    count: birds.length,
    yellow: birds[0],
    blue: birds[1],
    red: birds[2],
    /**
     * 获取鸟儿
     * @param index
     * @returns {null|{key: string, config:object}}
     */
    get(index) {
        if (index < birds.length) {
            return birds[index];
        }
        return null;
    },
    /**
     * 获取随机鸟样式
     * @returns {*}
     */
    getRandom() {
        return birds[Phaser.Math.Between(0, birds.length - 1)];
    }
};

/**
 * 主题样式
 * @type {{dark: ({"theme-dark"}|*), day: ({"theme-day"}|*), getRandom(): *}}
 */
export const THEME_TYPE = {
    /**
     * 黑暗主题
     */
    dark: themes[0],
    /**
     * 白天主题
     */
    day: themes[1],
    /**
     * 获取随机主题
     * @returns {{"theme-dark"}|{"theme-day"}|*}
     */
    getRandom() {
        return themes[Phaser.Math.Between(0, themes.length - 1)];
    }
};