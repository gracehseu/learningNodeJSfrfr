var session = require('express-session')
// var app = express()

// app.use(express.static(__dirname + '/public'));

app.get('/lobby', function (req, res) {
    res.sendFile(__dirname + '/lobby.html');

    res.redirect("/" + generateRandomRoom());
});

app.get("/room/:randomRoom", (req, res) => {
    console.log('in' + randomRoom)
});

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const months = ["January", "February", "March", "April", "May", "June", "July"];

const random = Math.floor(Math.random() * months.length);
console.log(random, months[random]);

function randomElementFromList(arr){
    const random = Math.floor(Math.random() * arr.length);
    return arr[random]
}

function generateRandomRoom() {
    number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    verbs = ["dancing", "prancing", "progrmaming", "sleeping"]
    animals = ["hedgehogs", "manatees", "kiwis", "shihtzus"]
    return randomElementFromList[number] + "-" + randomElementFromList[verbs] + "-" + randomElementFromList[animals]
}


app.use(
    session({
        secret: 'SomeSuperLongHardToGuessSecretString',
        resave: true,
        saveUninitialized: false,
    })
);  