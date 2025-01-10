import { faker } from '@faker-js/faker';
import { ServerWebSocket } from 'bun';
import { createBunWebSocket } from 'hono/bun';
import { WSContext } from 'hono/ws';

interface IWsData {
  chatName: string | undefined;
  id: string | undefined;
}

export function socketInit(app) {
  const wssm = new Map<string, Set<WSContext<ServerWebSocket<IWsData>>>>();
  const { upgradeWebSocket, websocket } =
    createBunWebSocket<ServerWebSocket<IWsData>>();

  app.get(
    '/ws',
    upgradeWebSocket((c) => ({
      onMessage: async (event, ws) => {
        try {
          const { type, data } = JSON.parse(event.data as string);

          switch (type) {
            case 'init':
              console.log('🚀 ~ message ~ type, data:', data);

              const id = ws?.raw?.data.id! || faker.internet.username();

              if (ws.raw?.data.chatName) {
                const wss = wssm.get(ws.raw?.data.chatName!);
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
                id,
              };

              ws.send(
                JSON.stringify({
                  type: 'init',
                  data: { id },
                })
              );

              break;

            case 'send_message':
              if (ws.raw?.data.chatName && wssm.has(ws.raw?.data.chatName)) {
                for (let _ws of wssm.get(ws.raw?.data.chatName)!) {
                  _ws.send(
                    JSON.stringify({
                      type: 'new_message',
                      data: {
                        text: data.text,
                        id: ws.raw?.data?.id || 'hacker',
                      },
                    })
                  );
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
