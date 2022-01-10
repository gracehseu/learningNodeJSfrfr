var express = require("express");
var Server = require("http").Server;
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var redis = require('redis')
var redisClient = redis.createClient();
redisClient.connect()
var cookieParser = require('cookie-parser')
var pug = require('pug')

var app = express();
var server = Server(app);
var io = require("socket.io")(server);
app.use(cookieParser("password"))

app.set('views', './views');
app.set('view engine', 'pug');

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 


var sessionMiddleware = session({
    // store: new RedisStore({ client: redisClient }), // XXX redis server config
    secret: "password",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 100000 },
});



io.use(function(socket, next) {
    // if (typeof req.session.username === "undefined") {
    //     req.session.username = "anonymouse";
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.use(sessionMiddleware);

// app.use((req, res, next) => {
//     console.log(req.session)

//     if (typeof req.session.username === "undefined") {
//         req.session.username = "anonymouse";
//         // req.session.username
//     }
//     next();
// });

var birdEvents = require('./birdsocket.js')(io)

app.use(express.static(__dirname + '/public'));

app.get(['/'], function (req, res) {
    res.redirect('/lobby')
});

app.get(['/lobby'], function (req, res) {
    if (typeof req.session.username === "undefined") {
        req.session.username = "anonymouse"}
    var info = {
        username: req.session.username
    }
    res.render('lobby', info)
});


app.post(['/lobby'], function (req, res) {
    console.log('lobby post')
    res.redirect(302, '/room/' + generateRandomRoom());

});

app.get(['/user'], function (req, res) {
    if (typeof req.session.username === "undefined") {
        req.session.username = "anonymouse";}
    var info = {
        username: req.session.username
    }
    res.render('user', info)
});


app.post(['/user'], function (req, res) {
    
    req.session.username = req.body.username
    req.session.save()
    console.log(req.session.id)
    res.redirect(302, '/user');

});



app.get("/room/:randomRoom", (req, res) => {
    if (typeof req.session.username === "undefined") {
        req.session.username = "anonymouse";}
    console.log('in ' + req.params.randomRoom)
    // console.log(req.session.id)
    req.session.room = req.params.randomRoom
    var info = {
        username: req.session.username
    }
    // console.log(req.session)
    // res.sendFile(__dirname + '/public/room.html', info);
    res.render('room', info)
});

function randomElementFromList(arr) {
    const random = Math.floor(Math.random() * arr.length);
    return arr[random]
}

function generateRandomRoom() {
    const number = ["2", "3", "4", "5", "6", "7", "8", "9"]
    const verbs = ["dancing", "prancing", "programming", "sleeping"]
    const animals = ["hedgehogs", "manatees", "kiwis", "shihtzus"]
    return randomElementFromList(number) + "-" + randomElementFromList(verbs) + "-" + randomElementFromList(animals)
}


server.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on http://localhost:3000');
});