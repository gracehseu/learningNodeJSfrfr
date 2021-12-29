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

server.listen(8080, () => {
    console.log('Server listening on http://localhost:8080');
});

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
    birdCoordinates =  [
        { name: 'bird0', x: 100, y: 100 }, 
        { name: 'bird1', x: 225, y: 512 }, 
        { name: 'bird2', x: 352, y: 243 }, 
        { name: 'bird3', x: 459, y: 489 }, 
        { name: 'bird4', x: 589, y: 359 }, 
        { name: 'bird5', x: 623, y: 96 }]

    socket.emit('birdCoordinates', birdCoordinates)
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
});

