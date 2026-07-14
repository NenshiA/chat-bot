# React + Node.js Chatbot

A full-stack chatbot: React frontend (chat widget) + Node.js/Express backend API,
powered by the Claude API (Anthropic).

## Folder Structure

```
chatbot-app/
├── backend/
│   ├── config/
│   │   └── config.js          # env config loader
│   ├── controllers/
│   │   └── chatController.js  # chat logic, calls Claude API, session memory
│   ├── routes/
│   │   └── chat.js            # /api/chat routes
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example           # rename to .env and add your API key
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Chatbot.jsx       # main chat widget (floating bubble + window)
    │   │   ├── Chatbot.css
    │   │   └── ChatMessage.jsx   # single message bubble
    │   ├── services/
    │   │   └── chatService.js    # axios calls to backend API
    │   ├── App.jsx
    │   └── index.js
    ├── package.json
    └── .env.example              # rename to .env
```

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your **free** Groq API key (get one at https://console.groq.com/keys —
no credit card needed, just sign up and click "Create API Key"):

```
GROQ_API_KEY=gsk_xxxxxxxx
GROQ_MODEL=llama-3.3-70b-versatile
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

> Why Groq instead of the Claude/Anthropic API? Anthropic's API has no free tier —
> it's pay-as-you-go from the first request. Groq gives a genuinely free tier
> (rate-limited, no card required) and uses an OpenAI-compatible format, which is
> what this backend is built for. If you'd rather use Claude, add billing to your
> Anthropic account and swap the controller back — just ask and I can generate that
> version too.

Run it:

```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```

Backend runs at `https://chat-bot-cbwi.onrender.com`.

### API Endpoints

| Method | Endpoint              | Description                        |
|--------|------------------------|-------------------------------------|
| GET    | `/api/health`          | Health check                       |
| POST   | `/api/chat`             | Send a message, body: `{ sessionId, message }` |
| GET    | `/api/chat/:sessionId`  | Get conversation history           |
| DELETE | `/api/chat/:sessionId`  | Clear conversation history         |

Example request:

```bash
curl -X POST https://chat-bot-cbwi.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"abc123","message":"Hello!"}'
```

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs at `http://localhost:5173`. You'll see a chat bubble in the
bottom-right corner — click it to open the chat window.

## Notes

- Conversation history is stored **in-memory** on the backend (per `sessionId`,
  kept in a JS `Map`). This resets when the server restarts. Swap in Redis,
  MongoDB, or Postgres for production/persistence.
- A simple rate limiter (30 requests/minute/IP) is included in `server.js`.
- Never expose your `GROQ_API_KEY` in frontend code — it must stay in the
  backend `.env` only.
- To deploy: host the backend (Render, Railway, EC2, etc.), host the frontend
  build (Vercel, Netlify, S3), and set `CLIENT_ORIGIN` / `REACT_APP_API_URL`
  to the real URLs.
