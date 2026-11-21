// Shared Groq chat logic. Runs only on the server (Vite dev middleware or the
// /api/chat serverless function), so GROQ_API_KEY never reaches the browser.
import { SYSTEM_PROMPT } from './knowledge.js';
import { checkRateLimit } from './rateLimit.js';
import { json, sendJson } from './http.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';
// Separate free-tier quota; used when the main model hits Groq's rate limit.
const FALLBACK_MODEL = 'openai/gpt-oss-20b';
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

/**
 * Validates and rate limits a chat request, then streams Groq's reply.
 * Returns { status, data, headers } for errors, or { stream } (an async
 * iterable of text chunks) on success.
 */
export async function handleChat(body, apiKey, clientId) {
  if (!apiKey) return json(500, { error: 'Chat is not configured yet.' });

  const limit = checkRateLimit(clientId || 'unknown');
  if (!limit.ok) {
    return json(
      429,
      { error: limit.message, retryAfter: limit.retryAfter },
      { 'Retry-After': String(limit.retryAfter) },
    );
  }

  const messages = Array.isArray(body?.messages) ? body.messages : null;
  if (!messages?.length) return json(400, { error: 'No message sent.' });

  const clean = messages
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (clean.at(-1)?.role !== 'user') return json(400, { error: 'No message sent.' });

  const callGroq = (model) =>
    fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...clean],
        temperature: 0.5,
        max_tokens: 700,
        reasoning_effort: 'low',
        stream: true,
      }),
    });

  let res = await callGroq(MODEL);
  if (res.status === 429) {
    await res.body?.cancel().catch(() => {});
    res = await callGroq(FALLBACK_MODEL);
  }

  if (res.status === 429) {
    // Groq's own free-tier ceiling was hit; tell the visitor to come back later.
    return json(429, { error: 'The assistant is resting for a bit. Please try again later.', retryAfter: 60 });
  }
  if (!res.ok || !res.body) {
    console.error('Groq error', res.status, await res.text().catch(() => ''));
    return json(502, { error: 'The assistant is unavailable right now.' });
  }

  return { stream: textChunks(res.body) };
}

// Turns Groq's server-sent events into plain text chunks (answer tokens only;
// the model's hidden reasoning tokens are dropped).
async function* textChunks(body) {
  const decoder = new TextDecoder();
  let buffer = '';
  for await (const bytes of body) {
    buffer += decoder.decode(bytes, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const payload = line.startsWith('data:') ? line.slice(5).trim() : '';
      if (!payload || payload === '[DONE]') continue;
      try {
        const text = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (text) yield text;
      } catch {
        // Ignore keep-alives or partial frames.
      }
    }
  }
}

/** Writes a handleChat result to a Node response (Vite dev server or Vercel). */
export async function sendChatResult(result, res) {
  if (!result.stream) return sendJson(result, res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  try {
    for await (const chunk of result.stream) res.write(chunk);
  } catch (err) {
    console.error('Stream interrupted', err);
  }
  res.end();
}
