var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = {} // keeping track of the players
var birdCoordinates;

// const server = require('express')();
// const http = require('http').createServer(server);
// const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on http://localhost:8080');
});

// move into utils
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateRandomNumberListInRange(size, min, max){
    const arr = []
    for (let i = 0; i < size; i++) {
        arr.push(randomInteger(min, max))
    }
    return arr
}

io.on('connection', function (socket) {
    // console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
        // rotation: 0,
        score : 0,
        // 'y': 50,
        'playerId': socket.id,
        // team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    birdInfo =  {
        birdLookingForNumber: 0,
        birdCoordinates : [
            { name: 0, x: 100, y: 100 },
            { name: 1, x: 225, y: 512 },
            { name: 2, x: 352, y: 243 },
            { name: 3, x: 459, y: 489 },
            { name: 4, x: 589, y: 359 },
            { name: 5, x: 623, y: 96 }]
        }

    socket.emit('birdInfo', birdInfo)
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('playerDisconnected', socket.id);
    });
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
    socket.on('playerFoundTheBird', function(){
        birdAndFoundInfo = {
            birdFindNumber: randomInteger(0, 5),
            personWhoFoundBird: socket.id 
        }
        io.sockets.emit('someoneFoundBirdAndNewBird', birdAndFoundInfo)
    })
});

