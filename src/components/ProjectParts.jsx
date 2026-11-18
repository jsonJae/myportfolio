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

export function ProjectMedia({ image, label = 'Project image', compact = false, plain = false, eager = false }) {
    if (image) {
        return (
            <img
                src={image.src}
                alt={image.alt ?? ''}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
                className="absolute inset-0 h-full w-full object-cover"
            />
        );
    }

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

export function ProjectTitleText({ project }) {
    return (
        <>
            <span className="ink-title block whitespace-nowrap">{project.name}</span>
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
        </p>
    );
}
