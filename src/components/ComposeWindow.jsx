import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CircleAlert,
    CornerDownLeft,
    Link2,
    List,
    ListOrdered,
    Maximize2,
    Minimize2,
    RemoveFormatting,
    Send,
    Trash2,
    X,
} from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_NAME, EMAIL_PATTERN, htmlToText, sendMessage } from '../utils/sendMessage';

const morph = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 };

const IS_MAC =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || '');
const MOD_LABEL = IS_MAC ? '⌘' : 'Ctrl';
const MOD_ARIA = IS_MAC ? 'Meta' : 'Control';

// The styling tools are set in Geist, the sans sibling of the site's mono.
// B, I and U show the style itself; the rest are drawn icons.
const glyph = 'font-sans text-[17px] leading-none';

const TOOLS = [
    { id: 'bold', label: 'Bold', key: 'B', command: 'bold', mark: <span className={`${glyph} font-bold`}>B</span> },
    { id: 'italic', label: 'Italic', key: 'I', command: 'italic', mark: <span className={`${glyph} font-medium italic`}>I</span> },
    {
        id: 'underline',
        label: 'Underline',
        key: 'U',
        command: 'underline',
        mark: (
            <span className={`${glyph} font-medium underline decoration-[1.5px] underline-offset-[3px]`}>U</span>
        ),
    },
    null,
    { id: 'ul', label: 'Bulleted list', command: 'insertUnorderedList', Icon: List },
    { id: 'ol', label: 'Numbered list', command: 'insertOrderedList', Icon: ListOrdered },
    null,
    { id: 'link', label: 'Link', key: 'K', command: 'link', Icon: Link2 },
    { id: 'clear', label: 'Clear formatting', key: '\\', command: 'removeFormat', Icon: RemoveFormatting },
];

const FIRST_TOOL = TOOLS.findIndex(Boolean);
const LAST_TOOL = TOOLS.findLastIndex(Boolean);

const STATEFUL = ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'];

const FOCUSABLE =
    'button:not([disabled]), input:not([disabled]), [contenteditable="true"], a[href], [tabindex]:not([tabindex="-1"])';

const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function normalizeUrl(raw) {
    const url = raw.trim();
    if (!url) return '';
    if (/^(https?:|mailto:)/i.test(url)) return url;
    if (EMAIL_PATTERN.test(url)) return `mailto:${url}`;
    return `https://${url}`;
}

// One envelope line: label, field, and the field's own error right under it.
function Row({ label, htmlFor, error, children }) {
    const invalid = Boolean(error);
    return (
        <div
            className={`grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 border-b px-5 transition-colors duration-300 ease-soft focus-within:bg-primary/[0.03] ${
                invalid ? 'border-[#B42318]/30 bg-[#B42318]/[0.03]' : 'border-black/[0.06]'
            }`}
        >
            <label
                htmlFor={htmlFor}
                className={`flex h-12 items-center whitespace-nowrap font-mono text-[12px] ${invalid ? 'text-[#B42318]' : 'text-muted'}`}
            >
                {label}
            </label>
            {children}
            {invalid && (
                <p
                    id={`${htmlFor}-error`}
                    className="col-start-2 -mt-2 flex items-start gap-1.5 pb-2.5 font-mono text-[12px] leading-[1.5] text-[#B42318]"
                >
                    <CircleAlert size={13} strokeWidth={2} aria-hidden="true" className="mt-[2px] shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass =
    'h-12 min-w-0 w-full bg-transparent font-body text-[14px] text-ink caret-primary placeholder:text-muted focus:outline-none';

function ToolTip({ label, shortcut, align }) {
    const place =
        align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';
    return (
        <span
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-[calc(100%+2px)] z-10 flex translate-y-1 items-center gap-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 font-sans text-[12px] font-medium leading-none text-white opacity-0 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.45)] transition-[opacity,translate] duration-150 ease-soft group-hover/tool:translate-y-0 group-hover/tool:opacity-100 group-hover/tool:delay-300 group-focus-visible/tool:translate-y-0 group-focus-visible/tool:opacity-100 ${place}`}
        >
            {label}
            {shortcut && <span className="text-white/55">{shortcut}</span>}
        </span>
    );
}

export default function ComposeWindow({ draft, onChange, onClose, onDiscard, onSent }) {
    const [expanded, setExpanded] = useState(false);
    const [active, setActive] = useState({});
    const [linkOpen, setLinkOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);
    const [trap, setTrap] = useState('');
    const [empty, setEmpty] = useState(() => !htmlToText(draft.html));
    const [initialHtml] = useState(draft.html);
    const [startInBody] = useState(() => Boolean(draft.name && draft.email));

    const dialogRef = useRef(null);
    const editorRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const linkInputRef = useRef(null);
    const savedRange = useRef(null);

    // Seed the editor once; after that the DOM is the source of truth, so the
    // caret never jumps while typing.
    useLayoutEffect(() => {
        editorRef.current.innerHTML = initialHtml;
    }, [initialHtml]);

    // Lock page scroll behind the window, and land the cursor where the
    // visitor will type first.
    useEffect(() => {
        const root = document.documentElement;
        const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
        const gutter = window.innerWidth - root.clientWidth;
        root.style.overflow = 'hidden';
        if (gutter > 0) root.style.paddingRight = `${gutter}px`;
        const id = window.setTimeout(() => {
            (startInBody ? editorRef : nameRef).current?.focus({ preventScroll: true });
        }, 280);
        return () => {
            window.clearTimeout(id);
            root.style.overflow = previous.overflow;
            root.style.paddingRight = previous.paddingRight;
        };
    }, [startInBody]);

    // Keep the toolbar's pressed states in step with the caret, and remember
    // the selection so toolbar clicks act on it.
    useEffect(() => {
        const update = () => {
            const selection = document.getSelection();
            const editor = editorRef.current;
            if (!selection || !editor || !selection.rangeCount) return;
            if (!editor.contains(selection.anchorNode)) return;
            savedRange.current = selection.getRangeAt(0).cloneRange();
            setActive(Object.fromEntries(STATEFUL.map((command) => [command, document.queryCommandState(command)])));
        };
        document.addEventListener('selectionchange', update);
        return () => document.removeEventListener('selectionchange', update);
    }, []);

    useEffect(() => {
        if (linkOpen) linkInputRef.current?.focus();
    }, [linkOpen]);

    const syncBody = () => {
        const editor = editorRef.current;
        onChange({ html: editor.innerHTML });
        const blank = !htmlToText(editor.innerHTML);
        setEmpty(blank);
        if (!blank && errors.message) setErrors((current) => ({ ...current, message: undefined }));
    };

    const restoreSelection = () => {
        const editor = editorRef.current;
        editor.focus({ preventScroll: true });
        const range = savedRange.current;
        if (range && editor.contains(range.startContainer)) {
            const selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    const run = (command) => {
        if (command === 'link') {
            setLinkUrl('');
            setLinkOpen(true);
            return;
        }
        restoreSelection();
        document.execCommand(command, false);
        syncBody();
    };

    const applyLink = () => {
        const url = normalizeUrl(linkUrl);
        setLinkOpen(false);
        restoreSelection();
        if (!url) return;
        const selection = document.getSelection();
        if (selection.isCollapsed) {
            const safe = escapeHtml(url);
            document.execCommand('insertHTML', false, `<a href="${safe}">${escapeHtml(linkUrl.trim())}</a>&nbsp;`);
        } else {
            document.execCommand('createLink', false, url);
        }
        syncBody();
    };

    const setField = (field) => (event) => {
        onChange({ [field]: event.target.value });
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = 'Add your name.';
        if (!draft.email.trim()) next.email = 'Add your email so I can reply.';
        else if (!EMAIL_PATTERN.test(draft.email.trim())) next.email = 'That email address doesn’t look right.';
        if (!htmlToText(editorRef.current.innerHTML)) next.message = 'Write a message before sending.';
        setErrors(next);
        if (next.name) nameRef.current?.focus();
        else if (next.email) emailRef.current?.focus();
        else if (next.message) editorRef.current?.focus();
        return Object.keys(next).length === 0;
    };

    const send = async () => {
        if (sending || !validate()) return;
        setSending(true);
        try {
            await sendMessage({ ...draft, html: editorRef.current.innerHTML, website: trap });
            onSent();
        } catch (err) {
            setErrors({
                send: err.userMessage
                    ? `${err.userMessage} You can also email me at ${CONTACT_EMAIL}.`
                    : `Couldn’t send that. Try again, or email me at ${CONTACT_EMAIL}.`,
            });
            setSending(false);
        }
    };

    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            if (linkOpen) {
                setLinkOpen(false);
                restoreSelection();
            } else {
                onClose();
            }
            return;
        }
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            send();
            return;
        }
        // Link and clear formatting get the shortcuts mail apps use; bold,
        // italic and underline are handled by the editor itself.
        const mod = IS_MAC ? event.metaKey : event.ctrlKey;
        if (mod && !event.altKey && editorRef.current?.contains(event.target)) {
            const key = event.key.toLowerCase();
            if (key === 'k' || key === '\\') {
                event.preventDefault();
                run(key === 'k' ? 'link' : 'removeFormat');
                return;
            }
        }
        // Keep Tab inside the window while it is open.
        if (event.key === 'Tab') {
            const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter(
                (node) => node.offsetParent !== null,
            );
            if (!nodes.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    };

    // Field errors sit under their own fields; only these two live by the actions.
    const messages = [errors.message, errors.send].filter(Boolean);

    return (
        <div className="fixed inset-0 z-[70] flex items-stretch justify-center p-2 sm:items-center sm:p-6">
            <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[rgba(8,20,70,0.28)] backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
            />

            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="compose-title"
                aria-describedby="compose-note"
                layoutId="compose"
                transition={{ layout: morph }}
                style={{ borderRadius: 24 }}
                onKeyDown={onKeyDown}
                className={`relative flex h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden bg-white shadow-[0_40px_100px_-30px_rgba(8,36,169,0.55)] ${
                    expanded
                        ? 'sm:h-[calc(100dvh-3rem)] sm:max-w-5xl'
                        : 'sm:h-[min(620px,calc(100dvh-3rem))] sm:max-w-[640px]'
                }`}
            >
                <motion.div
                    className="flex min-h-0 flex-1 flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.16, duration: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                >
                    <div className="flex h-14 shrink-0 items-center justify-between gap-3 bg-primary pl-5 pr-2 text-white">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <h3 id="compose-title" className="shrink-0 font-mono text-[13px] font-bold tracking-[0.03em]">
                                New message
                            </h3>
                            <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-white/40" />
                            <span id="compose-note" className="truncate font-mono text-[11px] text-white/70">
                                Goes straight to my inbox
                            </span>
                        </div>
                        <div className="flex shrink-0 items-center">
                            <button
                                type="button"
                                onClick={() => setExpanded((value) => !value)}
                                aria-label={expanded ? 'Exit full size' : 'Full size'}
                                className="hidden size-10 place-items-center rounded-full text-white/75 transition-colors duration-300 ease-soft hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:grid"
                            >
                                {expanded ? (
                                    <Minimize2 size={16} strokeWidth={2} aria-hidden="true" />
                                ) : (
                                    <Maximize2 size={16} strokeWidth={2} aria-hidden="true" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close and keep draft"
                                className="grid size-10 place-items-center rounded-full text-white/75 transition-colors duration-300 ease-soft hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <X size={18} strokeWidth={2} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="flex min-h-12 items-center gap-3 border-b border-black/[0.06] px-5">
                        <span className="w-[4.5rem] shrink-0 font-mono text-[12px] text-muted">To</span>
                        <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3">
                            <span
                                aria-hidden="true"
                                className="grid size-6 shrink-0 place-items-center rounded-full bg-primary font-display text-[14px] italic text-white"
                            >
                                J
                            </span>
                            <span className="whitespace-nowrap font-mono text-[12px] font-semibold text-ink">
                                {CONTACT_NAME}
                            </span>
                            <span className="hidden truncate font-mono text-[12px] text-muted sm:inline">
                                {CONTACT_EMAIL}
                            </span>
                        </span>
                    </div>

                    <Row label="From" htmlFor="compose-name" error={errors.name}>
                        <input
                            ref={nameRef}
                            id="compose-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Your name"
                            value={draft.name}
                            onChange={setField('name')}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'compose-name-error' : undefined}
                            className={inputClass}
                        />
                    </Row>
                    <Row label="Reply to" htmlFor="compose-email" error={errors.email}>
                        <input
                            ref={emailRef}
                            id="compose-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={draft.email}
                            onChange={setField('email')}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'compose-email-error' : undefined}
                            className={inputClass}
                        />
                    </Row>
                    <Row label="Subject" htmlFor="compose-subject">
                        <input
                            id="compose-subject"
                            type="text"
                            placeholder="What’s this about?"
                            value={draft.subject}
                            onChange={setField('subject')}
                            className={inputClass}
                        />
                    </Row>

                    {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
                    <div aria-hidden="true" className="hidden">
                        <label htmlFor="compose-website">Website</label>
                        <input
                            id="compose-website"
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={trap}
                            onChange={(event) => setTrap(event.target.value)}
                        />
                    </div>

                    <div className="relative min-h-0 flex-1 overflow-y-auto">
                        {empty && (
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-5 top-4 pr-5 font-body text-[14px] leading-[1.75] text-muted"
                            >
                                What are you building, and how can I help?
                            </span>
                        )}
                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            role="textbox"
                            aria-multiline="true"
                            aria-label="Message"
                            aria-invalid={Boolean(errors.message)}
                            spellCheck="true"
                            onInput={syncBody}
                            onPaste={(event) => {
                                // Pasted content arrives as plain text, so foreign
                                // styles never end up in the email.
                                event.preventDefault();
                                document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
                            }}
                            className="compose-editor min-h-full px-5 py-4 font-body text-[14px] leading-[1.75] text-ink caret-primary focus:outline-none"
                        />
                    </div>

                    {messages.length > 0 && (
                        <div
                            role="alert"
                            className="mx-5 mb-3 flex items-start gap-2 font-mono text-[12px] leading-[1.6] text-[#B42318]"
                        >
                            <CircleAlert size={14} strokeWidth={2} aria-hidden="true" className="mt-[3px] shrink-0" />
                            <span>{messages.join(' ')}</span>
                        </div>
                    )}

                    {/* The action bar. One row from sm: styling tools on the left,
                        discard and Send on the right. Phones stack the tools over
                        the actions, in the same (DOM and focus) order. */}
                    <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-black/[0.06] px-3 pb-3 pt-2 sm:flex-nowrap sm:pt-3">
                        <div
                            role="toolbar"
                            aria-label="Formatting"
                            className={`flex h-11 w-full min-w-0 items-center ${
                                linkOpen ? 'sm:flex-1' : 'justify-between sm:w-auto sm:justify-start'
                            }`}
                        >
                            {linkOpen ? (
                                <form
                                    className="flex h-10 w-full items-center gap-1.5 rounded-xl bg-surface pl-3 pr-1"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        applyLink();
                                    }}
                                >
                                    <Link2 size={15} strokeWidth={2} aria-hidden="true" className="shrink-0 text-primary" />
                                    <input
                                        ref={linkInputRef}
                                        type="text"
                                        inputMode="url"
                                        aria-label="Link address"
                                        placeholder="Paste or type a link"
                                        value={linkUrl}
                                        onChange={(event) => setLinkUrl(event.target.value)}
                                        className="h-full min-w-0 flex-1 bg-transparent pl-1 font-sans text-[14px] text-ink caret-primary placeholder:text-muted focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLinkOpen(false);
                                            restoreSelection();
                                        }}
                                        className="h-8 shrink-0 rounded-lg px-2.5 font-sans text-[13px] font-medium text-muted transition-colors duration-200 ease-soft hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="h-8 shrink-0 rounded-lg bg-primary px-3 font-sans text-[13px] font-semibold text-white transition-colors duration-200 ease-soft hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                    >
                                        Apply
                                    </button>
                                </form>
                            ) : (
                                TOOLS.map((tool, index) => {
                                    if (!tool) {
                                        return (
                                            <span
                                                key={`gap-${index}`}
                                                aria-hidden="true"
                                                className="mx-1 h-5 w-px shrink-0 bg-black/10"
                                            />
                                        );
                                    }
                                    const ToolIcon = tool.Icon;
                                    const pressed = STATEFUL.includes(tool.command)
                                        ? Boolean(active[tool.command])
                                        : undefined;
                                    const align =
                                        index === FIRST_TOOL ? 'start' : index === LAST_TOOL ? 'end' : 'center';
                                    return (
                                        <button
                                            key={tool.id}
                                            type="button"
                                            aria-label={tool.label}
                                            aria-pressed={pressed}
                                            aria-keyshortcuts={tool.key ? `${MOD_ARIA}+${tool.key}` : undefined}
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => run(tool.command)}
                                            className="group/tool relative grid h-11 w-10 min-w-8 shrink place-items-center focus-visible:outline-none"
                                        >
                                            <span
                                                className={`grid size-9 place-items-center rounded-[10px] transition-[background-color,color] duration-200 ease-soft group-focus-visible/tool:ring-2 group-focus-visible/tool:ring-primary ${
                                                    pressed
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-ink-soft group-hover/tool:bg-surface group-hover/tool:text-ink'
                                                }`}
                                            >
                                                {ToolIcon ? (
                                                    <ToolIcon size={17} strokeWidth={1.9} aria-hidden="true" />
                                                ) : (
                                                    <span aria-hidden="true">{tool.mark}</span>
                                                )}
                                            </span>
                                            <ToolTip
                                                label={tool.label}
                                                shortcut={tool.key ? `${MOD_LABEL} ${tool.key}` : null}
                                                align={align}
                                            />
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex w-full items-center justify-between gap-3 sm:ml-auto sm:w-auto sm:justify-end">
                            <button
                                type="button"
                                onClick={onDiscard}
                                aria-label="Discard draft"
                                title="Discard draft"
                                className="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors duration-300 ease-soft hover:bg-[#B42318]/10 hover:text-[#B42318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <Trash2 size={17} strokeWidth={1.8} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={send}
                                disabled={sending}
                                aria-keyshortcuts={`${MOD_ARIA}+Enter`}
                                className="group inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full bg-primary pl-6 pr-5 font-mono text-[13px] font-bold tracking-[0.03em] text-white shadow-[0_12px_28px_-14px_rgba(8,36,169,0.7)] transition-[transform,background-color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                            >
                                {sending ? 'Sending…' : 'Send'}
                                <Send
                                    size={14}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                                {/* The shortcut rides in the button, where it can't be misread. */}
                                <span
                                    aria-hidden="true"
                                    className="ml-0.5 hidden items-center gap-1 border-l border-white/25 pl-3 text-[11px] font-medium tracking-normal text-white/65 sm:inline-flex"
                                >
                                    {MOD_LABEL}
                                    <CornerDownLeft size={12} strokeWidth={2} />
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
