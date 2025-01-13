import { file } from 'bun';
import { Hono } from 'hono';
import { socketInit } from './socket';

export const app = new Hono();

export const websocket = socketInit(app);

app.get('/', (c) => new Response(file('./dist/index.html')));
app.get('/chat/:id', (c) => new Response(file('./dist/index.html')));
app.get('/favicon.ico', (c) => new Response(file('./dist/favicon.ico')));

app.get('/new', (c) => {
  const url = new URL(c.req.url);

  let rand = '';
  while (rand.length < 50) {
    rand += Math.random().toString(36).substring(7);
  }

  url.pathname = `/chat/${rand}`;

  return c.redirect(url);
});

app.get('/assets/*', async (c) => {
  const url = new URL(c.req.url);

  let path = url.pathname;

  let _file = file(`./dist/${path}`);
  if (!(await _file.exists())) {
    _file = file(`./dist/${path}/index.html`);

    if (!(await _file.exists())) {
      return new Response('Not Found', { status: 404 });
    }
  }

  return new Response(_file);
});

export default { fetch: app.fetch, websocket, port: 8030 };
