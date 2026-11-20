import { useCallback, useEffect, useRef, useState } from 'react';
import { Award, ImageIcon } from 'lucide-react';
import { stackLogos } from '../data/stackLogos';

// The project's stack as brand marks, from the same logo set as the Stack
// section. Tags with no mark (roles, MUX, Hive...) stay as small text chips.
// `labelled` writes the name beside each mark (detail sheet); otherwise the
// name shows in a tooltip on hover (card). On a card the list sits above the
// card's full-size button so the tooltips can be hovered, and clicks fall
// through to `onOpen` so an icon still opens the project.
export function StackMarks({ tags, labelled = false, onOpen, className = '' }) {
    const marked = tags.filter((tag) => stackLogos[tag]);
    const plain = tags.filter((tag) => !stackLogos[tag]);

    return (
        <ul
            aria-label="Stack and tags"
            onClick={onOpen}
            className={`flex flex-wrap items-center gap-1.5 ${onOpen ? 'relative z-20 cursor-pointer' : ''} ${className}`}
        >
            {marked.map((tag) =>
                labelled ? (
                    <li
                        key={tag}
                        className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-black/[0.07] bg-white pl-1.5 pr-2.5 font-mono text-[11px] text-ink-soft shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
                    >
                        <img src={stackLogos[tag]} alt="" className="size-[18px] object-contain" />
                        {tag}
                    </li>
                ) : (
                    <li
                        key={tag}
                        className="group/mark relative grid size-8 place-items-center rounded-[10px] border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-[transform,border-color] duration-300 ease-soft hover:-translate-y-0.5 hover:border-primary/30"
                    >
                        <img src={stackLogos[tag]} alt={tag} className="size-[18px] object-contain" />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-full left-0 mb-2 translate-y-1 whitespace-nowrap rounded-full border border-black/[0.08] bg-white px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-ink opacity-0 shadow-[0_8px_24px_-10px_rgba(15,23,42,0.35)] transition-[opacity,transform] duration-200 ease-soft group-hover/mark:translate-y-0 group-hover/mark:opacity-100"
                        >
                            {tag}
                        </span>
                    </li>
                ),
            )}
            {plain.map((tag) => (
                <li
                    key={tag}
                    className="inline-flex h-8 items-center rounded-[10px] border border-black/[0.07] bg-surface/60 px-2.5 font-mono text-[11px] text-ink-soft"
                >
                    {tag}
                </li>
            ))}
        </ul>
    );
}

// Pieces shared by the project card and its detail sheet, so the two stay one
// design and the morph between them lines up.

// A picture that fades in once it has loaded and decoded, so a late image
// never pops, and reports that moment (onReady) so the project card can start
// its press on a real picture. Errors report too, so nothing waits forever.
function FadeImage({ image, eager, onReady }) {
    const [loaded, setLoaded] = useState(false);
    const readyRef = useRef(onReady);
    useEffect(() => {
        readyRef.current = onReady;
    }, [onReady]);

    const reveal = useCallback((el) => {
        const done = () => {
            setLoaded(true);
            readyRef.current?.();
        };
        if (el.decode) el.decode().then(done, done);
        else done();
    }, []);
    // Already in the cache: show it before the first paint.
    const check = useCallback(
        (el) => {
            if (el?.complete && el.naturalWidth) reveal(el);
        },
        [reveal],
    );

    return (
        <img
            ref={check}
            src={image.src}
            alt={image.alt ?? ''}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable="false"
            onLoad={(e) => reveal(e.currentTarget)}
            onError={() => readyRef.current?.()}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-soft ${
                loaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
    );
}

export function ProjectMedia({ image, label = 'Project image', compact = false, plain = false, eager = false, onReady }) {
    if (image) return <FadeImage key={image.src} image={image} eager={eager} onReady={onReady} />;

    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 grid place-items-center ${plain ? 'bg-white' : 'press-paper'}`}
        >
            {!plain && <span className={`press-crop ${compact ? 'press-crop-compact' : ''}`} />}
            <span className="flex flex-col items-center gap-2.5 text-primary/55">
                <ImageIcon size={compact ? 18 : 26} strokeWidth={1.5} />
                {!compact && (
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]">{label}</span>
                )}
            </span>
        </div>
    );
}

// An ongoing project's name is pressed only part way: the splash's ink-fill,
// where weight is the progress bar, stopped mid-run. The first 60% of the
// letters are at full ink, the next one is wet and keeps pressing in time
// with the brayer on the proof, and the rest are still hairlines.
const PRESSED = 0.6;

function PressingName({ name }) {
    const letters = [...name];
    const pressed = Math.floor(letters.length * PRESSED);
    return (
        <span className="ink-title block whitespace-nowrap">
            <span className="sr-only">{name}</span>
            <span aria-hidden="true">
                {letters.map((letter, index) => (
                    <span
                        key={index}
                        className="ink-letter"
                        data-ink={index < pressed ? 'full' : index === pressed ? 'wet' : 'dry'}
                        style={{ '--i': index }}
                    >
                        {letter}
                    </span>
                ))}
            </span>
        </span>
    );
}

export function ProjectTitleText({ project }) {
    return (
        <>
            {project.ongoing ? (
                <PressingName name={project.name} />
            ) : (
                <span className="ink-title block whitespace-nowrap">{project.name}</span>
            )}
            {project.subtitle && (
                <>
                    <span className="sr-only">: </span>
                    <span className="ink-sub mt-[0.12em] block whitespace-nowrap text-[0.55em] font-medium italic tracking-[-0.02em]">
                        {project.subtitle}
                    </span>
                </>
            )}
        </>
    );
}

export function ProjectMeta({ project, className = '' }) {
    return (
        <p className={`flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] text-muted md:text-[12px] ${className}`}>
            <span className="font-semibold text-primary">{project.org}</span>
            <span aria-hidden="true" className="text-black/25">
                ·
            </span>
            {project.award ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary py-1 pl-2 pr-2.5 font-medium text-white">
                    <Award size={12} strokeWidth={2} aria-hidden="true" />
                    {project.award}
                </span>
            ) : (
                <span>{project.role}</span>
            )}
            {project.ongoing && (
                <>
                    <span aria-hidden="true" className="text-black/25">
                        ·
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-white py-[3px] pl-2 pr-2.5 font-medium text-primary">
                        <span aria-hidden="true" className="ongoing-dot" />
                        Ongoing
                    </span>
                </>
            )}
        </p>
    );
}
