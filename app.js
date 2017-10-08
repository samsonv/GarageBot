var express = require('express');
var app = express();
var http = require('http').Server(app);
var Gpio = require('onoff').Gpio;
var garageInterval;
var portIsRunning = false;
var usonic = require('r-pi-usonic');

var site = process.argv[2] || 'localhost:3000';
var isBusyBlinking = false;
var turnOff;
var reportDistance;

var self = this;
self.distance = 0;

var blink = function (time) {
    var led = new Gpio(23, 'out');
    led.writeSync(1);
    isBusyBlinking = true;

    if (turnOff) {
        clearTimeout(turnOff);
    }

    turnOff = setTimeout(function () {
        led.writeSync(0);
        led.unexport();
        isBusyBlinking = false;
    }, time);
}

var handleCommand = function () {
    var dur = 1000;
    if (!isBusyBlinking) {
        blink(dur);
    }
}

app.use(express.static('wwwroot'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + 'wwwroot/index.html');
});

app.get('/open', function (req, res) {
    handleCommand();
    res.send('ok, ')
});

app.get('/distance', function (req, res) {
    res.send(self.distance);
})

usonic.init(function (error) {
    if (error) {
        console.log('fail!', error);
    } else {
        var sensor = usonic.createSensor(21, 17, 450);

        if (reportDistance) {
            clearInterval(reportDistance);
        }

        reportDistance = setInterval(function () {
            self.distance = sensor();
        }, 5000);

        http.listen(80, function () {
            console.log('listening on *:' + 80);
        });
    }
});

console.log('trying to connect to ' + site);
