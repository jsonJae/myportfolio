// Small HTTP helpers shared by the API endpoints, both as Vercel functions
// (api/*.js) and as Vite dev middleware (vite.config.js).

export const json = (status, data, headers = {}) => ({ status, data, headers });

/** Writes a { status, data, headers } result as a JSON response. */
export function sendJson(result, res) {
  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json');
  for (const [k, v] of Object.entries(result.headers || {})) res.setHeader(k, v);
  res.end(JSON.stringify(result.data));
}

/** Best-effort client id from proxy headers or the socket. */
export function clientIdFrom(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' && fwd.split(',')[0].trim()) || req.headers['x-real-ip'] || req.socket?.remoteAddress;
}

/** Reads a JSON body from a raw Node request (dev server only; Vercel parses it for us). */
export async function readJsonBody(req, limit = 32_000) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > limit) throw new Error('Request too large');
  }
  return JSON.parse(raw || '{}');
}
