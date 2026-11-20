import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Reveal from './Reveal';
import ProjectSheet from './ProjectSheet';
import ProjectProof from './ProjectProof';
import { ProjectMedia, ProjectMeta, ProjectTitleText, StackMarks } from './ProjectParts';
import { projects } from '../data/projects';

// A card and its sheet share layoutIds (shell, image, title), so the card
// grows into the sheet and folds back into its slot. Same spring as the
// contact pill → compose window.
const morph = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 };

// Printing runs this long once it starts; then the card settles.
const PRINT_SECONDS = 2.6;
// The press waits for the cover to be downloaded and decoded, so the brayer
// always reveals a real picture. On a slow network it waits at most this long,
// then prints onto the blank sheet and the picture fades in when it arrives.
const PRINT_WAIT = 1.4;

// Warm every cover once the page is idle, so most cards are ready long before
// anyone scrolls to them.
let coversWarmed = false;
function warmCovers() {
    if (coversWarmed) return;
    coversWarmed = true;
    const run = () =>
        projects.forEach((p) => {
            if (!p.images?.[0]?.src) return;
            const img = new Image();
            img.decoding = 'async';
            img.src = p.images[0].src;
        });
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
    else window.setTimeout(run, 2000);
}

function ProjectCard({ project, state, run, delay, onOpen, near = false, onImageReady, ghost = false }) {
    const id = (part) => (ghost ? undefined : `project-${part}${project.id}`);
    // Ongoing work with no screenshots yet prints its own proof instead.
    const proof = project.ongoing && !project.images.length;

    return (
        <motion.article
            layoutId={id('')}
            transition={{ layout: morph }}
            data-state={state}
            data-run={run ? 'true' : 'false'}
            aria-hidden={ghost || undefined}
            inert={ghost || undefined}
            style={{ borderRadius: 24, '--card-delay': `${delay}s` }}
            className={`project-card group/card relative flex h-full flex-col overflow-hidden border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[translate,border-color,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_24px_48px_-28px_rgba(8,36,169,0.45)] ${
                ghost ? 'invisible' : ''
            }`}
        >
            <motion.div
                layoutId={id('media-')}
                transition={{ layout: morph }}
                style={{ borderRadius: 0 }}
                className="press-paper relative aspect-video overflow-hidden border-b border-primary/10"
            >
                <div
                    className={`${proof ? '' : 'press-print '}absolute inset-0 transition-transform duration-700 ease-soft group-hover/card:scale-[1.03]`}
                >
                    {proof ? (
                        <ProjectProof state={state} />
                    ) : (
                        <ProjectMedia image={project.images[0]} eager={near} onReady={onImageReady} />
                    )}
                </div>
                {!proof && (
                    <span className="press-roller">
                        <span className="press-brayer" />
                    </span>
                )}
            </motion.div>

            <div className="flex flex-1 flex-col px-6 pb-6 pt-7 md:px-8 md:pb-7 md:pt-8">
                <motion.h3
                    layoutId={id('title-')}
                    transition={{ layout: morph }}
                    className="w-fit font-display text-[clamp(34px,10vw,42px)] leading-[0.95] tracking-[-0.015em] text-primary md:text-[clamp(38px,4vw,50px)]"
                >
                    <ProjectTitleText project={project} />
                </motion.h3>

                <ProjectMeta project={project} className="mt-4" />

                <p className="mt-4 font-body text-[13px] leading-[1.75] text-ink-soft text-pretty md:text-[14px]">
                    {project.summary}
                </p>

                <div className="mt-auto pt-6">
                    <div className="flex items-center justify-between gap-4 border-t border-black/[0.06] pt-4">
                        <StackMarks tags={project.tags} onOpen={ghost ? undefined : onOpen} className="min-w-0" />
                        <span
                            aria-hidden="true"
                            className="relative inline-flex h-9 shrink-0 items-center overflow-hidden rounded-full border border-primary/25 px-3.5 font-mono text-[11px] font-bold tracking-[0.03em] text-primary"
                        >
                            <span className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-soft group-hover/card:scale-x-100" />
                            <span className="relative flex items-center gap-1.5 transition-colors duration-300 ease-soft group-hover/card:text-white">
                                Details
                                <Plus
                                    size={13}
                                    strokeWidth={2.25}
                                    className="transition-transform duration-300 ease-soft group-hover/card:rotate-90"
                                />
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {!ghost && (
                // One button covers the card, so the whole card opens the sheet
                // while keyboard and screen-reader users get a single named control.
                <button
                    type="button"
                    data-project-trigger={project.id}
                    onClick={onOpen}
                    aria-haspopup="dialog"
                    aria-label={`View ${project.name} details`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                />
            )}
        </motion.article>
    );
}

function ProjectItem({ project, index, open, onOpen }) {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    // The cover switches to eager loading well before the card is on screen,
    // and the press waits for that visible image to be decoded.
    const near = useInView(ref, { once: true, margin: '900px 0px 900px 0px' });
    const inView = useInView(ref, { once: true, amount: 0.3 });
    // Looping press work (an ongoing proof) pauses while the card is off-screen.
    const onScreen = useInView(ref);
    const [ready, setReady] = useState(!project.images?.[0]);
    const onImageReady = useCallback(() => setReady(true), []);
    const [waited, setWaited] = useState(false);
    const [settled, setSettled] = useState(false);
    const delay = (index % 2) * 0.14;

    useEffect(() => {
        if (!inView || ready || reduced) return undefined;
        const timer = window.setTimeout(() => setWaited(true), PRINT_WAIT * 1000);
        return () => window.clearTimeout(timer);
    }, [inView, ready, reduced]);

    const printing = inView && (ready || waited);

    useEffect(() => {
        if (!printing || reduced) return undefined;
        const timer = window.setTimeout(() => setSettled(true), (delay + PRINT_SECONDS) * 1000);
        return () => window.clearTimeout(timer);
    }, [printing, reduced, delay]);

    const state = reduced || settled ? 'live' : printing ? 'printing' : 'idle';

    return (
        <li
            ref={ref}
            className="h-full md:last:odd:col-span-2 md:last:odd:mx-auto md:last:odd:w-[calc(50%-1rem)]"
        >
            {/* While open, an invisible copy holds the card's slot. */}
            <ProjectCard
                key={open ? 'ghost' : 'card'}
                ghost={open}
                project={project}
                state={state}
                run={onScreen}
                delay={delay}
                onOpen={onOpen}
                near={near}
                onImageReady={onImageReady}
            />
        </li>
    );
}

export default function Projects() {
    const [openId, setOpenId] = useState(null);

    useEffect(() => {
        warmCovers();
    }, []);
    const returnTo = useRef(null);
    const openProject = projects.find((project) => project.id === openId);

    // When the sheet folds back, hand focus to the card it came from.
    useEffect(() => {
        if (openId || !returnTo.current) return undefined;
        const id = returnTo.current;
        returnTo.current = null;
        const timer = window.setTimeout(() => {
            document.querySelector(`[data-project-trigger="${id}"]`)?.focus({ preventScroll: true });
        }, 50);
        return () => window.clearTimeout(timer);
    }, [openId]);

    const close = () => {
        returnTo.current = openId;
        setOpenId(null);
    };

    return (
        <MotionConfig reducedMotion="user">
            <div className="flex min-h-screen flex-col justify-center px-4 py-24 md:px-8">
                <Reveal from="up" duration={0.9}>
                    <div className="text-center">
                        <h2
                            id="projects-title"
                            className="font-display text-[48px] leading-[0.92] tracking-[-0.02em] text-primary heading-balance md:text-[80px]"
                        >
                            <span className="font-normal italic">curated</span> works.
                        </h2>
                    </div>
                </Reveal>
                <Reveal from="up" delay={0.08}>
                    <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                        Selected work across machine learning and full-stack web, built solo, during an internship, and with teams at UPLB and YSES.
                    </p>
                </Reveal>

                <ul className="mx-auto mt-14 grid w-full max-w-xl grid-cols-1 gap-6 md:mt-16 md:max-w-5xl md:grid-cols-2 md:gap-8">
                    {projects.map((project, index) => (
                        <ProjectItem
                            key={project.id}
                            project={project}
                            index={index}
                            open={project.id === openId}
                            onOpen={() => setOpenId(project.id)}
                        />
                    ))}
                </ul>
            </div>

            {createPortal(
                <AnimatePresence>
                    {openProject && <ProjectSheet key={openProject.id} project={openProject} onClose={close} />}
                </AnimatePresence>,
                document.body,
            )}
        </MotionConfig>
    );
}
