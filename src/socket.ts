import { faker } from '@faker-js/faker';
import { serve, ServerWebSocket } from 'bun';

interface IWsData {
  chatName: string | undefined;
  id: string | undefined;
}

const wssm = new Map<string, Set<ServerWebSocket<IWsData>>>();

const server = serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    message(ws: ServerWebSocket<IWsData>, message) {
      console.log('message:');

      //   try {
      const { type, data } = JSON.parse(message as string);

      switch (type) {
        case 'init':
          console.log('🚀 ~ message ~ type, data:', data);

          const id = ws.data?.id || faker.internet.username();

          if (ws.data?.chatName) {
            const wss = wssm.get(ws.data.chatName);
            if (wss) {
              wss.delete(ws);
              if (wss.size === 0) {
                wssm.delete(ws.data.chatName);
              }
            }
          }

          if (data.chatName) {
            if (!wssm.has(data.chatName)) {
              wssm.set(data.chatName, new Set());
            }

            wssm.get(data.chatName)!.add(ws);
          }

          ws.data = { ...(ws.data || {}), chatName: data.chatName, id };

          ws.send(
            JSON.stringify({
              type: 'init',
              data: { id },
            })
          );

          break;

        case 'send_message':
          if (ws.data.chatName && wssm.has(ws.data.chatName)) {
            for (let _ws of wssm.get(ws.data.chatName)!) {
              _ws.send(
                JSON.stringify({
                  type: 'new_message',
                  data: { text: data.text, id: ws.data?.id || 'hacker' },
                })
              );
            }
          }

          break;
      }
      //   } catch (error) {}
    },

    open() {
      console.log('Connected');
    },

    close(ws: ServerWebSocket<IWsData>) {
      console.log('Disconnected');

      if (ws?.data?.chatName) {
        const wss = wssm.get(ws.data.chatName);
        if (wss) {
          wss.delete(ws);
          if (wss.size === 0) {
            wssm.delete(ws.data.chatName);
          }
        }
      }
    },

    drain(ws: ServerWebSocket<IWsData>) {
      console.log('Drain');
    },
  },
  port: 3001,
});

console.log(`started socket at ${server.url}`);
