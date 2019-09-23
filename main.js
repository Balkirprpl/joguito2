var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 620,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0},
            debug: false
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('mapa', 'assets/mapa.png');
}

function create () {
    this.add.image(512, 310, 'mapa');
}

function update () {

}