var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var players = {} // keeping track of the players

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
    console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
        // rotation: 0,
        'x': 50,
        'y': 50,
        'playerId': socket.id,
        // team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
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

