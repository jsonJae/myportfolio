import { useEffect, useRef } from 'react';

// Drives one looping reel. The reel keeps a single number, `offset`, and hands
// it to `render` every frame along with a -1..1 "speed" for motion styling.
//   - a steady drift (`speed`, px/s; the sign is the direction)
//   - scrolling the page speeds it up, and scrolling back up reverses it
//   - hovering slows it to a crawl, so a print can be picked out
//   - dragging scrubs it, and letting go flings it
//   - tabbing to a print glides that print to the centre
//   - it spins up fast the first time it comes into view
// The loop only runs while the reel is on screen.
const mod = (a, n) => ((a % n) + n) % n;
export { mod };

export default function useReel(hostRef, { speed, reduced, render, measure }) {
    const renderRef = useRef(render);
    const measureRef = useRef(measure);
    useEffect(() => {
        renderRef.current = render;
        measureRef.current = measure;
    });

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        let offset = 0;
        let raf = 0;
        let last = 0;
        let lastY = window.scrollY;
        let scrollVel = 0;
        let dir = 1;
        let slow = 1;
        let hover = false;
        let focused = false;
        let fling = 0;
        let burst = reduced ? 0 : 1;
        let glide = null; // remaining distance to bring a focused print to centre
        let drag = null;
        let suppressClick = false;
        let prev = 0;
        let vel = 0;

        const draw = (motion) => renderRef.current?.(offset, motion);

        const frame = (now) => {
            raf = requestAnimationFrame(frame);
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;

            const y = window.scrollY;
            if (!reduced) {
                scrollVel += ((y - lastY) / dt - scrollVel) * 0.15;
                if (scrollVel > 40) dir = 1;
                else if (scrollVel < -40) dir = -1;
            }
            lastY = y;

            const calm = hover || focused || drag ? 0.08 : 1;
            slow += (calm - slow) * Math.min(1, dt * 5);
            burst *= Math.exp(-dt * 1.4);

            if (drag) {
                // offset follows the pointer (set in onMove)
            } else if (glide !== null) {
                const step = glide * (1 - Math.exp(-dt * 7));
                offset += step;
                glide -= step;
                if (Math.abs(glide) < 0.5) glide = null;
            } else {
                const boost = reduced ? 0 : Math.min(Math.abs(scrollVel) / 200, 8);
                const auto = reduced ? 0 : speed * (dir * (slow + boost) + burst * 16);
                offset += (auto + fling) * dt;
                fling *= Math.exp(-dt * 2.2);
            }

            const v = (offset - prev) / dt;
            prev = offset;
            vel += (v - vel) * 0.18;
            draw(reduced ? 0 : Math.max(-1, Math.min(1, vel / 2200)));
        };

        const start = () => {
            if (raf) return;
            last = 0;
            lastY = window.scrollY;
            raf = requestAnimationFrame(frame);
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            raf = 0;
        };

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                host.dataset.seen = 'true';
                start();
            } else stop();
        });
        io.observe(host);

        const ro = new ResizeObserver(() => {
            measureRef.current?.();
            draw(0);
        });
        ro.observe(host);
        measureRef.current?.();
        draw(0);

        const onDown = (event) => {
            if (event.button !== 0) return;
            suppressClick = false;
            fling = 0;
            glide = null;
            drag = { x: event.clientX, start: offset, moved: false, lastX: event.clientX, lastT: event.timeStamp, v: 0 };
        };
        const onMove = (event) => {
            if (!drag) return;
            const dx = event.clientX - drag.x;
            if (!drag.moved) {
                if (Math.abs(dx) < 6) return;
                drag.moved = true;
                host.dataset.dragging = 'true';
            }
            offset = drag.start - dx;
            const dtm = (event.timeStamp - drag.lastT) / 1000;
            if (dtm > 0) drag.v = drag.v * 0.5 + (-(event.clientX - drag.lastX) / dtm) * 0.5;
            drag.lastX = event.clientX;
            drag.lastT = event.timeStamp;
            if (!raf) draw(0);
        };
        const onUp = (event) => {
            if (!drag) return;
            if (drag.moved) {
                suppressClick = true;
                if (event.type === 'pointerup') fling = Math.max(-5000, Math.min(5000, drag.v));
            }
            drag = null;
            delete host.dataset.dragging;
        };
        // A drag ends in a click on whatever print was under the pointer; eat it.
        const onClick = (event) => {
            if (!suppressClick) return;
            suppressClick = false;
            event.preventDefault();
            event.stopPropagation();
        };
        const onEnter = (event) => {
            if (event.pointerType === 'mouse') hover = true;
        };
        const onLeave = () => {
            hover = false;
        };
        const onFocusIn = (event) => {
            focused = true;
            if (event.target === host) return;
            const r = event.target.getBoundingClientRect();
            const h = host.getBoundingClientRect();
            glide = r.left + r.width / 2 - (h.left + h.width / 2);
            if (!raf) {
                offset += glide;
                glide = null;
                draw(0);
            }
        };
        const onFocusOut = (event) => {
            focused = host.contains(event.relatedTarget);
        };

        host.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        host.addEventListener('click', onClick, true);
        host.addEventListener('pointerenter', onEnter);
        host.addEventListener('pointerleave', onLeave);
        host.addEventListener('focusin', onFocusIn);
        host.addEventListener('focusout', onFocusOut);

        return () => {
            stop();
            io.disconnect();
            ro.disconnect();
            host.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            host.removeEventListener('click', onClick, true);
            host.removeEventListener('pointerenter', onEnter);
            host.removeEventListener('pointerleave', onLeave);
            host.removeEventListener('focusin', onFocusIn);
            host.removeEventListener('focusout', onFocusOut);
        };
    }, [hostRef, speed, reduced]);
}
