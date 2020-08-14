const express = require('express');
const socket = require('socket.io')
const app = express();


var server = app.listen(80,function(){
    console.log("c");
})

app.use(express.static('public'));


var io = socket(server);
io.on('connection',function(socket){
    console.log("connect id:" + socket.id)
    socket.on('get',(data)=>{
        console.log("in c") 
        // io.emit("id" , socket.id)
        socket.emit("id" , socket.id)
        // io.clients[sessionID].send()
        // client.emit("id" , socket.id);
    })
    socket.on('sendMsg',(data)=>{
        console.log(data) 
        io.sockets.emit("newMsg", data);
        // io.emit("id" , socket.id)
    })

});