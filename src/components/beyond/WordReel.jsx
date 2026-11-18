import { useRef } from 'react';
import useReel, { mod } from './useReel';

// A ribbon of type that loops on the same engine as the photo reels, so it
// reacts to scroll and drag in the same way, skewing as it speeds up.
const COPIES = 3;

export default function WordReel({ speed, reduced, children }) {
    const hostRef = useRef(null);
    const trackRef = useRef(null);
    const setWidth = useRef(0);

    const measure = () => {
        setWidth.current = trackRef.current?.firstElementChild?.offsetWidth ?? 0;
    };
    const render = (offset, motion) => {
        if (!setWidth.current || !trackRef.current) return;
        const x = -mod(offset, setWidth.current);
        trackRef.current.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) skewX(${(-motion * 16).toFixed(2)}deg)`;
    };

    useReel(hostRef, { speed, reduced, render, measure });

    return (
        <div ref={hostRef} aria-hidden="true" className="relative w-full touch-pan-y select-none overflow-x-clip cursor-grab data-[dragging=true]:cursor-grabbing">
            <div ref={trackRef} className="flex w-max will-change-transform">
                {Array.from({ length: COPIES }, (_, i) => (
                    <div key={i} className="flex shrink-0 items-center">
                        {children}
                    </div>
                ))}
            </div>
        </div>
    );
}
