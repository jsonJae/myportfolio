// In-memory rate limiter for the chat endpoint. Per-minute limits only: no
// daily caps, and no limit on how long a conversation can be.
//
// Two layers:
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

const RULES = {
  perClient: [
    { windowMs: MINUTE, max: 30, message: "You're asking faster than I can keep up. Give me a few seconds and try again." },
  ],
  global: [
    { windowMs: MINUTE, max: 60, message: "Lots of visitors are chatting right now. Try again in a few seconds." },
  ],
};

const hits = new Map(); // key -> array of timestamps (newest last)

function prune(list, now, windowMs) {
  let i = 0;
  while (i < list.length && now - list[i] >= windowMs) i++;
  if (i) list.splice(0, i);
}

function check(key, rules, now) {
  const list = hits.get(key) ?? [];
  const longest = Math.max(...rules.map((r) => r.windowMs));
  prune(list, now, longest);
  for (const rule of rules) {
    const inWindow = list.filter((t) => now - t < rule.windowMs);
    if (inWindow.length >= rule.max) {
      const retryAfter = Math.max(1, Math.ceil((inWindow[0] + rule.windowMs - now) / 1000));
      return { ok: false, message: rule.message, retryAfter };
    }
  }
  return { ok: true, list };
}

export function checkRateLimit(clientId, now = Date.now()) {
  const clientKey = `c:${clientId}`;
  const globalResult = check('global', RULES.global, now);
  if (!globalResult.ok) return globalResult;
  const clientResult = check(clientKey, RULES.perClient, now);
  if (!clientResult.ok) return clientResult;

  // Both layers passed: record the hit.
  globalResult.list.push(now);
  clientResult.list.push(now);
  hits.set('global', globalResult.list);
  hits.set(clientKey, clientResult.list);

  // Keep memory bounded: drop idle visitors occasionally.
  if (hits.size > 5000) {
    for (const [key, list] of hits) {
      if (key !== 'global' && (!list.length || now - list.at(-1) > MINUTE)) hits.delete(key);
    }
  }
  return { ok: true };
}
