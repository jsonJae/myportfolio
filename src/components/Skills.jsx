import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const groups = [
    {
        label: 'Tech Stacks',
        items: ['MERN', 'Flutter + Firebase', 'SvelteKit + PocketBase', 'Next.js + Supabase'],
    },
    {
        label: 'Languages',
        items: ['JavaScript', 'Python', 'Dart', 'Java', 'C', 'R'],
    },
    {
        label: 'Databases',
        items: ['MongoDB', 'MariaDB', 'Firebase', 'PocketBase', 'Supabase'],
    },
    {
        label: 'Tools',
        items: ['Git & GitHub', 'VS Code', 'Figma', 'Google Antigravity', 'GitHub Copilot', 'Google Stitch', 'Opencode'],
    },
    {
        label: 'Design',
        items: ['UI/UX Design', 'Graphic Design'],
    },
];

const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const row = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function Skills() {
    const reduced = useReducedMotion();

    return (
        <div className="flex min-h-screen flex-col justify-center px-4 py-24 md:px-8">
            <Reveal from="up" duration={0.9}>
                <div className="text-center">
                    <h2
                        id="stack-title"
                        className="font-display text-[40px] font-black leading-[0.95] tracking-tight text-primary heading-balance md:text-[64px]"
                    >
                        <span className="font-normal italic">tools</span> of the trade.
                    </h2>
                </div>
            </Reveal>
            <Reveal from="up" delay={0.08}>
                <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                    The stacks, languages, and tools I reach for, from a blank Figma file to a deployed product.
                </p>
            </Reveal>

            <motion.div
                variants={reduced ? undefined : list}
                initial={reduced ? false : 'hidden'}
                whileInView={reduced ? undefined : 'show'}
                viewport={{ once: true, margin: '-80px' }}
                className="mx-auto mt-14 w-full max-w-4xl"
            >
                {groups.map((group) => (
                    <motion.div
                        key={group.label}
                        variants={reduced ? undefined : row}
                        className="grid gap-2 py-6 md:grid-cols-[10rem_1fr] md:gap-8"
                    >
                        <span className="font-display text-[15px] font-bold text-primary md:text-[16px]">
                            {group.label}
                        </span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[12px] leading-[1.9] text-ink-soft md:text-[13px]">
                            {group.items.map((item, index) => (
                                <span key={item} className="whitespace-nowrap">
                                    {item}
                                    {index < group.items.length - 1 && (
                                        <span aria-hidden="true" className="ml-3 text-muted">
                                            /
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
