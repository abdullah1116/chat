import { Chat } from './chat';
import { Socket } from './socket';
import { User } from './user';

export default class App {
  user = new User();
  socket = new Socket();
  chat = new Chat();

  constructor() {
    this.user.init();
    this.socket.init();
    this.chat.init();
  }

  async init() {}
}

export const app = new App();
