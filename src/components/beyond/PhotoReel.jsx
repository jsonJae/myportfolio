import { useRef } from 'react';
import useReel, { mod } from './useReel';

// A reel of prints wrapped round a drum: the print in the middle faces you,
// the ones toward the edges turn away and sink back. Each print is placed by
// the reel's offset alone, so 14 prints loop forever without duplicates.
// Fast motion (scroll, fling) skews the prints like a smear.

const lean = (index) => ((index * 37) % 11) - 5;

export default function PhotoReel({ photos, order, speed, reduced, onOpen, decorative = false, label }) {
    const hostRef = useRef(null);
    const items = useRef([]);
    const size = useRef({ w: 0, pitch: 0, width: 0 });

    const measure = () => {
        const host = hostRef.current;
        const first = items.current[0];
        if (!host || !first) return;
        const w = first.offsetWidth;
        size.current = { w, pitch: Math.round(w * 1.12) + 8, width: host.clientWidth };
        host.style.height = `${first.offsetHeight + 72}px`;
    };

    const render = (offset, motion) => {
        const { w, pitch, width } = size.current;
        if (!pitch) return;
        const total = pitch * order.length;
        const half = width / 2;
        // Start the loop so the first print sits just left of centre.
        const shift = half - w / 2;
        items.current.forEach((el, i) => {
            if (!el) return;
            const x = mod(i * pitch - offset + shift + pitch, total) - pitch;
            const d = Math.max(-1.4, Math.min(1.4, (x + w / 2 - half) / half));
            const z = -d * d * 170;
            el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(d * 30).toFixed(2)}deg) skewX(${(-motion * 12).toFixed(2)}deg)`;
            el.style.opacity = String(Math.max(0, 1 - Math.max(0, Math.abs(d) - 0.75) * 1.1));
        });
    };

    useReel(hostRef, { speed, reduced, render, measure });

    return (
        <div
            ref={hostRef}
            role={decorative ? undefined : 'group'}
            aria-label={decorative ? undefined : label}
            aria-hidden={decorative || undefined}
            className="group/reel relative w-full touch-pan-y select-none overflow-x-clip opacity-0 transition-opacity duration-700 [perspective:1300px] data-[dragging=true]:cursor-grabbing data-[seen=true]:opacity-100 motion-reduce:opacity-100"
            style={{ height: 420 }}
        >
            {order.map((photoIndex, i) => {
                const photo = photos[photoIndex];
                return (
                    <div
                        key={photo.card}
                        ref={(el) => {
                            items.current[i] = el;
                        }}
                        className="absolute left-0 top-9 will-change-transform"
                        style={{ transform: 'translate3d(-200vw, 0, 0)' }}
                    >
                        <button
                            type="button"
                            tabIndex={decorative ? -1 : 0}
                            aria-label={decorative ? undefined : `Open photo: ${photo.caption}`}
                            onClick={(event) => onOpen(photoIndex, decorative ? null : event.currentTarget)}
                            className="group/print block w-[156px] cursor-grab rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:w-[210px] lg:w-[250px]"
                        >
                            <figure
                                style={{ '--lean': `${lean(photoIndex)}deg` }}
                                className="flex flex-col rounded-[6px] bg-white p-2 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_24px_40px_-26px_rgba(8,36,169,0.5)] ring-1 ring-black/[0.04] transition-[rotate,translate,scale,opacity] duration-500 ease-soft rotate-[var(--lean)] group-hover/reel:opacity-55 group-hover/print:-translate-y-3 group-hover/print:scale-[1.06] group-hover/print:rotate-0 group-hover/print:!opacity-100 group-focus-visible/print:rotate-0 sm:p-2.5"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-surface">
                                    <img
                                        src={photo.card}
                                        alt=""
                                        draggable="false"
                                        decoding="async"
                                        className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-soft group-hover/print:scale-[1.07]"
                                    />
                                </div>
                                <figcaption className="flex h-11 items-center gap-2.5 px-1 text-left sm:h-12 sm:px-1.5">
                                    <span className="line-clamp-2 flex-1 font-display text-[13px] italic leading-[1.2] text-primary sm:text-[15px]">
                                        {photo.caption}
                                    </span>
                                    <span className="shrink-0 font-mono text-[9px] tabular-nums text-muted sm:text-[10px]">
                                        {String(photoIndex + 1).padStart(2, '0')}
                                    </span>
                                </figcaption>
                            </figure>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
