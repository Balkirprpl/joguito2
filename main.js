var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 620,
    backgroundColor: "FFC0CB",
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

}

function create () {
    
}

function update () {

}