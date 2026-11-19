import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useAnimate, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, RotateCcw, Square, X } from 'lucide-react';
import KismetFace from './KismetFace';

// The panel opens and closes as a lens: a circular mask that grows out of the
// launcher's circle and contracts back into it. Nothing is ever stretched, so
// Kismet's face keeps its shape; the launcher itself only scales uniformly.
const PRIMARY = '#0824A9';
const LENS_OPEN = { duration: 0.52, ease: [0.22, 1, 0.36, 1] };
const LENS_CLOSE = { duration: 0.36, ease: [0.65, 0, 0.35, 1] };
// Radius of the face disc inside the 64px launcher (23/48 of 64), so the lens
// lands exactly on the disc.
const LAUNCHER_R = 30.5;
const EASE_OUT = [0.22, 1, 0.36, 1];
const STORAGE_KEY = 'jgd-chat-v1';
const MAX_INPUT = 1000;

// The launcher sits on the navbar's line (same bottom offset, same 64px shell
// height as the dock). On phones the dock fills the row, so it rises above it.
const LAUNCHER_POS = 'right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]';
// The open panel shares the launcher's bottom edge, so it grows up out of the
// button. Between sm and xl a 25rem panel on that line would cover the dock,
// so there it sits just above the dock instead.
const PANEL_POS =
  'inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] h-[min(37rem,calc(100dvh-7.5rem))] ' +
  'sm:left-auto sm:right-6 sm:w-[25rem] sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:h-[min(37rem,calc(100dvh-8rem))] ' +
  'xl:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] xl:h-[min(40rem,calc(100dvh-4rem))]';

// Kismet's speech bubble sits right above the launcher, right-aligned to it.
const NUDGE_POS =
  'right-4 bottom-[calc(5.5rem+74px+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-[calc(1.25rem+74px+env(safe-area-inset-bottom))]';

const GREETING =
  "Hi, I'm Kismet. Ask me about Jason's projects, his experience, or what he's learning in AI and machine learning.";

const SUGGESTIONS = [
  'What is Jason learning right now?',
  'Tell me about SMS Guardian.',
  'What does he do outside of code?',
  'How can I reach Jason?',
];

function loadHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    // Restored messages are already "printed": skip the press animation.
    return Array.isArray(saved) ? saved.map((m) => ({ ...m, settled: true })) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages) {
  try {
    const plain = messages.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plain.slice(-20)));
  } catch {
    // Storage blocked (private mode etc.): the chat still works, it just won't persist.
  }
}

// ---------------------------------------------------------------- Pop-up dialogue
// Kismet speaks up the first time a visitor settles into a section, and on an
// idle timer otherwise. Capped and spaced out. Paused while the chat is open;
// dismissing a bubble mutes Kismet for two minutes, a second dismissal for the
// rest of the page visit. Memory is per page load, so a reload starts fresh.
const NUDGE_MAX = 6; // per page load
const NUDGE_GAP = 15_000; // minimum between bubbles
const NUDGE_FIRST = 8_000; // nothing before this, so the splash and hero breathe
const NUDGE_IDLE = 40_000;
const NUDGE_MUTE = 120_000; // after the first dismissal
const NUDGE_DWELL = 1_500; // a section must hold the viewport this long
const NUDGE_LINGER = 7_000; // bubble stays this long after it finishes typing
const TYPE_MS = 26;

const SECTION_IDS = ['home', 'about', 'experiences', 'stack', 'projects', 'beyond', 'contact'];
const SECTION_NUDGES = {
  home: { text: "Hi, I'm Kismet. Ask me anything about Jason's work." },
  about: { text: 'Want the short version of who Jason is?', ask: 'Give me a quick intro to Jason.' },
  experiences: { text: 'Ask me what Jason did at QE 360.', ask: 'What did he do at QE 360?' },
  stack: { text: 'Curious which tools Jason has worked with?', ask: 'Which tools and languages has Jason used?' },
  projects: { text: 'I can tell you the story behind SMS Guardian.', ask: 'Tell me about SMS Guardian.' },
  beyond: { text: 'Ask me what Jason gets up to outside of code.', ask: 'What does Jason do outside of code?' },
  contact: { text: 'Want his email, LinkedIn or GitHub? Just ask.', ask: 'How can I contact Jason?' },
};
const IDLE_NUDGES = [
  { text: 'Meow. I mean, hi! Got a question?' },
  { text: 'Psst. Ask me which project shows his ML work.', ask: 'Which project best shows his machine learning work?' },
  { text: "Ask me about Jason's projects. I don't bite." },
];

const nudgeMemory = { count: 0, seen: new Set(), idle: 0, mutedUntil: 0, dismissals: 0, off: false };
const nudgeMem = () => nudgeMemory;

// ---------------------------------------------------------------- Rich replies
// Kismet answers with a short sentence and, when there is more to say, a few
// "- " bullets; **name** marks a project or tool. Every word mounts as its own
// span so it runs the ink press once; keys are positional, so text that is
// still streaming updates in place without pressing again.
function parseBlocks(text) {
  const blocks = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) {
      if (blocks.length && blocks.at(-1).type !== 'gap') blocks.push({ type: 'gap' });
      continue;
    }
    const item = line.match(/^(?:[-*\u2022]|\d+[.)])\s+(.*)$/);
    const last = blocks.at(-1);
    if (item) {
      if (last?.type === 'ul') last.items.push(item[1]);
      else blocks.push({ type: 'ul', items: [item[1]] });
    } else if (last?.type === 'p') last.items.push(line);
    else blocks.push({ type: 'p', items: [line] });
  }
  return blocks.filter((b) => b.type !== 'gap');
}

const LINK_CLASS =
  '[overflow-wrap:anywhere] text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors duration-200 hover:decoration-primary';

// Long URLs and emails may wrap, but only after "/", "-" or "@", never mid-word.
function softBreaks(label) {
  return label.split(/(?<=[/@-])/).flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]));
}

// Turns a word into a link when it is a URL, an email or the resume path.
// Trailing punctuation stays outside the link.
function linkFor(word) {
  const m = word.match(/^(.*?)([.,;:!?)]*)$/);
  const core = m[1];
  const tail = m[2];
  if (/^https?:\/\/\S+$/.test(core)) {
    return { href: core, label: core.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), external: true, tail };
  }
  if (/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(core)) return { href: `mailto:${core}`, label: core, tail };
  if (core === '/DURAN-RESUME.pdf') return { href: core, label: 'DURAN-RESUME.pdf', external: true, tail };
  return null;
}

function inlineInk(text, settled, key) {
  let n = 0;
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, si) => {
    if (!part) return [];
    const bold = /^\*\*[^*]+\*\*$/.test(part);
    const clean = bold ? part.slice(2, -2) : part.replace(/\*\*/g, '');
    const words = clean.split(/(\s+)/).map((w) => {
      const k = `${key}-${si}-${n++}`;
      if (!w || /^\s+$/.test(w)) return <Fragment key={k}>{w}</Fragment>;
      const link = linkFor(w);
      if (link) {
        return (
          <span key={k} className={settled ? undefined : 'ink-word'}>
            <a
              href={link.href}
              className={LINK_CLASS}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {softBreaks(link.label)}
            </a>
            {link.tail}
          </span>
        );
      }
      return (
        <span key={k} className={settled ? undefined : 'ink-word'}>
          {w}
        </span>
      );
    });
    return bold
      ? [
          <strong key={`${key}-b${si}`} className="font-semibold text-ink">
            {words}
          </strong>,
        ]
      : words;
  });
}

function RichText({ text, settled }) {
  return parseBlocks(text).map((b, bi) =>
    b.type === 'ul' ? (
      <ul key={bi} className="mt-2 flex flex-col gap-1.5 first:mt-0">
        {b.items.map((it, ii) => (
          <li
            key={ii}
            className="relative pl-4 before:absolute before:left-[3px] before:top-[0.62em] before:size-[5px] before:rounded-full before:bg-primary/60 before:content-['']"
          >
            {inlineInk(it, settled, `${bi}-${ii}`)}
          </li>
        ))}
      </ul>
    ) : (
      <p key={bi} className="mt-2 first:mt-0">
        {b.items.map((line, li) => (
          <Fragment key={li}>
            {li > 0 && ' '}
            {inlineInk(line, settled, `${bi}-${li}`)}
          </Fragment>
        ))}
      </p>
    ),
  );
}

const BUBBLE_BASE = 'break-words font-mono text-[14px]';
const BUBBLE_KISMET = `${BUBBLE_BASE} rounded-[20px] rounded-bl-[6px] bg-surface px-4 py-3 leading-[1.6] text-ink/85`;
const BUBBLE_USER = `${BUBBLE_BASE} whitespace-pre-wrap max-w-[82%] self-end rounded-[20px] rounded-br-[6px] bg-primary px-4 py-2.5 leading-[1.55] text-white shadow-[0_8px_18px_-12px_rgba(8,36,169,0.7)] selection:bg-white/30 selection:text-white`;
const BUBBLE_ERROR = 'rounded-[20px] rounded-bl-[6px] border border-dashed border-primary/35 bg-white px-4 py-3 font-mono text-[13px] leading-[1.6] text-ink/80';

/** One of Kismet's messages: a small, still avatar at the bubble's tail corner. */
function KismetRow({ children, state = 'idle', animateIn = false, reduced }) {
  return (
    <motion.div
      initial={animateIn ? (reduced ? { opacity: 0 } : { opacity: 0, y: 8 }) : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE_OUT }}
      className="flex max-w-[94%] items-end gap-2"
    >
      <KismetFace size={26} state={state} still className="mb-0.5" />
      <div className="min-w-0">{children}</div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <span className="flex h-[22px] items-center gap-1.5" role="status">
      <span className="sr-only">Kismet is thinking</span>
      <span aria-hidden="true" className="typing-dot" />
      <span aria-hidden="true" className="typing-dot" />
      <span aria-hidden="true" className="typing-dot" />
    </span>
  );
}

export default function ChatBot() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState('closed'); // closed | open | closing
  const open = phase !== 'closed';
  const [hover, setHover] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | waiting | streaming
  const [failed, setFailed] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const phaseRef = useRef(phase);
  const abortRef = useRef(null);
  const stickToBottom = useRef(true);

  // Pop-up dialogue state
  const [nudge, setNudge] = useState(null); // { id, text, ask? }
  const [typed, setTyped] = useState(0);
  const [nudgeHover, setNudgeHover] = useState(false);
  const [lookAt, setLookAt] = useState(null);
  const [retryTick, setRetryTick] = useState(0);
  const [hopScope, animateHop] = useAnimate();
  const openRef = useRef(open);
  const nudgeRef = useRef(null);
  const sectionRef = useRef(null);
  const mountedAt = useRef(0);
  const lastNudgeAt = useRef(0);

  const busy = status !== 'idle';
  const lastText = messages.at(-1)?.content ?? '';
  const faceState = status === 'waiting' ? 'thinking' : status === 'streaming' ? 'talking' : failed ? 'error' : 'idle';

  useEffect(() => {
    if (status === 'idle') saveHistory(messages);
  }, [messages, status]);

  // ---------------------------------------------------------------- Dialogue
  useEffect(() => {
    openRef.current = open;
    nudgeRef.current = nudge;
  }, [open, nudge]);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const showNudge = useCallback((line) => {
    const m = nudgeMem();
    const now = Date.now();
    if (
      m.off ||
      now < m.mutedUntil ||
      openRef.current ||
      nudgeRef.current ||
      document.hidden ||
      m.count >= NUDGE_MAX ||
      now - mountedAt.current < NUDGE_FIRST ||
      now - lastNudgeAt.current < NUDGE_GAP
    ) {
      return false;
    }
    m.count += 1;
    lastNudgeAt.current = now;
    setTyped(0);
    setNudge({ ...line, id: now });
    return true;
  }, []);

  // Section reactions: the first time a section settles in the middle of the
  // viewport, Kismet glances the way you scrolled and offers that section's line.
  useEffect(() => {
    let lastY = window.scrollY;
    let dwell = 0;
    let glance = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || id === sectionRef.current) continue;
          const down = window.scrollY >= lastY;
          lastY = window.scrollY;
          const first = sectionRef.current === null;
          sectionRef.current = id;
          if (!first) {
            setLookAt({ x: 0, y: down ? 0.7 : -0.8 });
            clearTimeout(glance);
            glance = setTimeout(() => setLookAt(null), 1100);
          }
          clearTimeout(dwell);
          dwell = setTimeout(() => {
            const m = nudgeMem();
            if (sectionRef.current !== id || m.seen.has(id) || !SECTION_NUDGES[id]) return;
            if (showNudge(SECTION_NUDGES[id])) m.seen.add(id);
          }, NUDGE_DWELL);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      io.disconnect();
      clearTimeout(dwell);
      clearTimeout(glance);
    };
  }, [showNudge]);

  // Idle timer: the first line after NUDGE_FIRST, then one every NUDGE_IDLE.
  useEffect(() => {
    if (open || nudge) return undefined;
    const m = nudgeMem();
    if (m.off || m.count >= NUDGE_MAX) return undefined;
    const t = setTimeout(
      () => {
        const id = sectionRef.current;
        const mem = nudgeMem();
        let ok;
        if (id && SECTION_NUDGES[id] && !mem.seen.has(id)) {
          ok = showNudge(SECTION_NUDGES[id]);
          if (ok) mem.seen.add(id);
        } else {
          ok = showNudge(IDLE_NUDGES[mem.idle % IDLE_NUDGES.length]);
          if (ok) mem.idle += 1;
        }
        if (!ok) setRetryTick((n) => n + 1);
      },
      lastNudgeAt.current ? NUDGE_IDLE : NUDGE_FIRST,
    );
    return () => clearTimeout(t);
  }, [open, nudge, showNudge, retryTick]);

  // Type the line out; the launcher's mouth moves with each letter.
  useEffect(() => {
    if (!nudge || reduced) return undefined;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= nudge.text.length) clearInterval(iv);
    }, TYPE_MS);
    return () => clearInterval(iv);
  }, [nudge, reduced]);

  const shownChars = nudge ? (reduced ? nudge.text.length : Math.min(typed, nudge.text.length)) : 0;
  const nudgeTyping = Boolean(nudge) && shownChars < nudge.text.length;

  // A little hop as Kismet starts to speak.
  useEffect(() => {
    if (!nudge || reduced || !hopScope.current) return;
    animateHop(hopScope.current, { y: [0, -8, 0], rotate: [0, -6, 0] }, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  }, [nudge, reduced, animateHop, hopScope]);

  // Let it linger once typed, unless the visitor is reading it (hover/focus).
  useEffect(() => {
    if (!nudge || nudgeTyping || nudgeHover) return undefined;
    const t = setTimeout(() => setNudge(null), NUDGE_LINGER);
    return () => clearTimeout(t);
  }, [nudge, nudgeTyping, nudgeHover]);

  function hideNudge() {
    setNudge(null);
    setNudgeHover(false);
  }

  // x on a bubble: quiet for two minutes, then for good after a second time.
  function dismissNudge() {
    const m = nudgeMem();
    m.dismissals += 1;
    if (m.dismissals >= 2) m.off = true;
    else m.mutedUntil = Date.now() + NUDGE_MUTE;
    hideNudge();
  }

  function openChat(question) {
    hideNudge();
    setHover(false);
    setPhase('open');
    if (question) ask(question);
  }

  // Follow new text only while the reader is already at the bottom.
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Circle geometry, in panel coordinates, centred on the launcher.
  const lens = useCallback(() => {
    const p = panelRef.current.getBoundingClientRect();
    const l = launcherRef.current.getBoundingClientRect();
    const x = l.left + l.width / 2 - p.left;
    const y = l.top + l.height / 2 - p.top;
    const far = Math.hypot(Math.max(x, p.width - x), Math.max(y, p.height - y));
    return {
      small: `circle(${LAUNCHER_R}px at ${x}px ${y}px)`,
      // Generous margin so the panel's soft shadow is not clipped at rest.
      full: `circle(${Math.ceil(far + 80)}px at ${x}px ${y}px)`,
    };
  }, []);

  // Open: an Ultramarine disc the size of the launcher grows into the panel,
  // fading to white as it opens; the contents arrive just behind the edge.
  const opening = phase === 'open';
  useLayoutEffect(() => {
    if (!opening) return undefined;
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return undefined;
    if (reduced) {
      const fade = animate(panel, { opacity: [0, 1] }, { duration: 0.2 });
      return () => fade.stop();
    }
    const g = lens();
    panel.style.clipPath = g.small;
    const runs = [
      animate(panel, { clipPath: [g.small, g.full] }, LENS_OPEN),
      animate(panel, { backgroundColor: [PRIMARY, '#ffffff'] }, { duration: 0.32, ease: 'easeOut' }),
      animate(content, { opacity: [0, 1] }, { duration: 0.24, delay: 0.16, ease: 'easeOut' }),
    ];
    runs[0].then(() => {
      if (phaseRef.current === 'open') panel.style.clipPath = 'none';
    });
    return () => runs.forEach((r) => r.stop());
  }, [opening, reduced, lens]);

  // Close: the reverse. Contents leave first, the lens contracts onto the
  // launcher and turns Ultramarine as it lands, then the face pops back in.
  const close = useCallback(async () => {
    if (phaseRef.current !== 'open') return;
    phaseRef.current = 'closing';
    setPhase('closing');
    setHover(false);
    const panel = panelRef.current;
    const content = contentRef.current;
    if (panel && content && !reduced) {
      const g = lens();
      panel.style.clipPath = g.full;
      animate(content, { opacity: 0 }, { duration: 0.12, ease: 'easeIn' });
      animate(panel, { backgroundColor: PRIMARY }, { duration: 0.18, delay: 0.18, ease: 'easeIn' });
      await animate(panel, { clipPath: [g.full, g.small] }, LENS_CLOSE);
    } else if (panel) {
      await animate(panel, { opacity: 0 }, { duration: 0.15 });
    }
    setPhase('closed');
    requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
  }, [reduced, lens]);

  useEffect(() => {
    if (!opening) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), reduced ? 0 : 300);
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [opening, close, reduced]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question, base = messages) {
    const text = question.trim().slice(0, MAX_INPUT);
    if (!text || busy) return;

    const history = [...base.filter((m) => !m.error), { role: 'user', content: text }];
    setMessages([...base, { role: 'user', content: text, settled: true }]);
    setInput('');
    setFailed(false);
    setStatus('waiting');
    stickToBottom.current = true;

    const controller = new AbortController();
    abortRef.current = controller;
    const dropEmpty = (m) => (m.at(-1)?.role === 'assistant' && !m.at(-1).content ? m.slice(0, -1) : m);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "I can't answer right now. Please try again in a bit.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      setStatus('streaming');

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const snapshot = reply;
        setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content: snapshot }]);
      }
      if (!reply.trim()) throw new Error("I couldn't come up with an answer. Try asking another way?");
    } catch (err) {
      if (err.name === 'AbortError') {
        // Stopped by the visitor: keep whatever was printed so far.
        setMessages(dropEmpty);
      } else {
        const message =
          err instanceof TypeError ? "I couldn't reach the server. Check your connection and try again." : err.message;
        setFailed(true);
        setMessages((m) => [...dropEmpty(m), { role: 'assistant', content: message, error: true, settled: true }]);
      }
    } finally {
      abortRef.current = null;
      setStatus('idle');
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (busy) abortRef.current?.abort();
    else ask(input);
  }

  // Resend the last question after an error.
  function retry() {
    const idx = messages.findLastIndex((m) => m.role === 'user');
    if (idx >= 0) ask(messages[idx].content, messages.slice(0, idx));
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setFailed(false);
    inputRef.current?.focus();
  }

  const launcherShown = phase === 'closed';

  return (
    <>
      {open && (
          <section
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="kismet-name"
            className={`fixed z-[60] flex flex-col overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.28)] ${PANEL_POS}`}
          >
            <div ref={contentRef} className="flex min-h-0 flex-1 flex-col">
              <header className="flex items-center gap-3 py-4 pl-4 pr-2">
                <KismetFace size={40} state={faceState} talkPulse={lastText.length} />
                <div className="min-w-0 flex-1">
                  <h2
                    id="kismet-name"
                    className="font-display text-[28px] italic leading-none tracking-[-0.01em] text-primary"
                  >
                    Kismet.
                  </h2>
                  <p className="mt-1.5 truncate font-mono text-[11px] leading-none text-muted">Jason’s assistant</p>
                </div>
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    aria-label="Start a new chat"
                    title="New chat"
                    className="grid size-11 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <RotateCcw size={16} strokeWidth={1.8} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close chat"
                  className="grid size-11 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </header>

              <div
                ref={listRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
                }}
                className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-2 pb-5"
                aria-live="polite"
                aria-busy={busy}
              >
                <div className="flex flex-col gap-4">
                  <KismetRow>
                    <p className={BUBBLE_KISMET}>{GREETING}</p>
                  </KismetRow>

                  {messages.length === 0 && (
                    <ul className="-mt-1 flex flex-col items-start gap-2 pl-[34px]" aria-label="Suggested questions">
                      {SUGGESTIONS.map((s, i) => (
                        <motion.li
                          key={s}
                          initial={reduced ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: reduced ? 0 : 0.26 + i * 0.06, duration: 0.32, ease: EASE_OUT }}
                        >
                          <button
                            type="button"
                            onClick={() => ask(s)}
                            className="group relative overflow-hidden rounded-full border border-primary/20 bg-white px-3.5 py-2 text-left font-mono text-[12.5px] leading-snug text-primary transition-colors duration-300 ease-soft hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100"
                            />
                            <span className="relative">{s}</span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {messages.map((m, i) => {
                    const fresh = !m.settled || i === messages.length - 1;
                    if (m.role === 'user') {
                      return (
                        <motion.p
                          key={i}
                          initial={fresh ? (reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.94 }) : false}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                          style={{ transformOrigin: '100% 100%' }}
                          className={BUBBLE_USER}
                        >
                          {m.content}
                        </motion.p>
                      );
                    }
                    if (m.error) {
                      const last = i === messages.length - 1;
                      return (
                        <KismetRow key={i} state="error" animateIn={fresh} reduced={reduced}>
                          <div role="alert" className={BUBBLE_ERROR}>
                            <p>{m.content}</p>
                            {last && !busy && (
                              <button
                                type="button"
                                onClick={retry}
                                className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/25 px-3 font-mono text-[12px] font-bold tracking-[0.02em] text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                              >
                                <RotateCcw size={12} strokeWidth={2.2} />
                                Try again
                              </button>
                            )}
                          </div>
                        </KismetRow>
                      );
                    }
                    return (
                      <KismetRow key={i} animateIn={!m.settled} reduced={reduced}>
                        <div className={BUBBLE_KISMET}>
                          {m.content ? <RichText text={m.content} settled={m.settled || reduced} /> : <TypingDots />}
                        </div>
                      </KismetRow>
                    );
                  })}

                  {status === 'waiting' && (
                    <KismetRow state="thinking" animateIn reduced={reduced}>
                      <p className={BUBBLE_KISMET}>
                        <TypingDots />
                      </p>
                    </KismetRow>
                  )}
                </div>
              </div>

              <form onSubmit={onSubmit} className="px-3 pb-3">
                <div className="flex items-center gap-2 rounded-full bg-surface p-1.5 pl-4 transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_rgba(8,36,169,0.3)]">
                  <label htmlFor="kismet-input" className="sr-only">
                    Ask Kismet a question
                  </label>
                  <input
                    id="kismet-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Jason’s work"
                    maxLength={MAX_INPUT}
                    autoComplete="off"
                    enterKeyHint="send"
                    className="min-w-0 flex-1 bg-transparent font-mono text-[16px] text-ink caret-primary outline-none placeholder:text-[#5B6270] sm:text-[14px]"
                  />
                  <motion.button
                    type="submit"
                    whileTap={reduced ? undefined : { scale: 0.92 }}
                    disabled={!busy && !input.trim()}
                    aria-label={busy ? 'Stop answer' : 'Send question'}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition-[background-color,opacity] duration-200 hover:bg-primary-hover disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {busy ? <Square size={12} fill="currentColor" strokeWidth={0} /> : <ArrowUp size={18} strokeWidth={2} />}
                  </motion.button>
                </div>
              </form>
            </div>
          </section>
      )}

      {/* Launcher: always mounted so the lens can find it; it only ever scales
          uniformly. Hover: lifts, the second ink plate slides out from under
          the disc like a sticker peeling off the page, and a dock-style label
          appears. */}
      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => openChat()}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        // Keyboard focus shows the hover state; focus returned after a mouse
        // click on the panel's close button does not.
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Open Kismet, Jason’s portfolio assistant"
        aria-haspopup="dialog"
        aria-hidden={!launcherShown}
        tabIndex={launcherShown ? 0 : -1}
        initial={false}
        animate={
          launcherShown
            ? { opacity: 1, scale: hover && !reduced ? 1.05 : 1, y: hover && !reduced ? -3 : 0 }
            : { opacity: 0, scale: 0.92, y: 0 }
        }
        transition={
          launcherShown
            ? { type: 'spring', stiffness: 520, damping: 16, opacity: { duration: 0.12 } }
            : { duration: 0.12, ease: 'easeIn' }
        }
        whileTap={reduced ? undefined : { scale: 0.94 }}
        className={`fixed z-[60] grid size-16 place-items-center rounded-full shadow-[0_14px_30px_-12px_rgba(8,36,169,0.6)] transition-shadow duration-300 hover:shadow-[0_22px_40px_-14px_rgba(8,36,169,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          launcherShown ? '' : 'pointer-events-none'
        } ${LAUNCHER_POS}`}
      >
        <span ref={hopScope} className="block">
          <KismetFace
            size={64}
            state={failed ? 'error' : nudgeTyping ? 'talking' : 'idle'}
            talkPulse={shownChars}
            happy={hover && !nudgeTyping}
            lifted={hover && launcherShown}
            lookAt={lookAt}
          />
        </span>
        <AnimatePresence>
          {hover && launcherShown && !nudge && (
            <motion.span
              key="tip"
              aria-hidden="true"
              initial={{ opacity: 0, y: reduced ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : 2, transition: { duration: 0.1 } }}
              transition={{ duration: 0.16, ease: EASE_OUT }}
              className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-full border border-black/[0.08] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-800 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.35)]"
            >
              Ask Kismet
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {nudge && !open && (
          <motion.div
            key={nudge.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.55, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 4, transition: { duration: 0.16, ease: 'easeIn' } }}
            transition={reduced ? { duration: 0.2 } : { type: 'spring', stiffness: 380, damping: 24 }}
            style={{ transformOrigin: '100% 100%' }}
            onPointerEnter={() => setNudgeHover(true)}
            onPointerLeave={() => setNudgeHover(false)}
            onFocus={() => setNudgeHover(true)}
            onBlur={() => setNudgeHover(false)}
            className={`fixed z-[60] flex w-max max-w-[16rem] items-start rounded-[20px] rounded-br-[6px] border border-black/[0.07] bg-white p-1 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.35)] ${NUDGE_POS}`}
          >
            <button
              type="button"
              onClick={() => openChat(nudge.ask)}
              aria-label={`Kismet says: ${nudge.text} ${nudge.ask ? 'Ask this in the chat.' : 'Open the chat.'}`}
              className="group min-w-0 flex-1 rounded-[16px] py-2 pl-3 pr-1 text-left font-mono text-[13px] leading-[1.5] text-ink/85 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span aria-hidden="true" className="block">
                {nudge.text.slice(0, shownChars)}
                <span className="opacity-0">{nudge.text.slice(shownChars)}</span>
              </span>
              {nudge.ask && (
                <span
                  aria-hidden="true"
                  className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.03em] text-primary transition-[opacity,transform] duration-300 ease-soft group-hover:translate-x-0.5 ${
                    nudgeTyping ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  Ask Kismet
                  <ArrowUpRight size={12} strokeWidth={2.4} />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={dismissNudge}
              aria-label="Dismiss Kismet's message"
              className="grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
