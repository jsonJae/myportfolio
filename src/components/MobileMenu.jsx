import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ArrowUpRight } from 'lucide-react';
import { CONTACT_EMAIL } from '../utils/sendMessage';

// Phones and small tablets (below md). The dock gives way to one button at the
// top right that opens the whole screen as the menu.
//
// Open: the button spills a disc of Ultramarine ink that spreads over the page
// as a lens (a circular clip-path centred on the button) and dries to Fog Paper,
// the same gesture as Kismet's panel. The section names then press from a faint
// wash to crisp ink in reading order, like the splash and the project cards.
// Close: the names lift off, and the page contracts back into the button,
// turning to ink again as it lands.

const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.65, 0, 0.35, 1];
const INK = '#0824A9';
const PAPER = '#EDF0F5';
const WASH = 'rgba(8, 36, 169, 0.18)';

const FOCUSABLE = 'a[href], button:not([disabled])';
const DESKTOP = '(min-width: 48rem)';

const socials = [
    { icon: faGithub, label: 'GitHub profile', href: 'https://github.com/jsonJae', external: true, size: 'text-[17px]' },
    {
        icon: faLinkedinIn,
        label: 'LinkedIn profile',
        href: 'https://www.linkedin.com/in/jason-gian-duran-4754a7355',
        external: true,
        size: 'text-[16px]',
    },
    { icon: faEnvelope, label: 'Send email', href: `mailto:${CONTACT_EMAIL}`, size: 'text-[14.5px]' },
];

const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
    exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

// Each name presses from a soft wash to its ink; the colour is the item's own.
const press = (color) => ({
    hidden: { opacity: 0, y: 22, color: WASH, filter: 'blur(3px)' },
    show: {
        opacity: 1,
        y: 0,
        color,
        filter: 'blur(0px)',
        transition: {
            y: { type: 'spring', stiffness: 260, damping: 26 },
            opacity: { duration: 0.3, ease: EASE_OUT },
            color: { duration: 0.7, ease: EASE_OUT, delay: 0.08 },
            filter: { duration: 0.6, ease: EASE_OUT },
        },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.14, ease: 'easeIn' } },
});

const rise = (delay) => ({
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT, delay } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
});

const fade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function MobileMenu({ items, active, onNavigate }) {
    const reduced = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [lens, setLens] = useState({ x: 0, y: 0, r: 0 });
    const toggleRef = useRef(null);
    const dialogRef = useRef(null);
    const pending = useRef(null);
    const wasOpen = useRef(false);
    const navigate = useRef(onNavigate);

    useEffect(() => {
        navigate.current = onNavigate;
    });

    // The lens is centred on the button and reaches the farthest corner.
    const measure = () => {
        const box = toggleRef.current.getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const w = window.innerWidth;
        const h = window.innerHeight;
        setLens({ x, y, r: Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 8 });
    };

    const toggle = () => {
        if (!open) measure();
        setOpen((value) => !value);
    };

    const go = (id) => {
        pending.current = id;
        setOpen(false);
    };

    // Lock the page behind the menu.
    useEffect(() => {
        if (!open) return undefined;
        const root = document.documentElement;
        const previous = root.style.overflow;
        root.style.overflow = 'hidden';
        return () => {
            root.style.overflow = previous;
        };
    }, [open]);

    // Focus moves into the menu as it opens and back to the button as it
    // closes. A chosen section scrolls into view while the lens contracts, so
    // the page arrives under it. This runs after the lock above is released.
    useEffect(() => {
        if (open) {
            wasOpen.current = true;
            const id = window.setTimeout(() => {
                dialogRef.current?.querySelector('[data-menu-item]')?.focus({ preventScroll: true });
            }, reduced ? 0 : 260);
            return () => window.clearTimeout(id);
        }
        if (!wasOpen.current) return undefined;
        wasOpen.current = false;
        toggleRef.current?.focus({ preventScroll: true });
        if (pending.current) {
            navigate.current(pending.current);
            pending.current = null;
        }
        return undefined;
    }, [open, reduced]);

    // A rotation while open would leave corners outside the lens.
    useEffect(() => {
        if (!open) return undefined;
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [open]);

    // Esc closes; Tab cycles between the button and the menu.
    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setOpen(false);
                return;
            }
            if (event.key !== 'Tab' || !dialogRef.current) return;
            const nodes = [toggleRef.current, ...dialogRef.current.querySelectorAll(FOCUSABLE)];
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open]);

    // Growing past md swaps the menu for the dock, so close it there.
    useEffect(() => {
        const query = window.matchMedia(DESKTOP);
        const onChange = () => query.matches && setOpen(false);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    const at = `at ${lens.x}px ${lens.y}px`;
    const shell = reduced
        ? fade
        : {
              hidden: { clipPath: `circle(24px ${at})`, backgroundColor: INK },
              show: {
                  clipPath: `circle(${lens.r}px ${at})`,
                  backgroundColor: PAPER,
                  transition: {
                      clipPath: { duration: 0.62, ease: EASE_OUT },
                      backgroundColor: { duration: 0.44, ease: EASE_OUT, delay: 0.05 },
                  },
              },
              exit: {
                  clipPath: `circle(24px ${at})`,
                  backgroundColor: INK,
                  transition: {
                      clipPath: { duration: 0.44, ease: EASE_IN_OUT, delay: 0.1 },
                      backgroundColor: { duration: 0.22, ease: 'easeIn', delay: 0.3 },
                  },
              },
          };

    return (
        <div className="md:hidden">
            <motion.button
                ref={toggleRef}
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                whileTap={reduced ? undefined : { scale: 0.92 }}
                // On close the button holds its ink until the lens lands on it.
                style={{ transitionDelay: open || reduced ? '0s' : '0.36s' }}
                className={`fixed right-4 top-[calc(1rem+env(safe-area-inset-top))] z-[66] grid size-12 place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                    open
                        ? 'border-primary bg-primary text-white shadow-[0_12px_28px_-12px_rgba(8,36,169,0.7)]'
                        : 'border-black/[0.08] bg-surface/80 text-ink shadow-[0_12px_36px_-8px_rgba(15,23,42,0.18)] backdrop-blur-md'
                }`}
            >
                <span aria-hidden="true" className="relative block h-3.5 w-[18px]">
                    {[-1, 1].map((side) => (
                        <motion.span
                            key={side}
                            initial={false}
                            animate={open ? { y: 0, rotate: side * 45 } : { y: side * 3.5, rotate: 0 }}
                            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 28 }}
                            className="absolute inset-x-0 top-1/2 -mt-[0.875px] block h-[1.75px] rounded-full bg-current"
                        />
                    ))}
                </span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="menu"
                        ref={dialogRef}
                        id="site-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site menu"
                        variants={shell}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-surface"
                    >
                        <div className="flex min-h-full flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
                            {/* Shares the button's row. */}
                            <motion.p
                                variants={reduced ? fade : rise(0.28)}
                                aria-hidden="true"
                                className="flex h-12 items-center font-display text-[30px] italic leading-none tracking-[-0.02em] text-primary"
                            >
                                Jason.
                            </motion.p>

                            <nav aria-label="Sections" className="flex flex-1 flex-col justify-center py-8">
                                <motion.ul variants={reduced ? undefined : list} className="flex flex-col">
                                    {items.map((item) => {
                                        const current = item.id === active;
                                        return (
                                            <li key={item.id}>
                                                <motion.button
                                                    type="button"
                                                    data-menu-item
                                                    onClick={() => go(item.id)}
                                                    aria-current={current ? 'location' : undefined}
                                                    variants={reduced ? fade : press(current ? INK : 'rgba(0, 0, 0, 0.88)')}
                                                    whileTap={reduced ? undefined : { x: 6 }}
                                                    className={`flex min-h-12 w-full items-center gap-3 py-1 text-left font-display text-[min(clamp(2.75rem,12.5vw,4rem),7.5svh)] leading-[1.02] tracking-[-0.02em] focus-visible:outline-none focus-visible:underline focus-visible:decoration-1 focus-visible:underline-offset-[0.14em] ${
                                                        current ? 'italic text-primary' : 'text-ink/[0.88]'
                                                    }`}
                                                >
                                                    {item.label}
                                                    {current && (
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-[0.2em] size-2 shrink-0 rounded-full bg-primary"
                                                        />
                                                    )}
                                                </motion.button>
                                            </li>
                                        );
                                    })}
                                </motion.ul>
                            </nav>

                            <motion.div variants={reduced ? fade : rise(0.5)} className="flex flex-wrap items-center gap-3">
                                <a
                                    href="/DURAN-RESUME.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Resume (PDF, opens in a new tab)"
                                    className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-primary/35 bg-white/60 px-5 font-mono text-[13px] font-bold tracking-[0.03em] text-primary shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.97]"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100 group-active:scale-x-100"
                                    />
                                    <span className="relative inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-white group-active:text-white">
                                        <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                                        Resume
                                    </span>
                                </a>
                                <ul className="flex items-center gap-3">
                                    {socials.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                aria-label={link.label}
                                                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                                className="group relative grid size-11 place-items-center overflow-hidden rounded-full border border-primary/25 bg-white/60 text-ink/75 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[transform,color] duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95"
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100 group-active:scale-x-100"
                                                />
                                                <FontAwesomeIcon
                                                    icon={link.icon}
                                                    aria-hidden="true"
                                                    className={`relative ${link.size} transition-colors duration-300 group-hover:text-white group-active:text-white`}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
