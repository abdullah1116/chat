import { For, onMount, type Component } from 'solid-js';

import XHeader from '../../shared/header/xheader';
import { useParams } from '@solidjs/router';
import './chat.scss';
import { app } from '../../core/app';

const XChat: Component = () => {
  let chat: HTMLDivElement;
  let textarea: HTMLTextAreaElement;

  function share() {
    if (navigator.canShare && navigator.canShare({ url: location.href })) {
      navigator.share({ url: location.href });
    } else {
      try {
        navigator.clipboard.writeText(location.href);
      } catch (e) {}
    }
  }
  function sendMessage() {
    app.chat.sendMessage(textarea!.value);
    textarea!.value = '';
  }

  function textareaKeyPress(event: KeyboardEvent) {
    if (event.code === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      sendMessage();
      event.preventDefault();

      return false;
    }
  }

  app.chat.listeners.new_message.chat = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollHeight - scrollPosition < 200) {
      window.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  onMount(() => {
    const { chatName } = useParams();

    app.socket.setChatName(chatName);
  });

  return (
    <>
      <XHeader>
        <h1 class='title font-gilroy-extrabold' onClick={share}>
          <a href='#'>Share</a>
        </h1>
      </XHeader>

      <div class='chat' ref={chat!}>
        <div class='messages'>
          {app.chat.messages.value.length > 0 && (
            <For each={app.chat!.messages.value}>
              {(message) => (
                <div
                  class='msg'
                  classList={{
                    'msg-send': message.fromId.value() === app.user.id.value(),
                  }}
                >
                  <div class='msg-from'>{message.fromId.value()}</div>
                  <div class='msg-text'>{message.text.value()}</div>
                </div>
              )}
            </For>
          )}
        </div>
      </div>

      <div class='footer-decoy'></div>
      <div class='footer footer-chat'>
        <textarea
          class='text-input'
          ref={textarea!}
          onKeyPress={textareaKeyPress}
        ></textarea>
        <button onclick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default XChat;
