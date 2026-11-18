import { Award, ImageIcon } from 'lucide-react';

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
