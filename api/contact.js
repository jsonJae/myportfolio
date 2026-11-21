/* global process */
// Serverless endpoint (Vercel-style). Set RESEND_API_KEY in the host's env settings.
import { handleContact } from '../server/contactHandler.js';
import { clientIdFrom, sendJson } from '../server/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const result = await handleContact(req.body, {
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.CONTACT_FROM,
      clientId: clientIdFrom(req),
    });
    sendJson(result, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ error: 'Something went wrong.' });
  }
}
