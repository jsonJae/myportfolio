// In-memory rate limiters for the API endpoints. createRateLimiter() builds
// one from a set of rules; the chat endpoint's rules live here, and the
// contact form's live in contactHandler.js.
//
// Chat uses per-minute limits only: no daily caps, and no limit on how long a
// conversation can be. Two layers:
//   - per visitor (by IP): 30 requests a minute, so one person or script
//     can't hammer the bot
//   - site-wide: 60 requests a minute, roughly what the main and fallback
//     Groq models can serve together on the free tier
//
// If Groq's own quota runs out anyway, the handler falls back to a second
// model and then shows a friendly "try again later" message. The free tier
// never charges.
//
// Counters live in this server process's memory. On serverless hosts each warm
// instance keeps its own counters, so treat these as a first line of defence
// rather than an exact global count. For hard guarantees across instances,
// swap the Map for a shared store such as Upstash Redis.

const MINUTE = 60_000;

const CHAT_RULES = {
  perClient: [
    { windowMs: MINUTE, max: 30, message: "You're asking faster than I can keep up. Give me a few seconds and try again." },
  ],
  global: [
    { windowMs: MINUTE, max: 60, message: "Lots of visitors are chatting right now. Try again in a few seconds." },
  ],
};

function prune(list, now, windowMs) {
  let i = 0;
  while (i < list.length && now - list[i] >= windowMs) i++;
  if (i) list.splice(0, i);
}

/**
 * Builds a limiter from { perClient: [...], global: [...] } rules, each
 * { windowMs, max, message }. Each limiter keeps its own counters.
 */
export function createRateLimiter(rules) {
  const longestClientWindow = Math.max(...rules.perClient.map((r) => r.windowMs));
  const hits = new Map(); // key -> array of timestamps (newest last)

  function check(key, layer, now) {
    const list = hits.get(key) ?? [];
    const longest = Math.max(...layer.map((r) => r.windowMs));
    prune(list, now, longest);
    for (const rule of layer) {
      const inWindow = list.filter((t) => now - t < rule.windowMs);
      if (inWindow.length >= rule.max) {
        const retryAfter = Math.max(1, Math.ceil((inWindow[0] + rule.windowMs - now) / 1000));
        return { ok: false, message: rule.message, retryAfter };
      }
    }
    return { ok: true, list };
  }

  return function checkRateLimit(clientId, now = Date.now()) {
    const clientKey = `c:${clientId}`;
    const globalResult = check('global', rules.global, now);
    if (!globalResult.ok) return globalResult;
    const clientResult = check(clientKey, rules.perClient, now);
    if (!clientResult.ok) return clientResult;

    // Both layers passed: record the hit.
    globalResult.list.push(now);
    clientResult.list.push(now);
    hits.set('global', globalResult.list);
    hits.set(clientKey, clientResult.list);

    // Keep memory bounded: drop idle visitors occasionally.
    if (hits.size > 5000) {
      for (const [key, list] of hits) {
        if (key !== 'global' && (!list.length || now - list.at(-1) > longestClientWindow)) hits.delete(key);
      }
    }
    return { ok: true };
  };
}

export const checkRateLimit = createRateLimiter(CHAT_RULES);
