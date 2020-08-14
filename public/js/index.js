var socket = io.connect();
var id = undefined;

socket.emit("get")

socket.on('id', data => {
    if (id == undefined) {

        id = data;
    }
    console.log("my id:" + id);
})

socket.on('newMsg', data => {
    console.log(data);
    add(data.id, data.text, (data.id == id))
})




$("#send").click(() => { sendMsg() });

$("#input").keypress(function (e) {
    if (e.which == 13) {
        sendMsg();
    }
});

const sendMsg = () => {

    if ($('#input').val() != "") {
        socket.emit("sendMsg", { id, text: $('#input').val(), })
        $('#input').val('');
    }
}
var add = (head, contant, side) => {
    $("#textcontainer").append(`<div style="display:flex; flex-direction: row${side ? "-reverse" : ""};"><div class="form shadow shadow-lg rounded rounded-lg m-1 ft" ><p class="tag">${head}</p>${contant}</div></tr></div>`)
};
add.img = (data,side)=>{
    $("#textcontainer").append(`<div style="display:flex; flex-direction: row${side ? "-reverse" : ""};"><div class="form shadow shadow-lg rounded rounded-lg m-1 ft" style="z-index:10;"><p class="tag">${data.id}</p><a href="#" class="link" value="${data.data}"><img src="/images/file.svg">${data.name}</a></div></tr></div>`)
}                                                                                                                                                                                                                     



// let dropArea = document.getElementById('fileElem')

//   dropArea.addEventListener('dragenter',   readFile(dropArea), false)
//   dropArea.addEventListener('dragleave',   readFile(dropArea), false)
//   dropArea.addEventListener('dragover',   readFile(dropArea), false)
//   dropArea.addEventListener('drop',   readFile(dropArea), false)


// function readFile(input) {
//     let file = input.files[0];

//     let reader = new FileReader();

//     reader.readAsText(file);

//     reader.onload = function () {
//         console.log(reader.result);
//     };

//     reader.onerror = function () {
//         alert("Can't send file");
//     };

// }
$(".link").click((e)=>{
    console.log(e);
})
const drop = {
    ondrop: (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            for (var i = 0; i < e.dataTransfer.items.length; i++) {
                var file = e.dataTransfer.files[0],
                    reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (event) {
                    // console.log(event.target);
                    let name = file.name,
                    data = event.target.result
                    // add(id,`<img src="/images/file.svg"> ${file.name}`,true);
                    add.img({id,name,data},true);
                    
                    // download({ name, data });
                }
            }
        }
    },

    ondragover: () => {
        event.preventDefault();
    }
}


function download(data) {
    var element = document.createElement('a');
    element.setAttribute('href', data.data);
    element.setAttribute('download', data.name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}