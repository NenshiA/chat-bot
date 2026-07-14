import React from 'react';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>My Website</h1>
      <p>Click the chat bubble in the corner to talk to the assistant.</p>
      <Chatbot />
    </div>
  );
}

export default App;
