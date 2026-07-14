const axios = require('axios');
const config = require('../config/config');

/**
 * In-memory store of conversations, keyed by sessionId.
 * For production, swap this for a database (Redis, Mongo, Postgres, etc).
 */
const conversations = new Map();

const MAX_HISTORY_MESSAGES = 20; // trim history to keep requests small
const SYSTEM_PROMPT =
  'You are a friendly, concise, and helpful assistant embedded in a website chat widget.';

function getHistory(sessionId) {
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, []);
  }
  return conversations.get(sessionId);
}

function trimHistory(history) {
  if (history.length > MAX_HISTORY_MESSAGES) {
    return history.slice(history.length - MAX_HISTORY_MESSAGES);
  }
  return history;
}

/**
 * POST /api/chat
 * body: { sessionId: string, message: string }
 */
async function sendMessage(req, res) {
  try {
    const { sessionId, message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Field "message" is required.' });
    }

    if (!config.groqApiKey) {
      return res.status(500).json({
        error:
          'Server is missing GROQ_API_KEY. Add it to backend/.env (get a free key at https://console.groq.com/keys)'
      });
    }

    const sid = sessionId || 'default';
    const history = getHistory(sid);

    history.push({ role: 'user', content: message });

    // Groq uses the OpenAI-compatible chat completions format
    const response = await axios.post(
      config.groqApiUrl,
      {
        model: config.groqModel,
        max_tokens: 1024,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.groqApiKey}`
        }
      }
    );

    const replyText = response.data.choices?.[0]?.message?.content?.trim() || '';

    history.push({ role: 'assistant', content: replyText });
    conversations.set(sid, trimHistory(history));

    return res.json({
      sessionId: sid,
      reply: replyText,
      usage: response.data.usage || null
    });
  } catch (err) {
    console.error('Chat controller error:', err.response?.data || err.message);
    return res.status(500).json({
      error: 'Something went wrong while contacting the chatbot service.',
      details: err.response?.data?.error?.message || err.message
    });
  }
}

/**
 * DELETE /api/chat/:sessionId
 * Clears conversation history for a session.
 */
function clearSession(req, res) {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  return res.json({ message: `Session ${sessionId} cleared.` });
}

/**
 * GET /api/chat/:sessionId
 * Returns conversation history for a session.
 */
function getSessionHistory(req, res) {
  const { sessionId } = req.params;
  return res.json({ sessionId, history: getHistory(sessionId) });
}

module.exports = {
  sendMessage,
  clearSession,
  getSessionHistory
};
