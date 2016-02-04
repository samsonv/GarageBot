var express = require('express');
var io = require('socket.io-client');
var Gpio = require('onoff').Gpio;

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

client.on('command', function(command){
    console.log('Server tells me to: ', command);
    command = command.toLowerCase();
        
    switch (command) {
        case 'status':
            client.emit('pi', 'I am ok');
            break;
        case 'blink':
            client.emit('pi', 'ok, i am blink now');
            blink(1000);
            break;
        default:
            client.emit('pi', 'Someone told me: ' + command);
            break;
    }
})

console.log('trying to connect to ' + site);