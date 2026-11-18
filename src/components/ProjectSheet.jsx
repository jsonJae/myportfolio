import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, X, ZoomIn } from 'lucide-react';
import { ProjectMedia, ProjectMeta, ProjectTitleText } from './ProjectParts';

const morph = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 };
const ease = [0.16, 1, 0.3, 1];

// Everything that is not shared with the card fades in once the morph is
// under way, and leaves first on the way back.
const settle = (delay = 0.18) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.4, ease } },
    exit: { opacity: 0, transition: { duration: 0.08 } },
});

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

// The loupe: lens diameter in px, and how far it magnifies the print. A small
// lens at a light 1.35x reads as a close look rather than a blow-up, keeps the
// surrounding UI in view, and stays crisp because the source screenshots are
// about 2.4x the print.
const LENS = 160;
const ZOOM = 1.35;

const pad = (value) => String(value).padStart(2, '0');

// Marks a scroller as scrolled, which turns on its top fade (see .sheet-scroll).
const markScrolled = (event) => {
    const scrolled = event.currentTarget.scrollTop > 8 ? 'true' : 'false';
    if (event.currentTarget.dataset.scrolled !== scrolled) event.currentTarget.dataset.scrolled = scrolled;
};

// Marks content that has not been supplied yet, so it is easy to spot and
// replace. Remove by filling the matching field in src/data/projects.js.
function Placeholder({ children }) {
    return (
        <p className="rounded-[14px] border border-dashed border-primary/30 bg-primary/[0.03] px-4 py-3.5 font-mono text-[12px] leading-[1.7] text-primary/75">
            <span className="font-bold">Placeholder.</span> {children}
        </p>
    );
}

function LinkPill({ href, icon, label, solid = false }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={`group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full border px-5 font-mono text-[12px] font-bold tracking-[0.03em] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(8,36,169,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97] ${
                solid ? 'border-primary bg-primary text-white' : 'border-primary/25 bg-white text-primary'
            }`}
        >
            <span
                aria-hidden="true"
                className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-soft group-hover:scale-x-100 ${
                    solid ? 'bg-primary-hover' : 'bg-primary'
                }`}
            />
            <span className="relative flex items-center gap-2 transition-colors duration-300 ease-soft group-hover:text-white">
                {icon}
                {label}
                <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
            </span>
        </a>
    );
}

// Two links share one row at equal width; a lone link keeps its own width.
function Links({ project }) {
    return (
        <div className={project.live ? 'grid grid-cols-2 gap-2.5' : 'flex'}>
            {project.live && (
                <LinkPill
                    solid
                    href={project.live}
                    label="Live app"
                    icon={<Globe size={14} strokeWidth={2} aria-hidden="true" />}
                />
            )}
            {project.github ? (
                <LinkPill
                    href={project.github}
                    label="GitHub"
                    icon={<FontAwesomeIcon icon={faGithub} aria-hidden="true" className="text-[14px]" />}
                />
            ) : (
                <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-primary/35 px-5 font-mono text-[12px] font-bold tracking-[0.03em] text-primary/60">
                    <FontAwesomeIcon icon={faGithub} aria-hidden="true" className="text-[14px]" />
                    GitHub link pending
                </span>
            )}
        </div>
    );
}

function TurnButton({ direction, onClick }) {
    const Icon = direction > 0 ? ArrowRight : ArrowLeft;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={direction > 0 ? 'Next image' : 'Previous image'}
            className="group relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-primary/25 bg-white text-primary shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-6px_rgba(8,36,169,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-95"
        >
            <span
                aria-hidden="true"
                className={`absolute inset-0 scale-x-0 bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100 ${
                    direction > 0 ? 'origin-left' : 'origin-right'
                }`}
            />
            <Icon
                size={16}
                strokeWidth={2.25}
                aria-hidden="true"
                className="relative transition-colors duration-300 ease-soft group-hover:text-white"
            />
        </button>
    );
}

// The left page: one large print of the current screenshot, turned with the
// same brayer that prints the cards, plus a loupe for reading small UI text.
function Viewer({ project, view, onStep, onGo, onSettled }) {
    const { images } = project;
    const count = images.length;
    const image = images[view.index];
    const hostRef = useRef(null);
    const frameRef = useRef(null);
    const lensRef = useRef(null);
    const swipe = useRef(null);

    const moveLens = (event) => {
        if (event.pointerType !== 'mouse' || !image) return;
        const frame = frameRef.current;
        const lens = lensRef.current;
        if (!frame || !lens) return;
        const rect = frame.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        lens.style.transform = `translate3d(${x - LENS / 2}px, ${y - LENS / 2}px, 0)`;
        const glass = lens.firstElementChild;
        glass.style.backgroundSize = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
        glass.style.backgroundPosition = `${LENS / 2 - x * ZOOM}px ${LENS / 2 - y * ZOOM}px`;
        hostRef.current.dataset.loupe = 'true';
    };

    const hideLens = () => {
        if (hostRef.current) hostRef.current.dataset.loupe = 'false';
    };

    // Swipe between images on touch; vertical drags still scroll the sheet.
    const onPointerDown = (event) => {
        if (event.pointerType === 'mouse') return;
        swipe.current = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start || count < 2) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) onStep(dx < 0 ? 1 : -1);
    };

    return (
        <figure className="flex w-full flex-col">
            <div
                ref={hostRef}
                data-loupe="false"
                onPointerMove={moveLens}
                onPointerLeave={hideLens}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (swipe.current = null)}
                className="loupe-host relative mx-auto w-full touch-pan-y lg:w-[min(100%,calc((100dvh-3rem-15rem)*16/9))]"
            >
                <motion.div
                    ref={frameRef}
                    layoutId={`project-media-${project.id}`}
                    transition={{ layout: morph }}
                    style={{ borderRadius: 10 }}
                    className="relative aspect-video w-full overflow-hidden bg-white shadow-[0_0_0_1px_rgba(8,36,169,0.08),0_28px_56px_-30px_rgba(8,36,169,0.55),0_2px_6px_rgba(15,23,42,0.06)]"
                >
                    {view.prev !== null && images[view.prev] && <ProjectMedia image={images[view.prev]} />}
                    <div
                        key={view.key}
                        data-dir={view.dir}
                        onAnimationEnd={(event) => {
                            if (event.target === event.currentTarget) onSettled();
                        }}
                        className={`absolute inset-0 ${view.key ? 'turn-layer' : ''}`}
                    >
                        <ProjectMedia image={image} label="Project images" plain />
                    </div>
                    {view.key > 0 && (
                        <span key={`roller-${view.key}`} data-dir={view.dir} aria-hidden="true" className="turn-roller">
                            <span className="press-brayer" />
                        </span>
                    )}
                </motion.div>

                {image && (
                    <span ref={lensRef} aria-hidden="true" className="loupe">
                        <span className="loupe-glass" style={{ backgroundImage: `url(${image.src})` }}>
                            <span className="loupe-cross" />
                        </span>
                    </span>
                )}
            </div>

            <motion.div {...settle(0.2)} className="mx-auto w-full lg:w-[min(100%,calc((100dvh-3rem-15rem)*16/9))]">
                {count ? (
                    <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
                        {count > 1 && (
                            <p className="order-1 font-mono text-[12px] tabular-nums text-primary lg:pt-[3px]">
                                <span className="font-bold">{pad(view.index + 1)}</span>
                                <span className="text-primary/45"> / {pad(count)}</span>
                            </p>
                        )}
                        <figcaption
                            key={view.index}
                            aria-hidden="true"
                            className={`caption-in order-3 min-w-0 font-mono text-[11.5px] leading-[1.65] text-ink-soft text-pretty lg:order-2 ${
                                count > 1 ? 'col-span-2 lg:col-span-1' : 'col-span-2 lg:col-span-3'
                            }`}
                        >
                            {image.alt}
                        </figcaption>
                        {count > 1 && (
                            <div className="order-2 flex shrink-0 gap-2 lg:order-3">
                                <TurnButton direction={-1} onClick={() => onStep(-1)} />
                                <TurnButton direction={1} onClick={() => onStep(1)} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-5">
                        <Placeholder>Screenshots of the project go here.</Placeholder>
                    </div>
                )}

                {/* Thumbnails on the left; the loupe hint holds the right end of
                    the row, so it stays put while captions change. */}
                {count > 0 && (
                    <div className="mt-5 flex items-center justify-between gap-4">
                        {count > 1 ? (
                    <ul aria-label={`${project.name} images`} className="-m-1 flex min-w-0 gap-2.5 overflow-x-auto p-1">
                        {images.map((thumb, index) => (
                            <li key={thumb.src} className="shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onGo(index)}
                                    aria-label={`Show image ${index + 1} of ${count}`}
                                    aria-pressed={view.index === index}
                                    className={`relative block aspect-video w-[84px] overflow-hidden rounded-[6px] ring-offset-2 ring-offset-[#f5f7fb] transition-[opacity,box-shadow] duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                        view.index === index ? 'ring-2 ring-primary' : 'opacity-55 hover:opacity-100'
                                    }`}
                                >
                                    <ProjectMedia image={thumb} compact />
                                </button>
                            </li>
                        ))}
                    </ul>
                        ) : (
                            <span />
                        )}
                        <p className="loupe-hint shrink-0 items-center gap-1.5 font-mono text-[11px] text-primary/70">
                            <ZoomIn size={13} strokeWidth={2} aria-hidden="true" />
                            Hover the image to inspect
                        </p>
                    </div>
                )}
            </motion.div>
        </figure>
    );
}

export default function ProjectSheet({ project, onClose }) {
    const reduced = useReducedMotion();
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const [view, setView] = useState({ index: 0, prev: null, dir: 'next', key: 0 });
    const titleId = `project-sheet-title-${project.id}`;
    const count = project.images.length;

    const turn = (next, dir) =>
        setView((current) =>
            next === current.index
                ? current
                : { index: next, prev: reduced ? null : current.index, dir, key: current.key + 1 },
        );
    const step = (direction) => {
        if (count < 2) return;
        turn((view.index + direction + count) % count, direction > 0 ? 'next' : 'back');
    };
    const goTo = (index) => turn(index, index > view.index ? 'next' : 'back');
    const settled = () => setView((current) => ({ ...current, prev: null }));

    // Lock page scroll behind the sheet, warm every screenshot so a page turn
    // never reveals a blank, and move focus in once the morph has mostly landed.
    useEffect(() => {
        const root = document.documentElement;
        const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
        const gutter = window.innerWidth - root.clientWidth;
        root.style.overflow = 'hidden';
        if (gutter > 0) root.style.paddingRight = `${gutter}px`;
        project.images.forEach((image) => {
            const preload = new Image();
            preload.src = image.src;
        });
        const id = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 280);
        return () => {
            window.clearTimeout(id);
            root.style.overflow = previous.overflow;
            root.style.paddingRight = previous.paddingRight;
        };
    }, [project.images]);

    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
            return;
        }
        if (count > 1 && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
            step(event.key === 'ArrowRight' ? 1 : -1);
            return;
        }
        // Keep Tab inside the sheet while it is open.
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

    return (
        <div className="fixed inset-0 z-[70] flex items-stretch justify-center p-2 sm:items-center sm:p-4 lg:p-6">
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
                aria-labelledby={titleId}
                layoutId={`project-${project.id}`}
                transition={{ layout: morph }}
                style={{ borderRadius: 24 }}
                onKeyDown={onKeyDown}
                onPointerMove={(event) => {
                    // A mouse is in use: reveal the loupe hint (see .loupe-hint).
                    const dialog = event.currentTarget;
                    if (event.pointerType === 'mouse' && dialog.dataset.mouse !== 'true') dialog.dataset.mouse = 'true';
                }}
                className="relative flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden bg-white shadow-[0_40px_100px_-30px_rgba(8,36,169,0.55)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl lg:max-h-[calc(100dvh-3rem)] lg:w-[min(1240px,calc(100vw-3rem))] lg:max-w-none"
            >
                {/* Phones and tablets scroll the whole sheet; desktop opens it as a
                    spread, where the print stays put and only the text page scrolls. */}
                <motion.div
                    layoutScroll
                    onScroll={markScrolled}
                    className="sheet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(340px,34%,430px)] lg:overflow-hidden"
                >
                    <section
                        aria-label={`${project.name} images`}
                        className="press-paper relative flex flex-col justify-center overflow-hidden px-4 pb-7 pt-16 sm:px-7 lg:border-r lg:border-primary/10 lg:px-10 lg:py-10"
                    >
                        <span aria-hidden="true" className="press-crop" />
                        <Viewer project={project} view={view} onStep={step} onGo={goTo} onSettled={settled} />
                    </section>

                    <div className="@container relative lg:min-h-0">
                        <motion.div layoutScroll onScroll={markScrolled} className="page-scroll lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-16 lg:overflow-y-auto lg:overscroll-contain">
                            <div className="px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pb-12 lg:pt-3">
                                <motion.h3
                                    id={titleId}
                                    layoutId={`project-title-${project.id}`}
                                    transition={{ layout: morph }}
                                    className="w-fit font-display text-[clamp(32px,11cqi,46px)] leading-[0.95] tracking-[-0.035em] text-primary"
                                >
                                    <ProjectTitleText project={project} />
                                </motion.h3>

                                <motion.div {...settle(0.22)}>
                                    {/* Header facts: who it was for, then the stack, set
                                        the way the card sets them. */}
                                    <ProjectMeta project={project} className="mt-4" />
                                    <p className="mt-2 font-mono text-[11px] leading-[1.7] text-muted md:text-[12px]">
                                        <span className="sr-only">Tags: </span>
                                        {project.tags.join(' / ')}
                                    </p>

                                    <div className="mt-6">
                                        <Links project={project} />
                                    </div>

                                    {/* The summary leads; it needs no label. */}
                                    <p className="mt-8 font-body text-[15px] leading-[1.75] text-ink/85 text-pretty">
                                        {project.summary}
                                    </p>

                                    <section aria-labelledby={`${titleId}-did`} className="mt-10">
                                        <h4
                                            id={`${titleId}-did`}
                                            className="font-display text-[28px] font-black leading-none tracking-[-0.03em] text-primary"
                                        >
                                            <span className="font-normal italic">what</span> I did.
                                        </h4>
                                        {project.details ? (
                                            <ul className="mt-4 divide-y divide-black/[0.07] border-y border-black/[0.07]">
                                                {project.details.map((point) => (
                                                    <li
                                                        key={point}
                                                        className="flex gap-3 py-3.5 font-body text-[13.5px] leading-[1.7] text-ink-soft text-pretty"
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className="mt-[0.72em] h-1 w-1 shrink-0 rounded-full bg-primary"
                                                        />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="mt-4">
                                                <Placeholder>
                                                    Key contributions, decisions, and results go here, one per line.
                                                </Placeholder>
                                            </div>
                                        )}
                                    </section>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close project details"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.24, duration: 0.3, ease } }}
                    exit={{ opacity: 0, transition: { duration: 0.08 } }}
                    className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-black/[0.06] bg-white text-primary shadow-[0_8px_20px_-8px_rgba(8,36,169,0.4)] transition-colors duration-300 ease-soft hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-4 sm:top-4"
                >
                    <X size={18} strokeWidth={2} aria-hidden="true" />
                </motion.button>
            </motion.div>
        </div>
    );
}
