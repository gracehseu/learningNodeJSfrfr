var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
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

function preload() {
    // load bird images
    for (var i = 0; i < 6; i++) {
        this.load.image('bird' + i, 'bird' + i + '.png');
    };
}

function create() {
    // cursors = this.input.keyboard.createCursorKeys();
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    // add the birds to their coordinates
    this.birds = this.physics.add.group();

    this.socket.on('birdCoordinates', function (birdCoordinates) {
        console.log(birdCoordinates);
        birdCoordinates.forEach((item, idx) => {
            console.log(item)
            var bird = self.physics.add.sprite(item.x, item.y, item.name);
            bird.setScale(.3)
            self.birds.add(bird)
            console.log(self.birds)
        });

    });

    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            console.log(player);
            console.log(players[id].playerId);
            console.log(self.socket.id);
            if (players[id].playerId === self.socket.id) {
                console.log('adding one single player')


            } else {
                var newPlayer = self.physics.add.sprite(config.x, config.y, 'p2');
                newPlayer.playerId = players[id].playerId;
                self.otherPlayers.add(newPlayer);
            }
            // console.log('finished for each loop')
        });
    });
    this.socket.on('newPlayer', function (playerInfo) {
        console.log('recieving new player broadcast')
        var newPlayer = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'p2');
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

    this.socket.on('playerMoved', function (playerInfo) {
        // console.log('player moved')
        // console.log(playerInfo)
        // console.log(self.otherPlayers)
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
            
        });
    });

    console.log('finished create')
}

function update() {
    // console.log(player);
    // this.socket.emit('playerMovement', { 'x': player.x, 'y': player.y});



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
}