const express = require('express');
const router = express.Router();
const {
  sendMessage,
  clearSession,
  getSessionHistory
} = require('../controllers/chatController');

// POST /api/chat -> send a message, get a reply
router.post('/', sendMessage);

// GET /api/chat/:sessionId -> fetch history
router.get('/:sessionId', getSessionHistory);

// DELETE /api/chat/:sessionId -> clear a conversation
router.delete('/:sessionId', clearSession);

module.exports = router;
