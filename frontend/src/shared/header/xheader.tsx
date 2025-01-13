import type { Component, JSXElement } from 'solid-js';

import logo from '../../assets/favicon.ico';
import './header.scss';

const XHeader: Component<{ children?: JSXElement }> = ({ children }) => {
  return (
    <>
      <header>
        <img src={logo} alt='logo' />
        <h1 class='font-gilroy-extrabold'>
          <a href='/'>rk.Chat</a>
        </h1>
        <div style={{ 'flex-grow': 1 }}></div>

        {children}
      </header>
    </>
  );
};

export default XHeader;
