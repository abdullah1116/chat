import { lazy } from 'solid-js';
/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import './index.scss';

const root = document.getElementById('root');
const routes = [
  {
    path: '/',
    component: lazy(() => import('./routes/landing/xlanding')),
  },
  {
    path: '/chat/:chatName',
    component: lazy(() => import('./routes/chat/xchat')),
  },
];

render(() => <Router>{routes}</Router>, root!);
