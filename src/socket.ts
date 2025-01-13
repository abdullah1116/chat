import { ServerWebSocket } from 'bun';
import { Hono } from 'hono';
import { createBunWebSocket } from 'hono/bun';
import { WSContext } from 'hono/ws';
import {
  ISocketCInit,
  ISocketCSendMessage,
  ISocketSInit,
  ISocketSNewMessage,
} from '../shared/interfaces/socket';
import { faker } from '@faker-js/faker';

interface IWsData {
  chatName: string | undefined;
  id: string | undefined;
}

export function socketInit(app: Hono) {
  const wssm = new Map<string, Set<WSContext<ServerWebSocket<IWsData>>>>();
  const { upgradeWebSocket, websocket } =
    createBunWebSocket<ServerWebSocket<IWsData>>();

  app.get(
    '/ws',
    upgradeWebSocket(() => ({
      onMessage: async (event, ws) => {
        try {
          const { type, data } = JSON.parse(event.data as string);

          switch (type) {
            case 'init':
              let _data = data as ISocketCInit['data'];

              const id =
                ws?.raw?.data.id! || data.id || faker.internet.username();

              if (ws.raw?.data.chatName) {
                const wss = wssm.get(ws.raw?.data.chatName! || _data.chatName);
                if (wss) {
                  wss.delete(ws);
                  if (wss.size === 0) {
                    wssm.delete(ws.raw!.data.chatName!);
                  }
                }
              }

              if (data.chatName) {
                if (!wssm.has(data.chatName)) {
                  wssm.set(data.chatName, new Set());
                }

                wssm.get(data.chatName)!.add(ws);
              }

              ws.raw!.data = {
                ...(ws.raw?.data || {}),
                chatName: data.chatName,
                id: id,
              };

              ws.send(
                JSON.stringify(<ISocketSInit>{
                  type: 'init',
                  data: { id },
                })
              );

              break;

            case 'send_message':
              {
                let _data = data as ISocketCSendMessage['data'];

                if (ws.raw?.data.chatName && wssm.has(ws.raw?.data.chatName)) {
                  // @ts-ignore
                  for (let _ws of wssm.get(ws.raw?.data.chatName)!) {
                    _ws.send(
                      JSON.stringify(<ISocketSNewMessage>{
                        type: 'new_message',
                        data: {
                          messageId: _data.messageId || new Date().getTime(),
                          fromId: ws.raw?.data?.id || 'hacker',
                          text: _data.text,
                        },
                      })
                    );
                  }
                }
              }

              break;
          }
        } catch (error) {
          console.error('error:', error);
        }
      },

      onClose: (_, ws) => {
        console.log('Disconnected');

        if (ws?.raw?.data?.chatName) {
          const wss = wssm.get(ws.raw?.data.chatName);
          if (wss) {
            wss.delete(ws);
            if (wss.size === 0) {
              wssm.delete(ws.raw?.data.chatName);
            }
          }
        }
      },
    }))
  );

  return websocket;
}
