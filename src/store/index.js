/**
 * 存储
 */
class Store {
    constructor() {

    }

    /**
     * 获取本机历史最高分
     */
    getMaxScore() {
        return this.getStorage("max-score", 0);
    }

    /**
     * 设置本机历史最高分
     */
    setMaxScore(score) {
        this.setStorage("max-score", score);
    }

    setStorage(key, value) {
        if (window.localStorage) {
            window.localStorage.setItem(key, window.JSON.stringify(value));
        }
    }

    getStorage(key, defaultValue) {
        if (window.localStorage) {
            return window.JSON.parse(window.localStorage.getItem(key)) || defaultValue;
        }
        return defaultValue === undefined ? null : defaultValue;
    }
}

export default new Store();