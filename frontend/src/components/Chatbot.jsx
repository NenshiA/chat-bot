import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import { sendChatMessage, clearChatSession } from '../services/chatService';
import './Chatbot.css';

function getOrCreateSessionId() {
  let id = window.sessionStorage.getItem('chat_session_id');
  if (!id) {
    id = 'session-' + Math.random().toString(36).slice(2) + Date.now();
    window.sessionStorage.setItem('chat_session_id', id);
  }
  return id;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const sessionIdRef = useRef(getOrCreateSessionId());
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const data = await sendChatMessage(sessionIdRef.current, trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClear() {
    await clearChatSession(sessionIdRef.current);
    setMessages([{ role: 'assistant', content: 'Hi! How can I help you today?' }]);
  }

  return (
    <div className="chatbot">
      {isOpen && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <span>Assistant</span>
            <div>
              <button className="chatbot__icon-btn" onClick={handleClear} title="Clear chat">
                🗑
              </button>
              <button className="chatbot__icon-btn" onClick={() => setIsOpen(false)} title="Close">
                ✕
              </button>
            </div>
          </div>

          <div className="chatbot__messages" ref={scrollRef}>
            {messages.map((m, idx) => (
              <ChatMessage key={idx} role={m.role} content={m.content} />
            ))}
            {isLoading && (
              <ChatMessage role="assistant" content="Typing..." />
            )}
            {error && <div className="chatbot__error">{error}</div>}
          </div>

          <form className="chatbot__input-area" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button className="chatbot__toggle" onClick={() => setIsOpen((v) => !v)}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}

export default Chatbot;
