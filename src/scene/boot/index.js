export default {
    key: "boot",
    preload() {
        this.load.image('loading', "static/assets/preloader.gif");
    },
    create() {
        this.scene.start('preload');
    }
}