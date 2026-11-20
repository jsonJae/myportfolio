import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ArrowRight, Check, Copy, PenLine } from 'lucide-react';
import Reveal from './Reveal';
import ComposeWindow from './ComposeWindow';
import { CONTACT_EMAIL, htmlToText } from '../utils/sendMessage';

const links = [
    {
        icon: faLinkedinIn,
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/jason-gian-duran-4754a7355',
        external: true,
    },
    { icon: faGithub, label: 'GitHub', href: 'https://github.com/jsonJae', external: true },
    { icon: faFilePdf, label: 'Resume', href: '/DURAN-RESUME.pdf', download: true },
];

const EMPTY_DRAFT = { name: '', email: '', subject: '', html: '' };

// The pill and the compose window share one layoutId, so the button stretches
// into the window and folds back into the button (or the confirmation).
const morph = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 };
const fade = { duration: 0.22, ease: [0.16, 1, 0.3, 1] };

const pillClass =
    'flex h-14 items-center gap-3 px-7 font-mono text-[14px] font-bold tracking-[0.03em]';

function CopyEmail() {
    const [copied, setCopied] = useState(false);
    const timer = useRef(0);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1800);
        } catch {
            window.location.href = `mailto:${CONTACT_EMAIL}`;
        }
    };

    return (
        <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-black/[0.06] bg-white/70 py-1 pl-4 pr-1 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="truncate font-mono text-[13px] text-ink-soft transition-colors duration-300 ease-soft hover:text-primary"
            >
                {CONTACT_EMAIL}
            </a>
            <button
                type="button"
                onClick={copy}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
                className="inline-flex h-9 shrink-0 items-center overflow-hidden rounded-full px-3 font-mono text-[12px] font-bold text-primary transition-colors duration-300 ease-soft hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="inline-flex items-center gap-1.5"
                    >
                        {copied ? (
                            <Check size={14} strokeWidth={2.25} aria-hidden="true" />
                        ) : (
                            <Copy size={14} strokeWidth={2} aria-hidden="true" />
                        )}
                        {copied ? 'Copied' : 'Copy'}
                    </motion.span>
                </AnimatePresence>
            </button>
            <span aria-live="polite" className="sr-only">
                {copied ? 'Email address copied' : ''}
            </span>
        </div>
    );
}

export default function Contact() {
    const [stage, setStage] = useState('closed'); // closed | open | sent
    const [draft, setDraft] = useState(EMPTY_DRAFT);
    const triggerRef = useRef(null);
    const returnFocus = useRef(false);

    const hasDraft = Boolean(
        draft.name.trim() || draft.email.trim() || draft.subject.trim() || htmlToText(draft.html),
    );
    const ctaLabel = hasDraft ? 'Continue your draft' : 'Write me a message';

    // When the window closes, hand focus back to the button it came from.
    useEffect(() => {
        if (stage !== 'closed' || !returnFocus.current) return undefined;
        returnFocus.current = false;
        const id = window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 50);
        return () => window.clearTimeout(id);
    }, [stage]);

    const updateDraft = (patch) => setDraft((current) => ({ ...current, ...patch }));

    const close = () => {
        returnFocus.current = true;
        setStage('closed');
    };

    const discard = () => {
        setDraft(EMPTY_DRAFT);
        close();
    };

    const sent = () => {
        setDraft(EMPTY_DRAFT);
        setStage('sent');
    };

    return (
        <MotionConfig reducedMotion="user">
            {/* Equal 1fr rows above and below keep the content at the true centre of the screen;
                the copyright sits in the bottom row, clear of the dock, without pushing it up. */}
            <div className="grid min-h-screen grid-rows-[1fr_auto_1fr] justify-items-center px-4 py-24 md:px-8">
                <div className="row-start-2 flex w-full max-w-2xl flex-col items-center text-center">
                    <Reveal from="up" duration={0.9}>
                        <h2
                            id="contact-title"
                            className="font-display text-[52px] leading-[0.92] tracking-[-0.02em] text-primary heading-balance md:text-[88px]"
                        >
                            let’s make <span className="font-normal italic">something</span>.
                        </h2>
                    </Reveal>
                    <Reveal from="up" delay={0.06}>
                        <p className="prose-measure mx-auto mt-6 font-body text-[14px] leading-[1.75] text-ink-soft md:text-[15px]">
                            Have an internship, a freelance brief, or just a question? Tell me what you’re
                            working on — my inbox is open.
                        </p>
                    </Reveal>

                    <Reveal from="up" blur={0} delay={0.12} className="mt-10 flex flex-col items-center">
                        {stage === 'open' ? (
                            // Holds the button's space while it lives on as the window.
                            <span aria-hidden="true" className={`${pillClass} invisible`}>
                                <PenLine size={16} />
                                {ctaLabel}
                                <ArrowRight size={16} />
                            </span>
                        ) : (
                            <motion.div
                                layoutId="compose"
                                transition={{ layout: morph }}
                                style={{ borderRadius: 28 }}
                                className="overflow-hidden bg-primary shadow-[0_16px_32px_-16px_rgba(8,36,169,0.7)]"
                            >
                                {stage === 'closed' ? (
                                    <motion.button
                                        key="closed"
                                        ref={triggerRef}
                                        type="button"
                                        onClick={() => setStage('open')}
                                        aria-haspopup="dialog"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { ...fade, delay: 0.18 } }}
                                        className={`${pillClass} group text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white`}
                                    >
                                        <PenLine size={16} strokeWidth={2} aria-hidden="true" />
                                        {ctaLabel}
                                        {hasDraft && (
                                            <span
                                                aria-hidden="true"
                                                className="size-2 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.18)]"
                                            />
                                        )}
                                        <ArrowRight
                                            size={16}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                            className="transition-transform duration-300 ease-soft group-hover:translate-x-1"
                                        />
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="sent"
                                        role="status"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { ...fade, delay: 0.2 } }}
                                        className="flex h-14 items-center gap-3 pl-6 pr-2 font-mono text-[13px] font-bold tracking-[0.02em] text-white"
                                    >
                                        <motion.span
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.3 }}
                                            className="grid size-6 place-items-center rounded-full bg-white text-primary"
                                        >
                                            <Check size={14} strokeWidth={3} aria-hidden="true" />
                                        </motion.span>
                                        <span className="whitespace-nowrap">Mail app opened.</span>
                                        <button
                                            ref={triggerRef}
                                            type="button"
                                            onClick={() => setStage('open')}
                                            className="ml-1 inline-flex h-10 items-center whitespace-nowrap rounded-full bg-white/15 px-4 text-[12px] transition-colors duration-300 ease-soft hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                        >
                                            Write another
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </Reveal>

                    <Reveal from="up" blur={0} delay={0.18} className="mt-8 flex w-full flex-col items-center gap-4">
                        <CopyEmail />
                        <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        {...(link.download ? { download: '' } : {})}
                                        {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                        className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-primary/25 bg-white/70 px-4 font-mono text-[12px] font-bold tracking-[0.03em] text-primary shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(8,36,169,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100"
                                        />
                                        <span className="relative flex items-center gap-2 transition-colors duration-300 ease-soft group-hover:text-white">
                                            <FontAwesomeIcon icon={link.icon} aria-hidden="true" className="text-[14px]" />
                                            {link.label}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <p className="row-start-3 self-end pt-8 text-center font-mono text-[11px] text-muted/80">
                    © {new Date().getFullYear()} Jason Gian Duran · Muntinlupa, Metro Manila, Philippines
                </p>
            </div>

            {createPortal(
                <AnimatePresence>
                    {stage === 'open' && (
                        <ComposeWindow
                            key="compose"
                            draft={draft}
                            onChange={updateDraft}
                            onClose={close}
                            onDiscard={discard}
                            onSent={sent}
                        />
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </MotionConfig>
    );
}
