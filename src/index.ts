import { file } from 'bun';
import { Hono } from 'hono';
import './socket';

const app = new Hono();

app.get('/', (c) => new Response(file('./public/index.html')));
app.get('/favicon.ico', (c) => new Response(file('./public/favicon.ico')));
app.get('/chat/:id', (c) => new Response(file('./public/chat/index.html')));

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

  let path = url.pathname.slice('/assets'.length);

  let _file = file(`./public/${path}`);
  if (!(await _file.exists())) {
    _file = file(`./public/${path}/index.html`);

    if (!(await _file.exists())) {
      return new Response('Not Found', { status: 404 });
    }
  }

  return new Response(_file);
});

export default app;
