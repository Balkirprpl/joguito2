import { gameover } from "./gameover.js";
import { tempo, pontos, music } from "./start.js";

console.log("main.js loaded!");

var player;
var player2;
var star;
var bombs;
var platforms;
var cursors;
var score = 0;
var scoreText;
var right = false;
var busy = false;
var botao;
var jogar = false;
var background;
var passos = false;
var passosp2 = false;
var x = 160;
var xdiag = 113.137;
var xnegativo = -160;
var xdiagnegativo = -113.137;
var boosttime = 0;
var temposla = 0;
var mano = 0

//max score win
var player1win;
var tie;

//timer
var timer;
var texttimer;
var remainingtime;

//placares
var scorep1 = 0;
var scorep2 = 0;
var score1;
var score2;

//keyboard
var keyW;
var keyA;
var keyD;
var keyS;
var ENTER;
var space;
var ingame = false;

//jogadores
var player;
var player2;
var player2life = 3;
var player2lifeshow;
var heart;
var heartshow = 0;

//mapa
var pilars;
var depth;
var lake;
var platforms;

//tiro
var playerBullets;
var hittarget;
var hitwall;
var uptohit = true;
var ammo = 6;
var ammoshow = 6;
var ammosheet;
var reload = false;
var reloadtime = 176;
var reloadshow;
var firstshoot = true;
//reticula
var reticle;

//tocha
var tocha1;
var tocha2;
var tocha3;
var tocha4;

//bandeiras
var flag1;
var flag2;

var mute = false;
var button;

var main = new Phaser.Scene("Main");

var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Bullet(scene) {
        if (firstshoot)
        {
            Phaser.GameObjects.Image.call(this, scene, -20, -20, "starblue");
            this.speed = 0.6;
            this.born = -100;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(15, 15);
            this.setScale(0.17);
            this.setOrigin(3);
            firstshoot = false;
        }

        else
        {
            Phaser.GameObjects.Image.call(this, scene, -20, -20, "star");
            this.speed = 0.4;
            this.born = -600;
            this.direction = 0;
            this.xSpeed = 0;
            this.ySpeed = 0;
            this.setSize(15, 15);
            this.setScale(0.17);
            this.setOrigin(3);
            firstshoot = true;
            }
    },

    // Fires a bullet from the player to the reticle
    fire: function(shooter, target) {
        this.setPosition(shooter.x, shooter.y); // Initial position
        this.direction = Math.atan((target.x - this.x) / (target.y - this.y));

        // Calculate X and y velocity of bullet to moves it from shooter to target
        if (target.y >= this.y) {
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        } else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        this.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y) - 55; // angle bullet with shooters rotation
    },

    // Updates the position of the bullet each cycle
    update: function(time, delta) {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;

        if (this.born > 300 || hittarget || hitwall) {
          
            hittarget = false;
            hitwall = false;
            this.destroy();
            uptohit = true
        }
    }

});

main.preload = function() {
    this.load.image("mapa", "assets/mapaaaa.png");
    this.load.image("mapa1", "assets/mapa1.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("starblue", "assets/starblue.png");
    this.load.spritesheet("bomb", "assets/bomb.png", {
        frameWidth: 148,
        frameHeight: 168
    });
    this.load.image("groundvertshort", "assets/platformvertshort.png");
    this.load.image("groundvert", "assets/platformvert.png");
    this.load.image("paredegeral", "assets/mapa1.png");
    this.load.image("groundvertshort2", "assets/platformvertshort2.png");
    this.load.spritesheet("dude", "assets/dude2.png", {
        frameWidth: 17,
        frameHeight: 20
    });
    this.load.spritesheet("ammosheet", "assets/ammosheet.png", {
        frameWidth: 310,
        frameHeight: 724
    });
    this.load.spritesheet("heart", "assets/heart.png", {
        frameWidth: 285,
        frameHeight: 94
    });
    this.load.spritesheet("tocha", "assets/tocha.png", {
        frameWidth: 14,
        frameHeight: 30
    });
    this.load.spritesheet("flag", "assets/flag.png", {
        frameWidth: 38,
        frameHeight: 44
    });
    this.load.image("pilar1", "assets/pilar1.png");
    this.load.image("pilar2", "assets/pilar2.png");
    this.load.image("pilar3", "assets/pilar3.png");
    this.load.image("pilar4", "assets/pilar4.png");
    this.load.image("pilar", "assets/pilar.png");
    this.load.image("lake1", "assets/lake1.png");
    this.load.image("lake2", "assets/lake2.png");
    this.load.image("lake3", "assets/lake3.png");
    this.load.image("lake4", "assets/lake4.png");
    this.load.image("lakea", "assets/lakea.png");
    this.load.image("lakeb", "assets/lakeb.png");
    this.load.image("lakec", "assets/lakec.png");
    this.load.image("click", "assets/botao.png");
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("fullscreen", "assets/fullscreen.png", {
        frameWidth: 64,
        frameHeight: 64
    });
    //this.load.audio("footstep", "assets/footstep.mp3");

    scorep1 = 0;
    scorep2 = 0;
    ammo = 6;
    player2life = 3;
};

main.create = function(){
    //  A simple background for our game
    this.add.image(512, 310, "mapa");
    //limite tela
    this.physics.world.setBounds(0, 0, 1024, 620);

    //controles wasd
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    ENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    //tiro
    playerBullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    this.input.on(
        "pointerdown",
        function(pointer, time, lastFired) {
            var bullet = playerBullets
                .get()
                .setActive(true)
                .setVisible(true);

            if (bullet && ammo >= 1 && !reload && ingame) {
                bullet.fire(player, reticle);
                ammo = ammo - 1;
                ammosheet.setFrame(ammo)
            }
        }
    );

    this.input.on("pointerdown", function() {
        main.input.mouse.requestPointerLock();
        ingame = true;
    });

    
    this.input.keyboard.on('keydown_M', function(){
        if(mute)
        {
            music.play();
            mute = false;
        }
        else
        {
            music.stop();
            mute = true;
        }
    });

    this.input.keyboard.on(
        "keydown_Q",
        function(event) {
            if (main.input.mouse.locked) main.input.mouse.releasePointerLock();
            ingame = false;
        },
        0,
        this
    );

    this.input.on(
        "pointermove",
        function(pointer) {
            if (this.input.mouse.locked) {
                reticle.x += pointer.movementX;
                reticle.y += pointer.movementY;
            }
        },
        this
    );

    //pilares
    pilars = this.physics.add.staticGroup();
    depth = this.physics.add.staticGroup();

    //lago
    lake = this.physics.add.staticGroup();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //colisao estrelas
    star = this.physics.add.staticGroup();

    //sprite personagens
    //player1
    player = this.physics.add.sprite(924, 340, "dude");
    player.setScale(2);
    player.setSize(11, 18, true);
    player.setOffset(3, 3);

    //player2
    player2 = this.physics.add.sprite(100, 340, "dude");
    player2.setScale(2);
    player2.setSize(11, 18, true);
    player2.setOffset(3, 3);

    //  Paredes do mapa, pilares
    platforms.create(713, 40, "ground");
    platforms.create(310, 40, "ground");
    platforms.create(310, 610, "ground");
    platforms.create(713, 610, "ground");
    platforms.create(-100, 300, "ground");
    platforms.create(-100, 415, "ground");
    platforms.create(1124, 300, "ground");
    platforms.create(1124, 415, "ground");
    platforms.create(90, 558, "groundvert");
    platforms.create(934, 558, "groundvert");
    platforms.create(90, 157, "groundvert");
    platforms.create(934, 157, "groundvert");
    platforms.create(-15, 310, "groundvert");
    platforms.create(1039, 310, "groundvert");
    depth.create(224, 160, "pilar1");
    depth.create(800, 161, "pilar2");
    depth.create(798, 478, "pilar3");
    depth.create(224, 497, "pilar4");
    pilars.create(224, 175, "pilar");
    pilars.create(800, 175, "pilar");
    pilars.create(798, 493, "pilar");
    pilars.create(224, 497, "pilar");
    lake.create(422, 314, "lake1");
    lake.create(422, 230, "lake2");
    lake.create(477, 173, "lake3");
    lake.create(511, 130, "lake4");
    lake.create(374, 485, "lakea");
    lake.create(485, 500, "lakeb");
    lake.create(513, 553, "lakec");
    this.add.image(512, 310, "mapa1");
    ammosheet = this.add.image(980, 470, 'ammosheet').setScale(0.15);
    heart = this.add.image(40, 425, 'heart').setScale(0.2);
    tocha1 = this.add.sprite(32, 300, 'tocha');
    tocha2 = this.add.sprite(992, 300, 'tocha');
    tocha3 = this.add.sprite(288, 44, 'tocha');
    tocha4 = this.add.sprite(736, 44, 'tocha');
    flag1 = this.add.sprite(417, 46, 'flag');
    flag2 = this.add.sprite(607, 46, 'flag');

    //Fullscreen
    var button = this.add
        .image(1030 - 16, 16, "fullscreen", 0)
        .setOrigin(1, 0)
        .setInteractive();
    // Ao clicar no botão de tela cheia
    button.on(
        "pointerup",
        function() {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        },
        this
    );

    var FKey = this.input.keyboard.addKey("F");
    FKey.on(
        "down",
        function() {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        },
        this
    );

    //placares
    score2 = this.add.text(50, 200, scorep2, {
        fontSize: "32px",
        fill: "#ffffff"
    });

    //placares
    score1 = this.add.text(974, 200, scorep1, {
        fontSize: "32px",
        fill: "#ffffff"
    });
    //animações

    //reticle
    this.anims.create({
        key: "bomb",
        frames: this.anims.generateFrameNumbers("bomb", {
            start: 0,
            end: 14
        }),
        frameRate: 12,
        repeat: -1
    });

    //corações
    this.anims.create({
        key: "coracoes",
        frames: this.anims.generateFrameNumbers("heart", {
            start: 0,
            end: 2
        }),
    });

    //tocha
    this.anims.create({
        key: "tocha",
        frames: this.anims.generateFrameNumbers("tocha", {
            start: 0,
            end: 10
        }),
        frameRate: 10,
        repeat: -1
    });
    
    //bandeira
    this.anims.create({
        key: "flag",
        frames: this.anims.generateFrameNumbers("flag", {
            start: 0,
            end: 7
        }),
        frameRate: 10,
        repeat: -1,
        repeatDelay: 3000
    });

    //ammo
    this.anims.create({
        key: "municaoanim",
        frames: this.anims.generateFrameNumbers("ammosheet", {
            start: 0,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });
    ammosheet.setFrame(ammo);
    //player1 carinha
    this.anims.create({
        key: "busy",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 4,
            end: 6
        }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: "walk",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    //player 2 mago
    this.anims.create({
        key: "busy2",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 7,
            end: 9
        }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: "walk2",
        frames: this.anims.generateFrameNumbers("dude", {
            start: 10,
            end: 13
        }),
        frameRate: 10,
        repeat: -1
    });

    //retícula
    reticle = this.physics.add.sprite(512, 310, "bomb").setScale(0.2);
    reticle.setCollideWorldBounds(true);

    //cursores setinhas
    cursors = this.input.keyboard.createCursorKeys();

    //  Colisões
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, pilars);
    this.physics.add.collider(player, lake);
    this.physics.add.collider(player2, lake);
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(player2, pilars);

    //function collider
    this.physics.add.overlap(player, player2, colisao, null, this);
    this.physics.add.overlap(player2, playerBullets, hit, null, this);
    this.physics.add.overlap(platforms, playerBullets, hitparede, null, this);
    this.physics.add.overlap(pilars, playerBullets, hitparede, null, this);

    jogar = true;

    if (tempo > 0) {
        timer = {
            text: this.add.text(480, 30, tempo / 1000, {
                fontSize: "32px",
                fill: "#000",
                fontFamily: 'Arial'
            }),
            event: this.time.addEvent({
                delay: tempo,
                callback: gamewin,
                callbackScope: this
            })
        };
    }

    //dar play nas animações das tochas
    tocha1.anims.play("tocha", true);
    tocha2.anims.play("tocha", true);
    tocha3.anims.play("tocha", true);
    tocha4.anims.play("tocha", true);

    flag1.anims.play("flag", true);
    flag2.anims.play('flag', true);

    reticle.anims.play('bomb', true);
};

main.update = function() {
    if (pontos <= scorep2 || pontos <= scorep1) {
        gamewin();
    }
    if (tempo > 0) {
        let timeRemaining =
            tempo / 1000 - Math.round(timer.event.getElapsedSeconds());
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = Math.round(timeRemaining % 60);
        seconds = (seconds < 10 ? "0" : "") + seconds;
        timer.text.setText(minutes + ":" + seconds);
    }
    //alteração da velocidade de movimentação diagonal.
    if (keyA.isDown && keyW.isDown) {
        player2.setVelocityX(xdiagnegativo);
        player2.setVelocityY(xdiagnegativo);
        player2.anims.play("walk", true);
        player2.setFlipX(true);
        passos = true;
    } else if (keyA.isDown && keyS.isDown) {
        player2.setVelocityX(xdiagnegativo);
        player2.setVelocityY(xdiag);
        player2.anims.play("walk", true);
        player2.setFlipX(true);
        passos = true;
    } else if (keyD.isDown && keyW.isDown) {
        player2.setVelocityX(xdiag);
        player2.setVelocityY(xdiagnegativo);
        player2.anims.play("walk", true);
        player2.setFlipX(false);
        passos = true;
    } else if (keyD.isDown && keyS.isDown) {
        player2.setVelocityX(xdiag);
        player2.setVelocityY(xdiag);
        right = true;
        player2.anims.play("walk", true);
        player2.setFlipX(false);
        passos = true;
    }
    // - fim -

    //direções normais
    else if (keyA.isDown) {
        player2.setVelocityX(xnegativo);
        right = false;
        player2.anims.play("walk", true);
        player2.setFlipX(true);
        passos = true;
        player2.setVelocityY(0);
    } else if (keyD.isDown) {
        player2.setVelocityX(x);
        player2.anims.play("walk", true);
        player2.setFlipX(false);
        passos = true;
        player2.setVelocityY(0);
    } else {
        player2.setVelocityX(0);
        player2.anims.play("busy", true);
    }

    if (keyW.isDown) {
        player2.setVelocityY(xnegativo);
        passos = true;
    } else if (keyS.isDown) {
        player2.setVelocityY(x);
        passos = true;
    } else {
        player2.setVelocityY(0);
        passos = false;
    }
    //fim
    //player 2
    if (cursors.up.isDown && cursors.left.isDown) {
        player.setVelocityX(-113.137);
        player.setVelocityY(-113.137);
        player.anims.play("walk2", true);
        player.setFlipX(true);
        passosp2 = true;
    } else if (cursors.up.isDown && cursors.right.isDown) {
        player.setVelocityX(113.137);
        player.setVelocityY(-113.137);
        player.anims.play("walk2", true);
        player.setFlipX(false);
        passosp2 = true;
    } else if (cursors.down.isDown && cursors.left.isDown) {
        player.setVelocityX(-113.137);
        player.setVelocityY(113.137);
        player.anims.play("walk2", true);
        player.setFlipX(true);
        passosp2 = true;
    } else if (cursors.down.isDown && cursors.right.isDown) {
        player.setVelocityX(113.137);
        player.setVelocityY(113.137);
        player.anims.play("walk2", true);
        player.setFlipX(false);
        passosp2 = true;
    } else if (cursors.left.isDown) {
        player.setVelocityX(-160);
        right = false;
        player.anims.play("walk2", true);
        player.setFlipX(true);
        passosp2 = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("walk2", true);
        player.setFlipX(false);
        passosp2 = true;
    } else {
        player.setVelocityX(0);
        player.anims.play("busy2", true);
        passosp2 = false;
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-160);
        passosp2 = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
        passosp2 = true;
    } else {
        player.setVelocityY(0);
    }
    //fim

    //boost
    if (space.isDown && boosttime > 100) {
        x = 1000;
        xnegativo = -1000;
        xdiag = 601.04;
        xdiagnegativo = -601.04;
        temposla++;
        if (temposla > 5) {
            boosttime = 0;
            temposla = 0;
        }
    } else {
        x = 160;
        xnegativo = -160;
        xdiag = 113.137;
        xdiagnegativo = -113.137;
        player2.clearTint();
        if (boosttime <= 100)
        {
            boosttime ++;
        };
    }

    //reload
    if (ENTER.isDown && ammo <= 5) {
        reload = true;
    } else if (reload) {
        reloadtime--;
        if (reloadtime <= 0) {
            ammo = 6;
            reloadtime = 176;
            reload = false;
            ammosheet.setFrame(ammo);
        } else if (reloadtime <= 58) {
            ammosheet.setFrame(6);
        } else if (reloadtime <= 116) {
            ammosheet.setFrame(4);
        } else if (reloadtime <= 175) {
            ammosheet.setFrame(2);
        }
    }
};

function hitparede() {
    hitwall = true;
}

function colisao() {
    player2.setPosition(100, 340);
    player.setPosition(924, 340);
    player2life = 3;
    ammo = 6;
    player2scored();
    ammosheet.setFrame(ammo);
    boosttime = 0;
}

function hit() {
    hittarget = true;
    player2.setTint(0xffff00);
    
    if (player2life === 1 && uptohit) {
        player2.setPosition(100, 340);
        player.setPosition(924, 340);
        player2life = 3;
        ammo = 6;
        ammosheet.setFrame(ammo)
        player1scored();
        boosttime = 0;
        heart.setFrame(0);
        uptohit = false;
    }
    else if (player2life === 2 && uptohit)
    {
        heart.setFrame(2);
        player2life = player2life - 1;
        uptohit = false;
    }
    else if (player2life === 3 && uptohit)
    {
        heart.setFrame(1);
        player2life = player2life - 1;
        uptohit = false;
    }
}

function player1scored()
{
    scorep1 = scorep1 + 1;
    score1.setText(scorep1);
    player2life = 3;
}

function player2scored()
{
    scorep2 = scorep2 + 1;
    score2.setText(scorep2);
    player2life = 3;
}

function gamewin() {
    main.input.mouse.releasePointerLock();
    music.stop();
    main.scene.start(gameover);
}

export { main };
export { scorep1 };
export { scorep2 };