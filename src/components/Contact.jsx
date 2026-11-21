import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    AnimatePresence,
    MotionConfig,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ArrowRight, Check, Copy, PenLine } from 'lucide-react';
import Reveal from './Reveal';
import ComposeWindow from './ComposeWindow';
import ContactScene from './contact/ContactScene';
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

const headingClass =
    'font-display text-[52px] leading-[0.92] tracking-[-0.02em] heading-balance md:text-[88px]';

// The page ends at the bottom of this section, so "arrived" means the end of
// the page. A little hysteresis keeps it from flickering on trackpad bounce.
const ARRIVE = 0.985;
const LEAVE = 0.9;

function HeadingText() {
    return (
        <>
            let’s make <span className="font-normal italic">something</span>.
        </>
    );
}

// Two extra print plates under the headline, out of register until the end
// of the page, where they snap in under the Fog Paper plate on a spring.
function Plate({ q, dx, dy, className }) {
    const x = useTransform(q, (v) => (1 - v) * dx);
    const y = useTransform(q, (v) => (1 - v) * dy);
    return (
        <motion.p aria-hidden="true" style={{ x, y }} className={`absolute inset-0 ${headingClass} ${className}`}>
            <HeadingText />
        </motion.p>
    );
}

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
        <div className="inline-flex max-w-full items-center gap-1 rounded-full border border-surface/15 bg-white/[0.07] py-1 pl-4 pr-1">
            <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="truncate font-mono text-[13px] text-surface/85 transition-colors duration-300 ease-soft hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface"
            >
                {CONTACT_EMAIL}
            </a>
            <button
                type="button"
                onClick={copy}
                aria-label={copied ? 'Email address copied' : 'Copy email address'}
                className="inline-flex h-9 shrink-0 items-center overflow-hidden rounded-full px-3 font-mono text-[12px] font-bold text-surface transition-colors duration-300 ease-soft hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface"
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
    const sceneRef = useRef(null);
    const ctaRef = useRef(null);
    const reduced = useReducedMotion();

    // p runs 0 → 1 from the moment the section's top meets the bottom of the
    // viewport to the end of the page.
    const { scrollYProgress: p } = useScroll({ target: sceneRef, offset: ['start end', 'end end'] });
    const [arrived, setArrived] = useState(false);
    useMotionValueEvent(p, 'change', (value) => {
        if (value >= ARRIVE) setArrived(true);
        else if (value < LEAVE) setArrived(false);
    });

    // The plates close in with the scroll and land on a spring, so they
    // overshoot a touch and settle: the snap into register.
    const register = useTransform(p, [0.45, 0.985], [0, 1], { clamp: true });
    const q = useSpring(register, { stiffness: 150, damping: 15, mass: 0.7 });
    const settled = useMotionValue(1);

    // Pointer parallax, mouse only.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const mx = useSpring(pointerX, { stiffness: 70, damping: 18 });
    const my = useSpring(pointerY, { stiffness: 70, damping: 18 });
    const onPointerMove = (event) => {
        if (event.pointerType !== 'mouse' || reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onPointerLeave = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    // Phones get shallower ridges so the sky band never reaches the copy.
    const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 767.98px)').matches);
    useEffect(() => {
        const query = window.matchMedia('(max-width: 767.98px)');
        const update = () => setCompact(query.matches);
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

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
            {/* The content sits a little below centre, under the sky band the ink leaves at the
                top; the copyright sits in the bottom row, clear of the dock. */}
            <div
                ref={sceneRef}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                className="contact-scene relative isolate grid min-h-screen grid-rows-[1.3fr_auto_1fr] justify-items-center overflow-hidden px-4 pb-24 pt-36 md:px-8 md:pt-40"
            >
                <ContactScene
                    sceneRef={sceneRef}
                    targetRef={ctaRef}
                    p={p}
                    mx={mx}
                    my={my}
                    arrived={arrived}
                    reduced={reduced}
                    compact={compact}
                />

                <div className="relative z-10 row-start-2 flex w-full max-w-2xl flex-col items-center text-center">
                    <Reveal from="up" duration={0.9} className="relative">
                        <Plate q={reduced ? settled : q} dx={-22} dy={14} className="text-primary-hover" />
                        <Plate q={reduced ? settled : q} dx={18} dy={-11} className="text-surface/30" />
                        <h2 id="contact-title" className={`relative text-surface ${headingClass}`}>
                            <HeadingText />
                        </h2>
                    </Reveal>
                    <Reveal from="up" delay={0.06}>
                        <p className="prose-measure mx-auto mt-6 font-body text-[14px] leading-[1.75] text-surface/80 md:text-[15px]">
                            Have an internship, a freelance brief, or just a question? Tell me what you’re
                            working on — my inbox is open.
                        </p>
                    </Reveal>

                    <Reveal from="up" blur={0} delay={0.12} className="mt-10 flex flex-col items-center">
                        <div ref={ctaRef}>
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
                                    className="overflow-hidden bg-white shadow-[0_18px_36px_-14px_rgba(2,8,40,0.6)]"
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
                                            className={`${pillClass} group text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary`}
                                        >
                                            <PenLine size={16} strokeWidth={2} aria-hidden="true" />
                                            {ctaLabel}
                                            {hasDraft && (
                                                <span
                                                    aria-hidden="true"
                                                    className="size-2 rounded-full bg-primary/80 shadow-[0_0_0_3px_rgba(8,36,169,0.15)]"
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
                                            className="flex h-14 items-center gap-3 pl-6 pr-2 font-mono text-[13px] font-bold tracking-[0.02em] text-primary"
                                        >
                                            <motion.span
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.3 }}
                                                className="grid size-6 place-items-center rounded-full bg-primary text-white"
                                            >
                                                <Check size={14} strokeWidth={3} aria-hidden="true" />
                                            </motion.span>
                                            <span className="whitespace-nowrap">Message sent.</span>
                                            <button
                                                ref={triggerRef}
                                                type="button"
                                                onClick={() => setStage('open')}
                                                className="ml-1 inline-flex h-10 items-center whitespace-nowrap rounded-full bg-primary/10 px-4 text-[12px] transition-colors duration-300 ease-soft hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                            >
                                                Write another
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
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
                                        className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-surface/30 bg-white/[0.06] px-4 font-mono text-[12px] font-bold tracking-[0.03em] text-surface transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(2,8,40,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0 active:scale-[0.97]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 origin-left scale-x-0 bg-surface transition-transform duration-300 ease-soft group-hover:scale-x-100"
                                        />
                                        <span className="relative flex items-center gap-2 transition-colors duration-300 ease-soft group-hover:text-primary">
                                            <FontAwesomeIcon icon={link.icon} aria-hidden="true" className="text-[14px]" />
                                            {link.label}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <p className="relative z-10 row-start-3 self-end pt-8 text-center font-mono text-[11px] text-surface/60">
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
