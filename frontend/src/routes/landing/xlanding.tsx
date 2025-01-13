import type { Component } from 'solid-js';

import XHeader from '../../shared/header/xheader';
import './landing.scss';

const XLanding: Component = () => {
  function createChat() {
    let id = Math.random().toString(36);
    id += Math.random().toString(36);
    id += Math.random().toString(36);
    id += Math.random().toString(36);

    location.pathname = `chat/${id}`;
  }

  return (
    <>
      <XHeader></XHeader>
      <div class='container'>
        <h1 class='font-gilroy-extrabold'>
          Welcome to #
          <a class='a-clean' href='https://rottenkernel.win'>
            rk
          </a>
          .Chat
        </h1>
        <p class='info'>
          1. Create a new chat
          <br />
          2. Share the link with friends
        </p>

        <p class='action'>
          <button onclick={createChat}>Create Chat</button>
        </p>

        <div class='footer-decoy'></div>
        <div class='footer'>
          <p>
            This app is free to use and designed to be privacy first in mind
            <br />
            <small>Its still in development</small>
          </p>
        </div>
      </div>
    </>
  );
};

export default XLanding;
