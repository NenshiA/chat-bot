const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const chatRoutes = require('./routes/chat');

const app = express();

// --- Middleware ---
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

// Basic rate limiting to protect the API from abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: { error: 'Too many requests, please slow down.' }
});
app.use('/api/', limiter);

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Chatbot API is running.' });
});

app.use('/api/chat', chatRoutes);

const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Chatbot API server running on http://0.0.0.0:${config.port}`);
});
