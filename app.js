/*-------THIS STUFF IS APPARENTLY JUST NECESSARY---------
--------AND NOBODY IN THE WORLD KNOWS HOW IT WORKS------*/
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('client', express.static(__dirname + '/client'));

/*-----------------END MYSTERY STUFF-------------------
-----(just kidding, it's briefly explained at:---------
-----https://www.youtube.com/watch?v=PfSwUOBL1YQ -----*/

serv.listen(2000);
console.log('Server started.');

var io = require('socket.io')(serv,{});

// SOCKET_LIST contains a list of all clients (sockets) currently connected
var SOCKET_LIST = {};

// Whenever there is a connection, this function will be called automatically
io.sockets.on('connection', function(socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    
    // Whenever there is a disconnection, this will be called automatically
    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
    });

    socket.on('type', function(data) {
        socket.type = data.type;
    })
})

setInterval(function() {
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        socket.emit('newPosition', {
            x: socket.x,
            y: socket.y
        })
    }
}, 1000/25)
