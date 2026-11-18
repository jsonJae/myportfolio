import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];
const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

// A photo from "beyond the code", large, with its chapter and caption.
export default function PhotoViewer({ photos, chapters, index, onIndex, onClose }) {
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const photo = photos[index];
    const chapter = chapters.find((c) => c.id === photo.chapter);
    const count = photos.length;
    const step = (direction) => onIndex((index + direction + count) % count);

    useEffect(() => {
        const root = document.documentElement;
        const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
        const gutter = window.innerWidth - root.clientWidth;
        root.style.overflow = 'hidden';
        if (gutter > 0) root.style.paddingRight = `${gutter}px`;
        const id = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 120);
        return () => {
            window.clearTimeout(id);
            root.style.overflow = previous.overflow;
            root.style.paddingRight = previous.paddingRight;
        };
    }, []);

    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
        } else if (event.key === 'ArrowRight') {
            step(1);
        } else if (event.key === 'ArrowLeft') {
            step(-1);
        } else if (event.key === 'Tab') {
            const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
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

    const turn =
        'group relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 ease-soft hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

    return (
        <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${chapter ? `I ${chapter.verb} ${chapter.rest}` : 'Photo'}, photo ${index + 1} of ${count}`}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-[rgba(4,12,52,0.92)] backdrop-blur-[4px]"
        >
            <button type="button" aria-hidden="true" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-zoom-out" />

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 pt-16 sm:px-20">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                        key={photo.src}
                        src={photo.src}
                        alt={photo.caption}
                        initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="relative max-h-full max-w-full rounded-[10px] object-contain shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
                    />
                </AnimatePresence>
            </div>

            <div className="relative mx-auto flex w-full max-w-4xl items-center gap-4 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6">
                <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className={turn}>
                    <ArrowLeft size={16} strokeWidth={2.25} aria-hidden="true" />
                </button>
                <div className="min-w-0 flex-1 text-center">
                    {chapter && (
                        <p className="font-display text-[20px] leading-tight text-white sm:text-[24px]">
                            I <span className="italic">{chapter.verb}</span> {chapter.rest}
                        </p>
                    )}
                    <p className="mt-1 font-mono text-[12px] leading-[1.6] text-white/75">{photo.caption}</p>
                    <p className="mt-1 font-mono text-[11px] tabular-nums text-white/45">
                        {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </p>
                </div>
                <button type="button" aria-label="Next photo" onClick={() => step(1)} className={turn}>
                    <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
                </button>
            </div>

            <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close photo"
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-300 ease-soft hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
                <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
        </motion.div>
    );
}
