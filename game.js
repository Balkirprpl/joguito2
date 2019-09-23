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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var right = false;
var busy = false;
var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('mapa', 'assets/mapa.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('groundvertshort','assets/platformvertshort.png');
    this.load.image('groundvert', 'assets/platformvert.png');
    this.load.image('paredegeral', 'assets/mapa1.png');
    this.load.image('groundvertshort2', 'assets/platformvertshort2.png');
    this.load.spritesheet('dude', 'assets/dude2.png', { frameWidth: 15, frameHeight: 20 });
    //this.load.audio('music', 'assets/music.mp3');
    this.load.image('pilar1', 'assets/pilar1.png');
    this.load.image('pilar2', 'assets/pilar2.png');
    this.load.image('pilar3', 'assets/pilar3.png');
    this.load.image('pilar4', 'assets/pilar4.png');
    this.load.image('pilar', 'assets/pilar.png');
    this.load.image('lake1', 'assets/lake1.png');
    this.load.image('lake2', 'assets/lake2.png');
    this.load.image('lake3', 'assets/lake3.png');
    this.load.image('lake4', 'assets/lake4.png');
    this.load.image('lakea', 'assets/lakea.png');
    this.load.image('lakeb', 'assets/lakeb.png');
    this.load.image('lakec', 'assets/lakec.png');
}

function create ()
{
    //  A simple background for our game
    this.add.image(512, 310, 'mapa');

    //this.soundFX = this.sound.add("music", loop = "true");
    //this.soundFX.play();

    //pilares
    pilars = this.physics.add.staticGroup();

    //lago
    lake = this.physics.add.staticGroup();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Paredes do mapa, pilares
    platforms.create(713, 40, 'ground');
    platforms.create(310, 40, 'ground');
    platforms.create(310, 610, 'ground');
    platforms.create(713, 610, 'ground');
    platforms.create(-100, 300, 'ground');
    platforms.create(-100, 385, 'ground');
    platforms.create(1124, 300, 'ground');
    platforms.create(1124, 385, 'ground');
    platforms.create(90, 528, 'groundvert');
    platforms.create(934, 528, 'groundvert');
    platforms.create(90, 157, 'groundvert');
    platforms.create(934, 157, 'groundvert');
    platforms.create(-15, 310, 'groundvert');
    platforms.create(1039, 310, 'groundvert');
    pilars.create(224, 175, 'pilar');
    pilars.create(800, 175, 'pilar');
    pilars.create(798, 493, 'pilar');
    pilars.create(224, 497, 'pilar');
    lake.create(422, 314, 'lake1');
    lake.create(422, 230, 'lake2');
    lake.create(477, 173, 'lake3');
    lake.create(511, 130, 'lake4');
    lake.create(374, 485, 'lakea');
    lake.create(485, 500, 'lakeb');
    lake.create(513, 553, 'lakec');

    // The player and its settings
    player = this.physics.add.sprite(924, 340, 'dude');
    player.setScale(2)

    //  Player physics properties. Give the little guy a slight bounce.

    //player.setBounce(0,2);

    //player.setCollideWorldBounds(true);



    //  Our player animations, turning, walking left and walking right.


    this.anims.create({
        key: 'busyr',
        frames: this.anims.generateFrameNumbers('dude', {start: 8, end: 10}),
        frameRate: 5,
        repeat: -1
    })

    this.anims.create({
        key: 'busyl',
        frames: this.anims.generateFrameNumbers('dude', {start: 11, end: 13}),
        frameRate: 5,
        repeat: -1
    })

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
         key: 'down',
         frames: this.anims.generateFrameNumbers('dude', { start: 6, end: 6 }),
         frameRate: 10,
         repeat: -1     
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({

        key: 'star',

        repeat: 11,

        setXY: { x: 12, y: 0, stepX: 70 }

    });
    stars.children.iterate(function (child) {



        //  Give each star a slightly different bounce

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));



    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Colisões
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, pilars);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, lake);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}



function update ()

{
    if (gameOver)
    {
        return;
    }

    //alteração da velocidade de movimentação diagonal.
    if (cursors.left.isDown && cursors.up.isDown)
    {
        player.setVelocityX(-113.137);
        player.setVelocityY(-113.137);
        right = false;
        player.anims.play('left', true);
    }

    else if (cursors.left.isDown && cursors.down.isDown)
    {
        player.setVelocityX(-113.137);
        player.setVelocityY(113.137);
        right = false;
        player.anims.play('left', true);
    }

    else if (cursors.right.isDown && cursors.up.isDown)
    {
        player.setVelocityX(113.137);
        player.setVelocityY(-113.137);
        right = true;
        player.anims.play('right', true);
    }

    else if (cursors.right.isDown && cursors.down.isDown)
    {
        player.setVelocityX(113.137);
        player.setVelocityY(113.137);
        right = true;
        player.anims.play('right', true);
    }
    
    // - fim -

    else if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        right = false;
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        right = true;
        player.anims.play('right', true);
    }

    else if (right)
    {
        player.anims.play('busyr', true);
        player.setVelocityX(0);
    }
    else if (!right)
    {
        player.anims.play('busyl', true);
        player.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-160);
    }
    
    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
    }

    else
    {
        player.setVelocityY(0);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    player.anims.play('down');
    gameOver = true;
}