import {
    start
} from "./start.js";

import {
    scorep1,scorep2
} from "./main.js";

console.log("gameover.js loaded!");

var jogarnovamente = false;
var botao;
var player1;
var player2;
var oof;
var gameover = new Phaser.Scene("gameOver");

gameover.preload = function () 
{
    this.load.image('player2w', 'assets/win2.png');
    this.load.image('player1w', 'assets/win1.png');
    this.load.image("click", "assets/cliqueaqui.png");
    this.load.spritesheet("player1big", "assets/player1big.png", {
        frameWidth: 460,
        frameHeight: 620
    });
    this.load.spritesheet("player2big", "assets/player2big.png", {
        frameWidth: 460,
        frameHeight: 620
    });
    this.load.audio("oof", "assets/oof.mp3");
    jogarnovamente = false;
}
gameover.create = function () 
{
    oof = this.sound.add('oof');
    oof.play();
    if (scorep1 > scorep2)
    {
        player1win();
    }

    else
    {
        player2win();
    }
    botao = this.physics.add.sprite(512, 512, 'click').setInteractive().setScale(0.3).on('pointerdown', playagain);

    this.anims.create({
        key: "player1",
        frames: this.anims.generateFrameNumbers("player2big", {
            start: 0,
            end: 14
        }),
        frameRate: 9,
        repeat: -1
    });
    this.anims.create({
        key: "player2",
        frames: this.anims.generateFrameNumbers("player1big", {
            start: 0,
            end: 14
        }),
        frameRate: 8,
        repeat: -1
    });
    
    player1.anims.play('player1', true);
    player2.anims.play('player2', true);
    
}
gameover.update = function () 
{
    if (jogarnovamente)
    {
        this.scene.start(start);
    }
}

function playagain()
{
    jogarnovamente = true;
}

function player1win()
{
    player1 = gameover.add.sprite(100, 400, 'player1big').setTint(0xff0000);
    player2 = gameover.add.sprite(924, 400, 'player2big').setFlipX(true);
    gameover.add.image(512, 310, 'player2w');
}
function player2win()
{
    player1 = gameover.add.sprite(100, 400, 'player1big');
    player2 = gameover.add.sprite(924, 400, 'player2big').setFlipX(true).setTint(0xff0000);
    gameover.add.image(512,310, 'player1w');
}

export {gameover};