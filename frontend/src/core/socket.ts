import { app } from '../core/app';
import { createSignalObject, creator, promiseLock, sleep } from './helper';

import type {
  ISocketCInit,
  ISocketCSendMessage,
  ISocketSInit,
  ISocketSNewMessage,
} from '../../../shared/interfaces/socket';

export const creatorSocket = creator(async () => {
  let ins = new (await import('./socket')).Socket();
  await ins.init();
  return ins;
});

export class Socket {
  socket?: WebSocket;

  socketLock = promiseLock<void>();
  chatNameLock = promiseLock<string>();

  constructor() {}

  async init() {
    if (!this.socket) {
      this.createSocket();
    }
  }

  createSocket() {
    this.socketLock.refreshResolved();

    const url = new URL(import.meta.env['VITE_SERVER'] || location.href);
    this.socket = new WebSocket(
      `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.host}/ws`
    );

    this.socket.onopen = (...v) => this.onOpen(...v);
    this.socket.onmessage = (...v) => this.onMessage(...v);
    this.socket.onclose = (...v) => this.onClose(...v);
  }

  onOpen(ev: Event) {
    this.chatNameLock.refreshResolved();
    this.socketLock.resolve();
    this.chatNameLock.promise.then((string) => {
      this.chatInit(string);
    });
  }

  onClose(ev: CloseEvent) {
    this.socket!.close();

    sleep(5 * 1000);

    this.createSocket();
  }

  setChatName(chatName: string) {
    this.socketLock.promise.then(() => {
      this.chatNameLock.refreshResolved();
      this.chatNameLock.resolve(chatName);

      this.chatInit(chatName);
    });
  }

  //
  //

  chatInit(chatName: string) {
    this.socket!.send(
      JSON.stringify(<ISocketCInit>{
        type: 'init',
        data: {
          chatName: chatName,
          id: app.user.id.value(),
        },
      })
    );
  }

  sendMessage(id: string, text: string) {
    if (!text) return;

    this.socket!.send(
      JSON.stringify(<ISocketCSendMessage>{
        type: 'send_message',
        data: { messageId: id, text },
      })
    );
  }

  //
  //

  onMessage(ev: any) {
    const { type, data } = JSON.parse(ev.data);

    switch (type) {
      case 'init':
        {
          let _data = data as ISocketSInit['data'];
          console.log('🚀 ~ Socket ~ onMessage ~ _data.id:', _data.id);

          if (_data.id) {
            app.user.setId(_data.id);
          }
        }
        break;

      case 'new_message':
        {
          let _data = data as ISocketSNewMessage['data'];
          app.chat.addMessage(_data.messageId, _data.fromId, _data.text);
        }
        break;
    }
  }

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
  // };send_message

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
}
