var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#ADD8E6'
};

var game = new Phaser.Game(config);
var player;
var cursors;
var newPlayer;
var score = 0;
var scoreText;
var findBird = 0;
var gameWidth = config.width;
var gameHeight = config.height;
var centerX = config.width / 2;
var centerY = config.height / 2;
var imageDisplay = false;
var gameOver = false;
var p;
var findBirdText, findBirdImage, personWhoFoundBirdText, gameOverText;
var personWhoFoundBird, personFoundBirdEventConfig;
var findBirdNumber;
// var globalThis = this;

function preload() {
    // load bird images
    for (var i = 0; i < 6; i++) {
        this.load.image('bird' + i, 'bird' + i + '.png');
    };
    this.load.image('bg', 'bg.png');
}

function create() {

    this.add.tileSprite(400, 300, 800, 600, 'bg');
    this.registry.setValue('findBirdNumber', 0)

    console.log(this.registry)
    p = this.input.activePointer;
    // cursors = this.input.keyboard.createCursorKeys();
    var self = this;
    // this.findBirdNumber = 0;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    // add the birds to their coordinates
    this.birds = this.physics.add.group();

    this.socket.on('birdInfo', function (birdInfo) {
        console.log(birdInfo);
        self.registry.setValue('findBirdNumber', birdInfo.birdLookingForNumber)
        self.findBirdNumber = birdInfo.birdLookingForNumber;
        birdInfo.birdCoordinates.forEach((item, idx) => {
            console.log(item)
            var bird = self.physics.add.sprite(item.x, item.y, 'bird' + item.name);
            // bird.setScale(.3)
            bird.name = item.name;
            bird.displayWidth = 30;
            bird.scaleY = bird.scaleX;
            bird.setInteractive();
            bird.on('pointerup', function () {
                console.log('clicked on the bird');

                if (bird.name == self.registry.values.findBirdNumber) {
                    self.socket.emit('playerFoundTheBird');
                    score++;
                    scoreText.setText(score);
                };

            }, bird);

            self.birds.add(bird);
        });

    });

    console.log('created bird info')
    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            console.log(players[id].playerId);
            console.log(self.socket.id);
            if (players[id].playerId === self.socket.id) {
                console.log('adding one single player')
                self.player = self.physics.add.sprite(50, 50, 'p1')
                self.player.visible = false;
                // console.log(selfplayer);


            } else {
                var newPlayer = self.physics.add.sprite(config.x, config.y, 'p2');
                newPlayer.visible = false;
                newPlayer.playerId = players[id].playerId;
                self.otherPlayers.add(newPlayer);
            }
            // console.log('finished for each loop')
        });
    });
    this.socket.on('newPlayer', function (playerInfo) {
        console.log('recieving new player broadcast')
        var newPlayer = self.physics.add.sprite(config.x, config.y, 'p2');
        newPlayer.visible = false;
        newPlayer.playerId = playerInfo.playerId;
        self.otherPlayers.add(newPlayer);
    });
    this.socket.on('playerDisconnected', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });
    // change the bird
    this.socket.on('someoneFoundBirdAndNewBird', function (birdAndFoundInfo) {
        console.log('received someoneFoundBirdAndNewBird emitted function');
        console.log(birdAndFoundInfo)
        self.registry.setValue('findBirdNumber', birdAndFoundInfo.birdFindNumber)
        console.log(self.registry)
        personWhoFoundBird = birdAndFoundInfo.personWhoFoundBird;

        // callback function to delete that someone found the bird
        personFoundBirdEventConfig = {
            delay: 2000,
            callback: personWhoFoundBirdEvent,
            callbackScope: this,
        }
        self.time.addEvent(personFoundBirdEventConfig);

        personWhoFoundBirdText.setText(personWhoFoundBird + ' found the bird');
        personWhoFoundBirdText.visible = true;

        findBirdImage.destroy();
        imageDisplay = false;
        // console.log(this.findBirdNumber)
        // findBirdImage = this.add.image(centerX + 100, 20, 'bird' + this.registry.values.findBirdNumber);
        // findBirdImage.displayWidth = 30;
        // findBirdImage.scaleY = findBirdImage.scaleX;


        imageDisplay = true;
    });
    scoreText = this.add.text(16, 16, score, { fontSize: '32px', fill: '#FFF' });
    findBirdText = this.add.text(centerX - 100, 16, 'find this bird!', { fontSize: '20px', fill: '#FFF' });
    console.log(findBirdNumber)
    console.log('what is findBirdNumber')
    var circle = this.add.circle(centerX + 110, 30, 22, 0xFFFFFF);
    findBirdImage = this.add.image(centerX + 110, 30, 'bird' + this.registry.values.findBirdNumber);
    findBirdImage.displayHeight = 40;
    findBirdImage.scaleX = findBirdImage.scaleY;

    personWhoFoundBirdText = this.add.text(30, gameHeight - 30, '', { fontSize: '20px', fill: '#FFF' });
    personWhoFoundBirdText.visible = false;

    gameOverText = this.add.text(centerX - 100, centerY - 16, 'Game Over', { fontSize: '20px', fill: '#FF0000' });
    gameOverText.visible = false;


    console.log('finished create')
    console.log(findBirdNumber)
    console.log('what is findBirdNumber')
}

function gameOverEvent() {
    gameOverText.visible = true;
    gameOver = true;
};

function personWhoFoundBirdEvent() {
    console.log('here and turning the person found bird event text off')
    personWhoFoundBirdText.visible = false;
};


function update() {


    // player.setVelocity(0);

    // if (cursors.left.isDown) {
    //     player.setVelocityX(-300);
    // }
    // else if (cursors.right.isDown) {
    //     player.setVelocityX(300);
    // }

    // if (cursors.up.isDown) {
    //     player.setVelocityY(-300);
    // }
    // else if (cursors.down.isDown) {
    //     player.setVelocityY(300);
    // }

    if (gameOver) {
        return;

    }

    if (imageDisplay) {
        console.log('in imageDisplay')
        findBirdImage.destroy();
        imageDisplay = false;
        console.log(this.findBirdNumber)
        findBirdImage = this.add.image(centerX + 110, 30, 'bird' + this.registry.values.findBirdNumber);
        findBirdImage.displayHeight = 40;
        findBirdImage.scaleX = findBirdImage.scaleY;

    }
    // console.log(this.registry.get('findBirdNumber'))
}