export const CONTACT_NAME = 'Jason Gian Duran';
export const CONTACT_EMAIL = 'jasongian28@gmail.com';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Turns the compose window's rich-text HTML into readable plain text: lists
// keep their bullets and numbers, links keep their address, and paragraphs
// keep their line breaks. Parsing happens in an inert document, so nothing in
// the HTML ever runs.
export function htmlToText(html) {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');

    const walk = (node) => {
        let out = '';
        node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                out += child.textContent.replace(/\s+/g, ' ');
                return;
            }
            if (child.nodeType !== Node.ELEMENT_NODE) return;
            const tag = child.tagName;

            if (tag === 'BR') {
                out += '\n';
            } else if (tag === 'UL' || tag === 'OL') {
                let index = 0;
                if (out && !out.endsWith('\n')) out += '\n';
                child.childNodes.forEach((item) => {
                    if (item.tagName !== 'LI') return;
                    index += 1;
                    out += `${tag === 'OL' ? `${index}.` : '•'} ${walk(item).trim()}\n`;
                });
            } else if (tag === 'A') {
                const text = walk(child);
                const href = child.getAttribute('href');
                out += href && href !== text.trim() ? `${text} (${href})` : text;
            } else if (tag === 'DIV' || tag === 'P') {
                if (out && !out.endsWith('\n')) out += '\n';
                out += `${walk(child)}\n`;
            } else {
                out += walk(child);
            }
        });
        return out;
    };

    return walk(doc.body.firstChild)
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * The single place that knows how a message leaves the site.
 *
 * Today it hands the message to the visitor's own mail app (mailto), which
 * can only carry plain text. When a backend exists, replace the body with:
 *
 *   const res = await fetch('/api/contact', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ name, email, subject, html, text }),
 *   });
 *   if (!res.ok) throw new Error('send failed');
 *
 * Throwing here makes the compose window show its error state.
 */
export async function sendMessage({ name, email, subject, html }) {
    const text = htmlToText(html);
    const finalSubject = subject.trim() || `Portfolio inquiry from ${name}`;
    const body = `${text}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
    return { via: 'mailto' };
}
