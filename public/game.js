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

function addPlayer(self, config ){
    self.player = self.physics.add.sprite(config['x'], config['y'], 'p1')
    console.log('added player')
}

// function addOtherPlayer(self, config) {
//     self.physics.add.sprite(config.x, config.y, 'p2')
//     self.otherPlayers.add(otherPlayer);
//     console.log('added another player')
// }

function preload() {
    // this.load.image('sky', 'bg.png');
    this.load.image('p1', 'p1.png');
    this.load.image('p2', 'p2.png');
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    player = this.physics.add.sprite(50, 50, 'p1')
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    
    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            console.log(player)
            if (players[id].playerId === self.socket.id) {
                // // addPlayer(self, players[id]);
                // player = this.physics.add.sprite(players[id]['x'], players[id]['y'], 'p1')
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
        addOtherPlayer(self, playerInfo);
    });
    this.socket.on('playerDisconnected', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    this.socket.on('playerMoved', function (playerInfo) {
        console.log('player moved')
        console.log(playerInfo)
        console.log(self.otherPlayers)
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
    this.socket.emit('playerMovement', { 'x': player.x, 'y': player.y});



    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-300);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(300);
    }
}