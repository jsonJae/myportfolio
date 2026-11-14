import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroPic from '../assets/HeroPic.png';
import Ridges from './Ridges';

gsap.registerPlugin(ScrollTrigger);

const sweepMask = {
    WebkitMaskImage: `url(${heroPic})`,
    maskImage: `url(${heroPic})`,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
};

export default function Hero() {
    const rootRef = useRef(null);
    const portraitScrollRef = useRef(null);
    const portraitParallaxRef = useRef(null);
    const portraitFloatRef = useRef(null);
    const sweepRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const portrait = portraitParallaxRef.current;
            const breath = portraitFloatRef.current;
            const sweep = sweepRef.current;

            gsap.set(portrait, {
                clipPath: 'inset(100% 0% 0% 0%)',
                y: 56,
                opacity: 0,
            });
            gsap.set(breath, { scale: 1.05 });
            gsap.set(sweep, { xPercent: -140, opacity: 0 });

            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .to(
                    portrait,
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
                    sweep,
                    {
                        xPercent: 140,
                        opacity: 0.55,
                        duration: 1.6,
                        ease: 'power2.inOut',
                    },
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

            gsap.to(portraitScrollRef.current, {
                yPercent: 10,
                scale: 0.94,
                opacity: 0.55,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.7,
                },
            });
        });

        mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
            const portraitX = gsap.quickTo(portraitParallaxRef.current, 'x', {
                duration: 1.1,
                ease: 'power3.out',
            });
            const portraitY = gsap.quickTo(portraitParallaxRef.current, 'y', {
                duration: 1.1,
                ease: 'power3.out',
            });

            const reset = () => {
                portraitX(0);
                portraitY(0);
            };

            const onPointerMove = (event) => {
                const rect = root.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

                portraitX(nx * -12);
                portraitY(ny * -8);
            };

            root.addEventListener('pointermove', onPointerMove);
            root.addEventListener('pointerleave', reset);

            return () => {
                root.removeEventListener('pointermove', onPointerMove);
                root.removeEventListener('pointerleave', reset);
            };
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={rootRef}
            aria-labelledby="hero-title"
            className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24"
        >
            <h1 id="hero-title" className="sr-only">
                Jason Gian Duran — designer and developer
            </h1>

            <Ridges />

            <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
                <div ref={portraitScrollRef} className="origin-bottom">
                    <div ref={portraitParallaxRef}>
                        <div ref={portraitFloatRef} className="relative">
                            <img
                                src={heroPic}
                                alt="Jason Gian Duran at his desk answering a call"
                                className="block h-auto w-auto max-h-[96vh] max-w-none object-contain md:max-h-[104vh]"
                                draggable="false"
                            />
                            <div
                                ref={sweepRef}
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light"
                                style={sweepMask}
                            >
                                <div className="h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-surface to-transparent" />
        </section>
    );
}
