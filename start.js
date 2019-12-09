import {
    main
} from "./main.js";

console.log("start.js loaded!");

var start = new Phaser.Scene("SceneA");
var space;
var botao;
var cursors;
var jogar = false;
var pontos = 5;
var pontosshow;
var tempo = 60000;
var temposhow;
var botaoup;
var botaodown;
var maxpoints = 5;
var player1;
var player2;
var music;


start.preload = function () {
    this.user = {
        num_user: null,
        status: false
    }
    this.load.image("background", "assets/background.png");
    this.load.image("click", "assets/botao1.png");
    this.load.image("arrow", "assets/mais.png");
    this.load.image("arrow2", "assets/menos.png");
    this.load.image("alvo", "assets/alvo.png");
    this.load.image("relogio", "assets/relogio.png");
    this.load.image("controls", "assets/controls.png");
    this.load.spritesheet("player1big", "assets/player1big.png", {
        frameWidth: 460,
        frameHeight: 620
    });
    this.load.spritesheet("player2big", "assets/player2big.png", {
        frameWidth: 460,
        frameHeight: 620
    });
    this.load.audio("music", "assets/music.mp3");
    jogar = false;
};

start.create = function () {

    this.socket = io();

    this.socket.on('res_player', (data) => {
        this.user.num_user = data;

        this.socket.emit('player_ok', this.user);
    });

    this.socket.on('player_ok', (data) => {
        console.log(data);
        var contador = 0;
        data.forEach((data) => {
            if (data.status) {
                contador++;
            }
            if (contador == 2) {
                // Ativa botão
                botao = this.physics.add
                    .sprite(512, 312, "click")
                    .setInteractive()
                    .setScale(1)
                    .on("pointerdown", pointer);

            }
        });
    })

    this.socket.emit('req_player');
    music = this.sound.add('music', {
        volume: 0.1,
        loop: true,
    });
    music.play();
    this.add.image(512, 310, "background");
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    botaodown = this.physics.add
        .sprite(600, 450, "arrow2")
        .setInteractive()
        .setScale(0.7)
        .setAngle(180)
        .on("pointerdown", scoredown);
    botaoup = this.physics.add
        .sprite(600, 385, "arrow")
        .setInteractive()
        .setScale(0.5)
        .on("pointerdown", scoreup);
    cursors = this.input.keyboard.createCursorKeys();
    this.add.sprite(600, 420, "alvo").setScale(0.1);
    this.add
        .sprite(420, 420, "relogio")
        .setScale(0.027)
        .setInteractive()
        .on("pointerdown", changetime);
    temposhow = this.add.text(405, 412, tempo / 1000 + "s", {
        fontFamily: "Arial"
    });
    pontosshow = this.add.text(596, 412, pontos, {
        fontFamily: "Arial"
    });

    player1 = this.add.sprite(100, 400, 'player1big');
    player2 = this.add.sprite(924, 400, 'player2big').setFlipX(true);

    this.add.image(512, 560, "controls").setScale(0.3);

    this.anims.create({
        key: "player1",
        frames: this.anims.generateFrameNumbers("player2big", {
            start: 0,
            end: 14
        }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: "player2",
        frames: this.anims.generateFrameNumbers("player1big", {
            start: 0,
            end: 14
        }),
        frameRate: 6,
        repeat: -1
    });

    player1.anims.play('player1', true);
    player2.anims.play('player2', true);
};

start.update = function () {
    if (jogar) {
        this.scene.start(main);
    }
};

function pointer() {
    jogar = true;
}

function changetime() {
    if (tempo < 179000) {
        tempo = tempo + 30000;
        temposhow.setText(tempo / 1000 + "s");
    } else {
        tempo = 0;
        temposhow.setText(tempo / 1000 + "s");
    }
}

function scoreup() {
    if (pontos <= 59) {
        pontos = pontos + 5;
        pontosshow.setText(pontos);
    }
}

function scoredown() {
    if (pontos > 0) {
        pontos = pontos - 5;
        pontosshow.setText(pontos);
    }
}

export {
    start
};
export {
    pontos
};
export {
    tempo
};
export {
    music
};