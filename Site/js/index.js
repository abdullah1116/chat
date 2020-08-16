var socket = io.connect();
var id = undefined;

socket.emit("get")

const sendMsg = (data) => {
    socket.emit("sendMsg", data)
}

socket.on('id', data => {
    if (id == undefined) {
        id = data;
        $("#id").text(data);
    }
});


socket.on('newMsg', data => {
    // console.log(data);
    if (data.type == "text") {
        $("#textcontainer").append(
            `<div style="display:flex; flex-direction: row${data.id == id ? "-reverse" : ""};">
                <div class="form shadow shadow-lg rounded rounded-lg m-1 ft" style=" z-index: 10;" >
                    <p class="tag">${data.id}</p>${data.data}
                </div>
            </div>`)
    } else if (data.type == "file") {
        $("#textcontainer").append(
            `<div style="display:flex; flex-direction: row${data.id == id ? "-reverse" : ""};">
                <div class="form shadow shadow-lg rounded rounded-lg m-1 ft link" data="${data.data}" name="${data.name}" onClick="filehandler(this)">
                    <p class="tag">${data.id}</p>
                    <img src="/images/file.svg">${data.name}
                </div>
            </div>`)
    }
});



$("#send").click(() => {
    if ($('#input').val() != "") {
        let data = {};
        data.id = id;
        data.type = "text";
        data.data = $('#input').val();
        sendMsg(data);
        $('#input').val('');
    }
});

$("#input").keypress(function (e) {
    if (e.which == 13) {
        if ($('#input').val() != "") {
            let data = {};
            data.id = id;
            data.type = "text";
            data.data = $('#input').val();
            sendMsg(data);
            $('#input').val('');
        }
    }
});


const drop = {
    ondrop: (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            for (var i = 0; i < e.dataTransfer.items.length; i++) {
                var file = e.dataTransfer.files[0],
                    reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (event) {
                    let data = {};
                    data.id = id;
                    data.name = file.name
                    data.data = event.target.result;
                    data.type = "file";
                    sendMsg(data);
                    e.DataTransfer.clearData();
                }
            }
        }
    },

    ondragover: () => {
        event.preventDefault();
    }
}


const filehandler = (e) => {
    var element = document.createElement('a');
    element.setAttribute('href', $(e).attr('data'));
    element.setAttribute('download', $(e).attr('name'));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}