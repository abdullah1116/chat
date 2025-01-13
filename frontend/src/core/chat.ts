import { app } from './app';
import ChatMessage from './chat-message';
import { createStoreObject, creator } from './helper';

export const creatorChat = creator(async () => {
  let ins = new (await import('./chat')).Chat();
  await ins.init();
  return ins;
});

export class Chat {
  listeners = {
    new_message: {} as Record<string, (arg0: ChatMessage) => void>,
  };

  messages = createStoreObject<ChatMessage[]>([]);

  constructor() {}

  async init() {}

  addMessage(id: string, fromId: string, text?: string) {
    const message = new ChatMessage(id, fromId, text);

    this.messages.set((msgs: ChatMessage[]) => {
      let exists = msgs.findIndex(
        (m) => m.fromId.value() === fromId && m.id.value() === id
      );

      if (exists != -1) {
      } else {
        msgs = [...msgs, message];
      }

      return msgs;
    });

    Object.keys(this.listeners.new_message).forEach((key) => {
      this.listeners.new_message[key](message);
    });
  }

  sendMessage(text: string) {
    const messageId = new Date().getTime().toString();

    this.addMessage(messageId, app.user.id.value(), text);

    app.socket.sendMessage(messageId, text);
  }
}
