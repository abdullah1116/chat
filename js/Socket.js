module.exports = function (server) {
    const socket = require('socket.io')

    var fileData = {}
    fileData.list = [];

    var io = socket(server);
    io.on('connection', function (socket) {
        socket.on('get', (data) => {
            socket.emit("id", socket.id);
            console.log("Clint connected, id:" + socket.id);
        })
        socket.on('sendMsg', (data) => {
            // console.log("‏Msg send, id:" + data.id);
            if (data.type == "file") {
                var fileid = genfileid();

                fileData[fileid] = data.data;
                fileData.list.push(fileid);
                io.sockets.emit("newMsg", { ...data, data: fileid, id:socket.id });
                console.log({ ...data, data: fileid });
                if (fileData.list.length > 3) {
                    fileData[fileData.list[0]] = undefined;
                    fileData.list.splice(0, 1);
                }
            } else if (data.type == "text") {
                io.sockets.emit("newMsg", {...data,id:socket.id});
                console.log(data);
            }
        })
    });

    const genfileid = () => {
        let rand = Math.random().toString(36).substring(7)
        if (fileData[rand] != undefined) {
            return genfileid();
        } else {
            return rand;
        }
    };
}