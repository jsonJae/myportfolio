// Contact form logic. Runs only on the server (Vite dev middleware or the
// /api/contact serverless function), so RESEND_API_KEY never reaches the browser.
import { Resend } from 'resend';
import { CONTACT_EMAIL } from '../src/utils/sendMessage.js';
import { json } from './http.js';
import { createRateLimiter } from './rateLimit.js';

// Resend's shared test sender. It can only deliver to the address the Resend
// account was created with. After verifying a domain in Resend, set
// CONTACT_FROM (e.g. "Portfolio <hello@yourdomain.com>") in the host's env.
const DEFAULT_FROM = 'Portfolio contact <onboarding@resend.dev>';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, subject: 200, text: 5000 };

const MINUTE = 60_000;

// Generous for a real person, tight enough that a script can't burn through
// Resend's free tier (100 emails a day).
const checkRateLimit = createRateLimiter({
  perClient: [
    { windowMs: 10 * MINUTE, max: 3, message: 'You’ve sent a few messages already. Give it a few minutes before sending another.' },
  ],
  global: [
    { windowMs: 60 * MINUTE, max: 30, message: 'Lots of messages are coming in right now. Try again in a little while.' },
  ],
});

// Header values stay on one line.
const oneLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();

/**
 * Validates, rate limits and sends a contact form message.
 * Returns { status, data, headers } for sendJson().
 */
export async function handleContact(body, { apiKey, from, clientId }) {
  if (!apiKey) return json(500, { error: 'The contact form is not configured yet.' });

  // Honeypot: real visitors never see this field, bots tend to fill it. Pretend
  // it worked so they don't retry.
  if (body?.website) return json(200, { ok: true });

  const name = oneLine(body?.name);
  const email = oneLine(body?.email);
  const subject = oneLine(body?.subject);
  const text = String(body?.text ?? '').trim();

  if (!name || name.length > LIMITS.name) return json(400, { error: 'Add your name.' });
  if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) {
    return json(400, { error: 'That email address doesn’t look right.' });
  }
  if (subject.length > LIMITS.subject) return json(400, { error: 'That subject is a little long.' });
  if (!text) return json(400, { error: 'Write a message before sending.' });
  if (text.length > LIMITS.text) {
    return json(400, { error: `Keep the message under ${LIMITS.text.toLocaleString('en-US')} characters.` });
  }

  const limit = checkRateLimit(clientId || 'unknown');
  if (!limit.ok) {
    return json(429, { error: limit.message, retryAfter: limit.retryAfter }, { 'Retry-After': String(limit.retryAfter) });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: from || DEFAULT_FROM,
    to: CONTACT_EMAIL,
    replyTo: email,
    subject: `[Portfolio] ${subject || `Message from ${name}`}`,
    // Plain text only: the visitor's HTML never reaches the inbox.
    text: `${text}\n\n— ${name}\n${email}\n\nSent from the contact form on your portfolio. Reply to answer them directly.`,
  });

  if (error) {
    console.error('Resend error', error);
    return json(502, { error: 'Couldn’t send that right now.' });
  }
  return json(200, { ok: true });
}
