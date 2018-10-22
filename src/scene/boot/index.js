export default {
    key: "boot",
    preload() {
        this.load.image('loading', "static/assets/preloader.gif");
    },
    create() {
        console.log("boot", "created");
        this.scene.start('preload');
    }
}