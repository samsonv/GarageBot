var express = require('express');
var io = require('socket.io-client');
var Gpio = require('onoff').Gpio;
var five = require("johnny-five");
var board = new five.Board();

var site = process.argv[2] || 'localhost:3000';
var client = io.connect(site);

client.on('connect',function() {
    console.log('connected!');
    client.emit('pi','hello!');
});

var blink = function(time){
    var led  = new Gpio(4, 'out');
    led.writeSync(1);
    setTimeout(function() {
        led.writeSync(0);
        led.unexport();
    }, time);
}

var blinkWithArduino = function(seconds){
    console.log('should blink for ' + seconds + ' milliseconds');
    var led = new five.Led(13);
    led.on();
    setTimeout(function(){
        led.off()
    }, seconds); 
}

client.on('command', function(command){
    console.log('Server tells me to: ', command);
    command = command.toLowerCase();
        
    switch (command) {
        case 'status':
            client.emit('pi', 'I am ok');
            break;
        case 'open':
            client.emit('pi', 'Ok, opening with gpio 4 now');
            blink(1000);
            break;
            break;
        case 'blink':
            client.emit('pi', 'Ok, opening trough arduino now');
            blinkWithArduino(5000);
            break;
        default:
            client.emit('pi', 'Someone told me: ' + command);
            break;
    }
})

console.log('trying to connect to ' + site);