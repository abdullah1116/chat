var socket = new WebSocket(
  `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`
);
var id = undefined;

socket.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);

  console.log('🚀 ~ event:', type, data);

  switch (type) {
    case 'init':
      id = data.id;
      $('#id')[0].textContent = data.id;

      break;
    case 'new_message':
      socketOnText(data);
  }
};

socket.onopen = () => {
  socket.send(
    JSON.stringify({
      type: 'init',
      data: { chatName: location.href.split('/')[4] },
    })
  );
};

function socketOnText(data) {
  $('#textcontainer').prepend(
    `<div style="display:flex; flex-direction: row${
      data.id == id ? '-reverse' : ''
    };">
                <div class="form shadow shadow-lg rounded rounded-lg m-1 ft" style=" z-index: 10;" >
                    <p class="tag">${data.id}</p>${escapeHtml(data.text)}
                </div>
            </div>`
  );
}

// function socketOnFile(data) {
//   $('#textcontainer').append(
//     `<div style="display:flex; flex-direction: row${
//       data.id == id ? '-reverse' : ''
//     };">
//                 <div class="form shadow shadow-lg rounded rounded-lg m-1 ft link" data="${
//                   data.data
//                 }" name="${data.name}" onClick="filehandler(this)">
//                     <p class="tag">${data.id} <a class="tag"></a></p>
//                     <img src="/images/file.svg">${data.name}
//                 </div>
//             </div>`
//   );
// }

$('#send').click(() => {
  send_message($('#input').val());
  $('#input').val('');
});

$('#input').keypress(function (e) {
  if (e.which !== 13) return;

  send_message($('#input').val());
  $('#input').val('');
});

// const drop = {
//   ondrop: (e) => {
//     e.preventDefault();
//     const files = e?.dataTransfer?.files;
//     if (!files) return;

//     files.forEach(send_file);
//   },

//   onclick: (e) => {
//     if (!e.files) return;

//     e.files.forEach(send_file);
//   },

//   ondragover: () => {
//     event.preventDefault();
//   },
// };

function send_message(text) {
  if (!text) return;

  socket.send(
    JSON.stringify({
      type: 'send_message',
      data: { text },
    })
  );
}

// function send_file(file) {
//   const reader = new FileReader();
//   reader.readAsArrayBuffer(file);

//   reader.onload = () => {
//     socket.send(
//       JSON.stringify({
//         type: 'send_file',
//         name: file.name,
//         data: reader.result,
//       })
//     );
//   };
// }

// const filehandler = (e) => {
//   var target = '/file?' + $(e).attr('data');
//   var xhr = new XMLHttpRequest();
//   xhr.overrideMimeType('application/octet-stream');
//   xhr.open('GET', target, true);
//   xhr.responseType = 'text';
//   xhr.send();
//   xhr.onprogress = function (e2) {
//     var value = e2.loaded + '';
//     var prog = value[0] + value[1];
//     $(e)[0].children[0].children[0].textContent = ` ${prog}%`;
//     console.log(prog);
//   };
//   xhr.onload = function () {
//     if (xhr.response != 'Cannot GET') {
//       var element = document.createElement('a');
//       element.setAttribute('href', xhr.response);
//       element.setAttribute('download', $(e).attr('name'));
//       element.style.display = 'none';
//       element.click();
//       element.remove();
//       $(e)[0].children[0].children[0].textContent = `✔`;
//     } else {
//       alert('file not found');
//       $(e).parent().remove();
//     }
//   };
// };

function escapeHtml(html) {
  var text = document.createTextNode(html);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}
