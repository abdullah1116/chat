// interface ISocket<T> {
//   type: 'new_message' | '';
//   data: T;
// }

export interface ISocketSInit {
  type: 'init';
  data: {
    id?: string;
  };
}

export interface ISocketSNewMessage {
  type: 'new_message';
  data: {
    messageId: string;
    fromId: string;
    text: string;
  };
}

export interface ISocketCInit {
  type: 'init';
  data: {
    chatName: string;
    id?: string;
  };
}

export interface ISocketCSendMessage {
  type: 'send_message';
  data: {
    messageId: string;
    text: string;
  };
}
