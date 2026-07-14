import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export async function sendChatMessage(sessionId, message) {
  const { data } = await api.post('/chat', { sessionId, message });
  return data; // { sessionId, reply, usage }
}

export async function fetchChatHistory(sessionId) {
  const { data } = await api.get(`/chat/${sessionId}`);
  return data; // { sessionId, history }
}

export async function clearChatSession(sessionId) {
  const { data } = await api.delete(`/chat/${sessionId}`);
  return data;
}

export default api;
