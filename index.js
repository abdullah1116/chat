const express = require('express');
const socket = require('socket.io')
const app = express();

var fileData = {}
fileData.list = [];
var server = app.listen(80, function () {
    console.log("Server started :80");
})

app.get('/file', function (req, res) {

    res.send(fileData[decodeURI(req._parsedUrl.query)] == undefined ? "Cannot GET" : fileData[decodeURI(req._parsedUrl.query)]);
})

app.use(express.static('Site'));

var io = socket(server);
io.on('connection', function (socket) {
    socket.on('get', (data) => {
        socket.emit("id", socket.id)
        console.log("Clint connected, id:" + socket.id);
    })
    socket.on('sendMsg', (data) => {
        // console.log("‏Msg send, id:" + data.id);
        if (data.type == "file") {
            fileData[socket.id] = data.data;
            fileData.list.push(socket.id);
            io.sockets.emit("newMsg", { ...data, data: socket.id });
            console.log({ ...data, data: socket.id });
            if (fileData.list.length > 3) {
                fileData[fileData.list[0]] = undefined;
                fileData.list.splice(0, 1)
            }
        } else if (data.type == "text"){
            io.sockets.emit("newMsg", data);
            console.log(data);
        }
        // io.emit("id" , socket.id)
    })
});