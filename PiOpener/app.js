var express = require('express');
var execute = require('./execute');
var got = require('got');
var gpio = require('gpio');
var five = require("johnny-five");
var board = new five.Board();
var app = express();

const home = 'localhost:1337/phonehome';
const phoneinterval = 3000;

app.get('/', function(req, res){
    res.send('hello world');
});

app.get('/blink/:seconds', function(req, res){
    var seconds = parseInt(req.params.seconds)*1000 || 2000;
    res.send('should blink for ' + seconds + ' milliseconds');
    var led = new five.Led(13);
    led.on();
    setTimeout(function(){
        led.off()
    }, seconds); 
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var phoneHome = function(){
    console.log('phoning home..')
    got(home)
    .then(response => {
        console.log(response.body);
    })
    .catch(error => {
        console.log(error.response.body);
    });
}

execute(phoneHome).immediately().regularily(phoneinterval);
