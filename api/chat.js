/* global process */
// Serverless endpoint (Vercel-style). Set GROQ_API_KEY in the host's env settings.
import { handleChat, sendChatResult } from '../server/chatHandler.js';
import { clientIdFrom } from '../server/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const result = await handleChat(req.body, process.env.GROQ_API_KEY, clientIdFrom(req));
    await sendChatResult(result, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: 'Something went wrong.' });
    else res.end();
  }
}
