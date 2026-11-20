import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import PhotoReel from './beyond/PhotoReel';
import WordReel from './beyond/WordReel';
import PhotoViewer from './beyond/PhotoViewer';
import { chapters, coda, photos } from '../data/beyond';

const ease = [0.16, 1, 0.3, 1];

// Deal the chapters round-robin so neighbouring prints show different sides.
const dealOrder = () => {
    const piles = chapters.map((chapter) =>
        photos.map((photo, index) => (photo.chapter === chapter.id ? index : -1)).filter((i) => i >= 0),
    );
    const order = [];
    while (order.length < photos.length) piles.forEach((pile) => pile.length && order.push(pile.shift()));
    return order;
};
const TOP_ROW = dealOrder();
// The lower row runs the other way, starting half a loop on so the two rows
// open on different prints.
const BOTTOM_ROW = [...TOP_ROW.slice(7), ...TOP_ROW.slice(0, 7)];

const Spark = () => (
    <svg viewBox="0 0 24 24" className="mx-[0.35em] size-[0.42em] shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
    </svg>
);

// Beyond the code: two reels of Jason's own photos running in opposite
// directions, with a ribbon of what they're about running between them.
export default function Beyond() {
    const reduced = useReducedMotion();
    const [viewing, setViewing] = useState(null);
    const returnTo = useRef(null);

    const open = (index, trigger) => {
        returnTo.current = trigger;
        setViewing(index);
    };

    useEffect(() => {
        if (viewing !== null || !returnTo.current) return undefined;
        const target = returnTo.current;
        returnTo.current = null;
        const id = window.setTimeout(() => target.focus?.({ preventScroll: true }), 50);
        return () => window.clearTimeout(id);
    }, [viewing]);

    return (
        <MotionConfig reducedMotion="user">
            <div className="flex min-h-screen flex-col justify-center overflow-x-clip py-24">
                <div className="px-4 md:px-8">
                    <Reveal from="up" duration={0.9}>
                        <h2
                            id="beyond-title"
                            className="text-center font-display text-[48px] leading-[0.92] tracking-[-0.02em] text-primary heading-balance md:text-[80px]"
                        >
                            <span className="font-normal italic">beyond</span> the code.
                        </h2>
                    </Reveal>
                    <Reveal from="up" delay={0.08}>
                        <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                            Software is what I do. These are the parts of me that shape how I do it, and they add up to me.
                        </p>
                    </Reveal>
                </div>

                <p className="sr-only">
                    {chapters.map((c) => `I ${c.verb} ${c.rest} ${c.note}`).join(' ')} And {coda.em} {coda.rest}
                </p>

                <div className="relative mt-10 md:mt-14">
                    <PhotoReel
                        photos={photos}
                        order={TOP_ROW}
                        speed={42}
                        reduced={reduced}
                        onOpen={open}
                        label="Photos from beyond the code. Tab through them, Enter opens one."
                    />

                    {/* The ribbon: a strip of ink laid across the reels at a tilt */}
                    {/* The in-view trigger sits on an unclipped wrapper: a fully
                        clipped element never counts as intersecting. */}
                    <motion.div
                        initial="hidden"
                        whileInView="shown"
                        viewport={{ once: true, amount: 0.4 }}
                        className="relative z-10 -mx-[6vw] -mb-12 -mt-3 -rotate-[2.5deg] md:-mb-14 md:-mt-4"
                    >
                        <motion.div
                            variants={{
                                hidden: { clipPath: 'inset(0% 50% 0% 50%)' },
                                shown: { clipPath: 'inset(0% 0% 0% 0%)' },
                            }}
                            transition={{ duration: 1.1, ease, delay: 0.15 }}
                            className="bg-primary py-2.5 text-white shadow-[0_18px_36px_-20px_rgba(8,36,169,0.65)] md:py-3.5"
                        >
                            <WordReel speed={-64} reduced={reduced}>
                                {chapters.map((c) => (
                                    <Fragment key={c.id}>
                                        <span className="whitespace-nowrap font-display text-[48px] leading-[1.1] tracking-[-0.02em] md:text-[80px] lg:text-[96px]">
                                            I <span className="font-normal italic">{c.verb}</span> {c.rest}
                                        </span>
                                        <Spark />
                                    </Fragment>
                                ))}
                                <Fragment key="coda">
                                    <span className="whitespace-nowrap font-display text-[48px] leading-[1.1] tracking-[-0.02em] md:text-[80px] lg:text-[96px]">
                                        {coda.lead} <span className="font-normal italic">{coda.em}</span> {coda.rest}
                                    </span>
                                    <Spark />
                                </Fragment>
                            </WordReel>
                        </motion.div>
                    </motion.div>

                    <PhotoReel photos={photos} order={BOTTOM_ROW} speed={30} reduced={reduced} onOpen={open} decorative />
                </div>

                <p className="mt-6 px-4 text-center font-mono text-[10px] leading-[1.5] text-muted md:text-[11px]">
                    <span className="hidden [@media(hover:hover)]:inline">Scroll to spin the reels, drag to scrub, click a print to open it.</span>
                    <span className="[@media(hover:hover)]:hidden">Swipe the reels sideways, tap a print to open it.</span>
                </p>
            </div>

            {createPortal(
                <AnimatePresence>
                    {viewing !== null && (
                        <PhotoViewer
                            key="viewer"
                            photos={photos}
                            chapters={chapters}
                            index={viewing}
                            onIndex={setViewing}
                            onClose={() => setViewing(null)}
                        />
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </MotionConfig>
    );
}
