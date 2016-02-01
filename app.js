var express = require('express');
var execute = require('./execute');
var io = require('socket.io-client');

var client = io.connect("localhost:3000");

client.on('connect',function() {
    console.log("connected!");
    client.emit("pi","hello!");
});

client.on('command', function(command){
    console.log('Server tells me to: ', command);
    
    switch (command) {
        case "status":
            client.emit("pi", "I am ok");
            break;
        default:
            client.emit("pi", "Someone told me: " + command);
            break;
    }
})