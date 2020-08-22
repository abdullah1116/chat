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
                    <p class="tag">${data.id} <a class="tag"></a></p>
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
                    data.type = "file";
                    data.data = event.target.result;
                    data.name = file.name
                    sendMsg(data);
                    // e.DataTransfer.clearData();
                    e.dataTransfer.files = undefined
                }
            }
        }
    },
    onclick: (e) => {
        var file = e.files[0],
            reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            let data = {};
            data.id = id;
            data.name = file.name
            data.data = event.target.result;
            data.type = "file";
            sendMsg(data);
            e.files = undefined
        }
    },

    ondragover: () => {
        event.preventDefault();
    }
}


const filehandler = (e) => {
    var target = "/file?" + $(e).attr('data');
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/octet-stream');
    xhr.open('GET', target, true);
    xhr.responseType = 'text';
    xhr.send();
    xhr.onprogress = function (e2) {
        var value = e2.loaded + "";
        var prog = value[0] + value[1];
        $(e)[0].children[0].children[0].textContent = ` ${prog}%`;
        console.log(prog);
    };
    xhr.onload = function () {
        if (xhr.response != "Cannot GET") {

            var element = document.createElement('a');
            element.setAttribute('href', xhr.response);
            element.setAttribute('download', $(e).attr('name'));
            element.style.display = 'none';
            element.click();
            element.remove();
            $(e)[0].children[0].children[0].textContent = `✔`;
            // document.body.appendChild(element);
            // document.body.removeChild(element);
        } else {
            alert("file not found");
            $(e).parent().remove();
        }

    };

}