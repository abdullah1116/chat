import { createSignalObject } from './helper';

export default class ChatMessage {
  id = createSignalObject<string>(undefined as any);
  text = createSignalObject<string | undefined>(undefined);
  fromId = createSignalObject<string>(undefined as any);

  constructor(id: string, fromId: string, text?: string) {
    this.id.set(id);
    this.fromId.set(fromId);
    this.text.set(text);
  }
}
