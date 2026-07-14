import React from 'react';

function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`}>
      <div className="chat-message__bubble">{content}</div>
    </div>
  );
}

export default ChatMessage;
