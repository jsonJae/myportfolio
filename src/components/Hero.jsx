import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroPic from '../assets/HeroPic.png';
import heroCutout from '../assets/HeroCutout.webp';
import Ridges from './Ridges';
import { getSplash } from '../utils/splash';

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

        // When the splash is up, its name flies into this hero. Until it lands,
        // the cursor must not drift or reweight the landing spot.
        const splash = getSplash();
        const gate = { open: !splash };

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
        // Each sync forces a layout read. Under the splash the outline is hidden
        // and the page is still, so skip the per-frame reads until it lands.
        const tickMask = () => {
            if (gate.open) syncMask();
        };
        syncMask();
        gsap.ticker.add(tickMask);

        mm.add('(prefers-reduced-motion: no-preference)', (context) => {
            const plates = parallaxRefs.current;
            const breath = floatRefs.current;
            const sweep = sweepRef.current;
            const masks = maskRefs.current;
            const greetingMasks = [masks[0], masks[2]];
            const nameLine = masks[1];
            let cancelled = false;

            gsap.set(plates, { clipPath: 'inset(100% 0% 0% 0%)', y: 56, opacity: 0 });
            gsap.set(breath, { scale: 1.05 });
            gsap.set(sweep, { xPercent: -140, opacity: 0 });
            // Clip each line only while its letters rise; the generous side and
            // bottom margins keep the italic overhangs and the J's tail intact.
            gsap.set(masks, { clipPath: 'inset(-0.4em -0.5em -0.2em -0.5em)' });
            gsap.set(greeting, { yPercent: 120, rotate: 4 });
            gsap.set(name, { yPercent: 115, rotate: 7, transformOrigin: '0% 100%' });
            gsap.set(outline, { opacity: 0 });

            const float = (delay) =>
                gsap.to(breath, {
                    y: -9,
                    duration: 4.8,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                    delay,
                });

            // No splash this session: the portrait and the name rise on their own.
            const intro = () => {
                gate.open = true;
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

                float(1.5);
            };

            // The splash name is set in the same face, size and tracking as the
            // hero name, so landing it is a pure translation plus a weight settle.
            // On touchdown it is swapped for the real name, and only then does
            // the portrait rise in front of it.
            const handoff = (parts) => {
                const to = nameLine.getBoundingClientRect();
                const from = parts.name.getBoundingClientRect();
                const dx = to.left + to.width / 2 - (from.left + from.width / 2);
                const dy = to.top + to.height / 2 - (from.top + from.height / 2);
                // Each letter trails the one before it, so the word ripples up
                // the way the name used to rise, then settles as one line.
                // The trail scales with the type: on a phone the letters are a
                // third the size over the same distance, so a full trail would
                // pull the word apart instead of rippling it.
                const flight = 1.1;
                const typeSize = parseFloat(getComputedStyle(parts.name).fontSize) || 300;
                const trail = 0.04 * Math.min(1, Math.max(0.55, Math.sqrt(typeSize / 300)));
                const touchdown = flight + trail * (NAME.length - 1);

                // Weight settles from the splash's full ink to the hero's resting
                // weight, snapped to steps of 10: every distinct weight is a new
                // font instance to shape and rasterize, so keep the set small.
                const weights = parts.letters.map((el) => ({
                    w: parseFloat(getComputedStyle(el).fontWeight) || WEIGHT_PEAK,
                }));
                const applyWeights = () => {
                    parts.letters.forEach((el, i) => {
                        el.style.fontWeight = String(Math.round(weights[i].w / 10) * 10);
                    });
                };

                // Built paused and started on the next tick. The measurements
                // above force a full layout of the freshly mounted page; a timeline
                // created now would sit on the clock from before that work and
                // jump ahead on its first frame.
                const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
                // Created here so the context still owns it; played once Jason has risen.
                const drift = float(0).pause();
                tl.to(parts.status, { autoAlpha: 0, y: 6, duration: 0.3, ease: 'power2.in' }, 0)
                    .to(
                        parts.letters,
                        { x: dx, y: dy, duration: flight, ease: 'expo.inOut', stagger: trail },
                        0,
                    )
                    .to(
                        weights,
                        {
                            w: WEIGHT_REST,
                            duration: flight,
                            ease: 'power2.inOut',
                            stagger: trail,
                            onUpdate: applyWeights,
                        },
                        0,
                    )
                    .to(parts.bg, { autoAlpha: 0, duration: 0.85, ease: 'power2.inOut' }, 0.25)
                    .call(
                        () => {
                            gsap.set(nameLine, { autoAlpha: 1 });
                            splash.finish();
                            gate.open = true;
                        },
                        null,
                        touchdown,
                    )
                    .to(
                        greeting,
                        {
                            yPercent: 0,
                            rotate: 0,
                            duration: 1,
                            ease: 'expo.out',
                            stagger: staggerBy(0.09, GREETING.length),
                        },
                        0.8,
                    )
                    .to(
                        plates,
                        {
                            opacity: 1,
                            y: 0,
                            clipPath: 'inset(0% 0% 0% 0%)',
                            duration: 1.2,
                            ease: 'power4.inOut',
                        },
                        1.0,
                    )
                    .to(breath, { scale: 1, duration: 1.5, ease: 'power3.out' }, 1.0)
                    .set(greetingMasks, { clipPath: 'none' }, 1.95)
                    .to(outline, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 2.05)
                    .to(
                        sweep,
                        { xPercent: 140, opacity: 0.55, duration: 1.6, ease: 'power2.inOut' },
                        1.0,
                    )
                    .to(sweep, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 2.45)
                    .call(() => drift.play(), null, 2.5);

                gsap.ticker.add(() => tl.play(), true);
            };

            if (splash) {
                // The name arrives by flight, so it waits at rest, unclipped and hidden.
                gsap.set(name, { yPercent: 0, rotate: 0 });
                gsap.set(nameLine, { clipPath: 'none', autoAlpha: 0 });

                splash.ready.then(() => {
                    if (cancelled) return;
                    // Deep links land below the hero; there is nothing to fly to.
                    const parts = window.scrollY < 8 ? splash.claim() : null;
                    context.add(() => {
                        if (parts) {
                            handoff(parts);
                            return;
                        }
                        splash.fade();
                        gsap.set(nameLine, { autoAlpha: 1 });
                        gsap.set(name, { yPercent: 115, rotate: 7 });
                        gsap.set(nameLine, { clipPath: 'inset(-0.4em -0.5em -0.2em -0.5em)' });
                        intro();
                    });
                });
            } else {
                intro();
            }

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

            return () => {
                cancelled = true;
            };
        });

        // Reduced motion: no flight. The splash cross-fades onto the resting hero.
        mm.add('(prefers-reduced-motion: reduce)', () => {
            if (!splash) return undefined;
            let cancelled = false;
            splash.ready.then(() => {
                if (cancelled) return;
                gate.open = true;
                splash.fade();
            });
            return () => {
                cancelled = true;
            };
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
                if (!gate.open) return;
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

        // The hero is laid out and its intro staged; the splash may hand off.
        splash?.appReady();

        return () => {
            gsap.ticker.remove(tickMask);
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
                Hey, I’m Jason. Jason Gian Duran, AI engineer and software developer.
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
