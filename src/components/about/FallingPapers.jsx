import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { PaperField, mulberry32 } from './papers';

// Room above the section so tossed sheets can rise past its top edge and
// fade, instead of being cut off by it.
const HEADROOM = 128;

const isCompact = (width) => width < 640;

/**
 * The About toss. When the photo comes into view, a burst of sheets leaves
 * its paper cluster and flutters down the section; after that a sheet slips
 * out every few seconds while the section is on screen. A moving mouse
 * pushes nearby sheets. Everything stops off-screen and in hidden tabs.
 * Reduced motion gets one still frame of the toss, mid-air.
 */
export default function FallingPapers({ sectionRef, sourceRef }) {
    const backRef = useRef(null);
    const frontRef = useRef(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const section = sectionRef.current;
        const source = sourceRef.current;
        const back = backRef.current?.getContext('2d');
        const front = frontRef.current?.getContext('2d');
        if (!section || !source || !back || !front) return undefined;

        const field = new PaperField({ rng: reduced ? mulberry32(11) : Math.random });
        let dpr = 1;

        const measure = () => {
            const sr = section.getBoundingClientRect();
            const pr = source.getBoundingClientRect();
            const w = sr.width;
            const h = sr.height + HEADROOM;
            const compact = isCompact(w);
            // Small sheets stay crisp at 1.5x, and two full-section canvases stay light.
            dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            for (const ctx of [back, front]) {
                ctx.canvas.width = Math.round(w * dpr);
                ctx.canvas.height = Math.round(h * dpr);
            }
            field.resize(w, h, { scale: compact ? 0.78 : 1, fadeTop: HEADROOM, max: compact ? 22 : 40 });
            field.setSource({ x: pr.left - sr.left, y: pr.top - sr.top + HEADROOM, w: pr.width, h: pr.height });
            return compact;
        };

        // Reduced motion: the toss frozen 1.2s in, redrawn on resize.
        if (reduced) {
            const still = () => {
                const compact = measure();
                field.sheets.length = 0;
                field.pending.length = 0;
                field.time = 0;
                field.rng = mulberry32(11);
                field.burst(compact ? 9 : 16, { spread: 0 });
                for (let t = 0; t < 1.2; t += 1 / 60) field.step(1 / 60);
                // A still sheet caught edge-on reads as a stray bar; turn it to face us.
                for (const s of field.sheets) if (Math.abs(Math.cos(s.phi)) < 0.4) s.phi = 0.55;
                field.draw(back, front, dpr);
            };
            still();
            const ro = new ResizeObserver(still);
            ro.observe(section);
            return () => ro.disconnect();
        }

        let raf = 0;
        let last = 0;
        let visible = false;
        let tossed = false;
        let tossTimer = 0;
        let nextTrickle = Infinity;

        const frame = (now) => {
            raf = 0;
            const dt = Math.min(1 / 30, (now - last) / 1000 || 1 / 60);
            last = now;
            if (tossed && field.time >= nextTrickle) {
                field.burst(Math.random() < 0.25 ? 2 : 1, { spread: 0.6, toss: false });
                nextTrickle = field.time + 2.6 + Math.random() * 2.6;
            }
            if (field.count > 0) field.step(dt);
            else field.time += dt; // keep the trickle clock running between sheets
            field.draw(back, front, dpr);
            if (visible && !document.hidden) raf = requestAnimationFrame(frame);
        };
        const start = () => {
            if (raf || !visible || document.hidden) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        measure();

        const sectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
        });
        sectionObserver.observe(section);

        // The toss waits for the photo, so the sheets visibly come out of it.
        const photoObserver = new IntersectionObserver(
            ([entry]) => {
                if (tossed || entry.intersectionRatio < 0.4) return;
                photoObserver.disconnect();
                tossTimer = window.setTimeout(() => {
                    const compact = measure();
                    field.burst(compact ? 13 : 22);
                    tossed = true;
                    nextTrickle = field.time + 4 + Math.random() * 2;
                    start();
                }, 450);
            },
            { threshold: [0, 0.4] },
        );
        photoObserver.observe(source);

        const ro = new ResizeObserver(() => measure());
        ro.observe(section);

        const onVisibility = () => (document.hidden ? stop() : start());
        document.addEventListener('visibilitychange', onVisibility);

        // Mouse only: a finger dragging over the page is scrolling, not blowing.
        let lastPointer = null;
        const onPointerMove = (event) => {
            if (event.pointerType !== 'mouse') return;
            const sr = section.getBoundingClientRect();
            const x = event.clientX - sr.left;
            const y = event.clientY - sr.top + HEADROOM;
            const t = event.timeStamp;
            if (lastPointer) {
                const dt = (t - lastPointer.t) / 1000;
                if (dt > 0 && dt < 0.1) {
                    const vx = (x - lastPointer.x) / dt;
                    const vy = (y - lastPointer.y) / dt;
                    if (vx * vx + vy * vy > 140 * 140) field.gust(x, y, vx, vy, dt);
                }
            }
            lastPointer = { x, y, t };
        };
        const onPointerLeave = () => {
            lastPointer = null;
        };
        section.addEventListener('pointermove', onPointerMove, { passive: true });
        section.addEventListener('pointerleave', onPointerLeave);

        return () => {
            stop();
            window.clearTimeout(tossTimer);
            sectionObserver.disconnect();
            photoObserver.disconnect();
            ro.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            section.removeEventListener('pointermove', onPointerMove);
            section.removeEventListener('pointerleave', onPointerLeave);
        };
    }, [reduced, sectionRef, sourceRef]);

    // Two layers around the photo: the back one sits under it (z-0, earlier in
    // the section than the photo), the front one over it and under the copy.
    const layer = { top: -HEADROOM, height: `calc(100% + ${HEADROOM}px)` };
    return (
        <>
            <canvas
                ref={backRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full"
                style={layer}
            />
            <canvas
                ref={frontRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] w-full"
                style={layer}
            />
        </>
    );
}
