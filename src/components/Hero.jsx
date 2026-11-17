import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroPic from '../assets/HeroPic.png';
import heroCutout from '../assets/HeroCutout.webp';
import Ridges from './Ridges';

gsap.registerPlugin(ScrollTrigger);

const GREETING = ['Hey,', 'I’m'];
const NAME = 'Jason.'.split('');

// Cursor proximity weight for the name: resting ink vs. pressed ink.
const WEIGHT_REST = 600;
const WEIGHT_PEAK = 900;
const WEIGHT_RADIUS = 260;

// The cutout covers the top 400px of the 644px source photo.
const CUTOUT_HEIGHT = `${(400 / 644) * 100}%`;

const sweepMask = {
    WebkitMaskImage: `url(${heroCutout})`,
    maskImage: `url(${heroCutout})`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
};

const outlineMask = {
    WebkitMaskImage: `url(${heroCutout})`,
    maskImage: `url(${heroCutout})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
};

export default function Hero() {
    const rootRef = useRef(null);
    const depthRef = useRef(null);
    const scrollRefs = useRef([]);
    const parallaxRefs = useRef([]);
    const floatRefs = useRef([]);
    const sweepRef = useRef(null);
    const cutoutRef = useRef(null);
    const outlineRef = useRef(null);
    // Two copies of the headline: [0] filled ink behind Jason, [1] outline in front of him.
    const headlineScrollRefs = useRef([]);
    const headlineDriftRefs = useRef([]);
    const greetingRefs = useRef([[], []]);
    const nameRefs = useRef([[], []]);
    const maskRefs = useRef([]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const mm = gsap.matchMedia();
        const greeting = greetingRefs.current.flat();
        const name = nameRefs.current.flat();
        const staggerBy = (step, count) => (i) => (i % count) * step;

        // Keep the outline layer masked to Jason's silhouette wherever the cutout
        // has moved to (intro, float, parallax, scroll), so the outline only
        // appears over the parts of the name he covers.
        const outline = outlineRef.current;
        const cutout = cutoutRef.current;
        const syncMask = () => {
            const frame = outline.getBoundingClientRect();
            if (frame.bottom < 0) return;
            const shape = cutout.getBoundingClientRect();
            const position = `${shape.left - frame.left}px ${shape.top - frame.top}px`;
            const size = `${shape.width}px ${shape.height}px`;
            outline.style.webkitMaskPosition = position;
            outline.style.maskPosition = position;
            outline.style.webkitMaskSize = size;
            outline.style.maskSize = size;
        };
        syncMask();
        gsap.ticker.add(syncMask);

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const plates = parallaxRefs.current;
            const breath = floatRefs.current;
            const sweep = sweepRef.current;
            const masks = maskRefs.current;

            gsap.set(plates, { clipPath: 'inset(100% 0% 0% 0%)', y: 56, opacity: 0 });
            gsap.set(breath, { scale: 1.05 });
            gsap.set(sweep, { xPercent: -140, opacity: 0 });
            // Clip each line only while its letters rise; the generous side and
            // bottom margins keep the italic overhangs and the J's tail intact.
            gsap.set(masks, { clipPath: 'inset(-0.4em -0.5em -0.2em -0.5em)' });
            gsap.set(greeting, { yPercent: 120, rotate: 4 });
            gsap.set(name, { yPercent: 115, rotate: 7, transformOrigin: '0% 100%' });
            gsap.set(outline, { opacity: 0 });

            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .to(
                    plates,
                    {
                        opacity: 1,
                        y: 0,
                        clipPath: 'inset(0% 0% 0% 0%)',
                        duration: 1.2,
                        ease: 'power4.inOut',
                    },
                    0,
                )
                .to(breath, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0)
                .to(
                    greeting,
                    {
                        yPercent: 0,
                        rotate: 0,
                        duration: 1,
                        ease: 'expo.out',
                        stagger: staggerBy(0.09, GREETING.length),
                    },
                    0.45,
                )
                .to(
                    name,
                    {
                        yPercent: 0,
                        rotate: 0,
                        duration: 1.3,
                        ease: 'expo.out',
                        stagger: staggerBy(0.065, NAME.length),
                    },
                    0.62,
                )
                .set(masks, { clipPath: 'none' })
                // Once Jason has fully risen in front of the name, trace what he hides.
                .to(outline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.25)
                .to(
                    sweep,
                    { xPercent: 140, opacity: 0.55, duration: 1.6, ease: 'power2.inOut' },
                    0.4,
                )
                .to(sweep, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 1.85);

            gsap.to(breath, {
                y: -9,
                duration: 4.8,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: 1.5,
            });

            const scrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.7 };

            gsap.to(scrollRefs.current, {
                yPercent: 10,
                scale: 0.94,
                ease: 'none',
                scrollTrigger: scrub,
            });

            // Fade the stacked plates as one group so their overlap never doubles up.
            gsap.to(depthRef.current, { opacity: 0.55, ease: 'none', scrollTrigger: scrub });

            // The name lifts away faster than the portrait sinks, splitting the planes.
            gsap.to(headlineScrollRefs.current, {
                y: () => -window.innerHeight * 0.32,
                opacity: 0,
                ease: 'none',
                scrollTrigger: { ...scrub, end: '70% top', invalidateOnRefresh: true },
            });
        });

        mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
            const plateX = parallaxRefs.current.map((el) =>
                gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
            );
            const plateY = parallaxRefs.current.map((el) =>
                gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
            );
            const typeX = headlineDriftRefs.current.map((el) =>
                gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
            );
            const typeY = headlineDriftRefs.current.map((el) =>
                gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
            );

            // Weight is measured on the filled letters and mirrored onto the outline.
            const [letters, outlineLetters] = nameRefs.current;
            const current = letters.map(() => WEIGHT_REST);
            const target = letters.map(() => WEIGHT_REST);
            let frame = 0;

            const tick = () => {
                let moving = false;
                letters.forEach((el, i) => {
                    const next = current[i] + (target[i] - current[i]) * 0.14;
                    if (Math.abs(target[i] - next) > 0.5) moving = true;
                    current[i] = Math.abs(target[i] - next) > 0.5 ? next : target[i];
                    const weight = String(Math.round(current[i]));
                    el.style.fontWeight = weight;
                    outlineLetters[i].style.fontWeight = weight;
                });
                frame = moving ? requestAnimationFrame(tick) : 0;
            };
            const wake = () => {
                if (!frame) frame = requestAnimationFrame(tick);
            };

            const move = (nx, ny) => {
                plateX.forEach((to) => to(nx * -12));
                plateY.forEach((to) => to(ny * -8));
                typeX.forEach((to) => to(nx * 18));
                typeY.forEach((to) => to(ny * 10));
            };

            const reset = () => {
                move(0, 0);
                target.fill(WEIGHT_REST);
                wake();
            };

            const onPointerMove = (event) => {
                const rect = root.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                move(
                    ((event.clientX - rect.left) / rect.width - 0.5) * 2,
                    ((event.clientY - rect.top) / rect.height - 0.5) * 2,
                );

                letters.forEach((el, i) => {
                    const box = el.getBoundingClientRect();
                    const dx = event.clientX - (box.left + box.width / 2);
                    const dy = event.clientY - (box.top + box.height / 2);
                    const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / WEIGHT_RADIUS);
                    const eased = falloff * falloff * (3 - 2 * falloff);
                    target[i] = WEIGHT_REST + (WEIGHT_PEAK - WEIGHT_REST) * eased;
                });
                wake();
            };

            root.addEventListener('pointermove', onPointerMove);
            root.addEventListener('pointerleave', reset);

            return () => {
                cancelAnimationFrame(frame);
                name.forEach((el) => {
                    el.style.fontWeight = '';
                });
                root.removeEventListener('pointermove', onPointerMove);
                root.removeEventListener('pointerleave', reset);
            };
        });

        return () => {
            gsap.ticker.remove(syncMask);
            mm.revert();
        };
    }, []);

    const plate = (index, children) => (
        <div
            aria-hidden={index === 1 ? 'true' : undefined}
            className={`pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 ${index === 0 ? 'z-10' : 'z-30'}`}
        >
            <div ref={(el) => (scrollRefs.current[index] = el)} className="origin-bottom">
                <div ref={(el) => (parallaxRefs.current[index] = el)}>
                    <div ref={(el) => (floatRefs.current[index] = el)} className="relative">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    const headline = (layer) => {
        const front = layer === 1;
        return (
            <div
                ref={(el) => (headlineScrollRefs.current[layer] = el)}
                className="absolute inset-x-0 top-[var(--hero-type-top)] flex justify-center px-4 [--hero-type-top:18vh] sm:[--hero-type-top:6vh] md:[--hero-type-top:4vh]"
            >
                <div
                    ref={(el) => (headlineDriftRefs.current[layer] = el)}
                    className="flex flex-col items-center text-center"
                >
                    <span
                        ref={(el) => (maskRefs.current[layer * 2] = el)}
                        className={`block font-display text-[clamp(1.6rem,4.4vw,3.75rem)] font-normal leading-[1.1] tracking-[-0.01em] ${front ? 'hero-outline' : 'text-ink/80'}`}
                    >
                        {GREETING.map((word, i) => (
                            <span key={word} className="inline-block">
                                <span
                                    ref={(el) => (greetingRefs.current[layer][i] = el)}
                                    className="inline-block"
                                >
                                    {word}
                                </span>
                                {i < GREETING.length - 1 ? '\u00a0' : null}
                            </span>
                        ))}
                    </span>
                    <span
                        ref={(el) => (maskRefs.current[layer * 2 + 1] = el)}
                        className={`-mt-[0.06em] block whitespace-nowrap font-display text-[clamp(6rem,27vw,21rem)] font-semibold italic leading-[0.86] tracking-[-0.035em] ${front ? 'hero-outline' : 'text-primary'}`}
                    >
                        {NAME.map((char, i) => (
                            <span
                                key={i}
                                ref={(el) => (nameRefs.current[layer][i] = el)}
                                className="inline-block will-change-transform"
                            >
                                {char}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        );
    };

    const photoClass =
        'block h-auto w-auto max-h-[96vh] max-w-none object-contain select-none md:max-h-[104vh]';

    return (
        <section
            ref={rootRef}
            aria-labelledby="hero-title"
            className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24"
        >
            <h1 id="hero-title" className="sr-only">
                Hey, I’m Jason. Jason Gian Duran, designer and developer.
            </h1>

            <Ridges />

            <div ref={depthRef} className="absolute inset-0 z-10">
                {/* Back plate: the full photograph, lavender backdrop included. */}
                {plate(
                    0,
                    <img
                        src={heroPic}
                        alt="Jason Gian Duran at his desk answering a call"
                        className={photoClass}
                        draggable="false"
                    />,
                )}

                {/* The greeting lives between the backdrop and Jason himself. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
                    {headline(0)}
                </div>

                {/* Front plate: Jason cut from the backdrop, so the name sits behind him. */}
                {plate(
                    1,
                    <>
                        <img src={heroPic} alt="" className={`${photoClass} invisible`} draggable="false" />
                        <img
                            ref={cutoutRef}
                            src={heroCutout}
                            alt=""
                            className="absolute inset-x-0 top-0 block w-full select-none"
                            style={{ height: CUTOUT_HEIGHT }}
                            draggable="false"
                        />
                        <div
                            ref={sweepRef}
                            className="absolute inset-x-0 top-0 overflow-hidden opacity-0 mix-blend-soft-light"
                            style={{ ...sweepMask, height: CUTOUT_HEIGHT }}
                        >
                            <div className="h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                        </div>
                    </>,
                )}

                {/* Outline of the name, clipped to Jason, tracing the letters he covers. */}
                <div
                    ref={outlineRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[35] mix-blend-difference"
                    style={outlineMask}
                >
                    {headline(1)}
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-40 bg-gradient-to-t from-surface to-transparent" />
        </section>
    );
}
