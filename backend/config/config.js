require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  // Groq: free tier, no credit card required. Get a key at https://console.groq.com/keys
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions'
};
