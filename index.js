const express = require('express');
const socket = require('socket.io')
const app = express();

var server = app.listen(80, function () {
    console.log("Server started :80");
})

app.use(express.static('Site'));

var io = socket(server);
io.on('connection', function (socket) {
    socket.on('get', (data) => {
        // console.log("Clint connected, id:" + socket.id);
        // io.emit("id" , socket.id)
        socket.emit("id", socket.id)
        // io.clients[sessionID].send()
        // client.emit("id" , socket.id);
    })
    socket.on('sendMsg', (data) => {
        // console.log("‏Msg send, id:" + data.id);
        io.sockets.emit("newMsg", data);
        // io.emit("id" , socket.id)
    })
});