import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

const projects = [
    {
        title: 'YSEIS',
        desc: "Leading the frontend team of YSES' Inventory System, a platform that digitizes how the organization tracks and manages its equipment and supplies.",
        tags: ['Frontend Lead', 'Inventory System', 'YSES'],
        role: 'Frontend Lead · YSES',
        mark: 'YS',
    },
    {
        title: 'SPACES',
        desc: "Co-developed a centralized student accommodation tracker for UPLB, replacing manual forms, spreadsheets, and email threads with one streamlined digital platform.",
        tags: ['SvelteKit', 'PocketBase', 'Go'],
        role: 'Frontend Developer · UPLB',
        mark: 'SP',
    },
    {
        title: 'SIPAT: Ang Resibo ng Bayan',
        desc: "An offline-first, privacy-preserving mobile app that gamifies auditing government infrastructure, matching contract promises against geotagged community photos.",
        tags: ['Flutter', 'Hive', 'Civic Tech'],
        role: 'Hack the Flood · Most Innovative',
        mark: 'SI',
    },
    {
        title: 'QE 360 Event Platform',
        desc: "Built full-stack features across attendee, judge, and admin views, integrated MUX video streaming, and shipped a RAG chatbot backed by Supabase.",
        tags: ['Next.js', 'Supabase', 'MUX'],
        role: 'Full-Stack Intern · QE 360',
        mark: 'QE',
    },
];

const grid = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
    hidden: { opacity: 0, y: 44, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

function ProjectCard({ title, desc, tags, role, mark }) {
    return (
        <>
            <div className="relative w-full h-44 md:h-48 rounded-well bg-surface shadow-neu-inset mb-6 overflow-hidden flex items-center justify-center">
                <span aria-hidden="true" className="text-primary/10 font-display font-black text-[64px] leading-none select-none">
                    {mark}
                </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl md:text-3xl text-primary font-display font-black leading-tight heading-balance">{title}</h3>
                <span className="font-mono text-[12px] text-muted">{role}</span>
            </div>
            <p className="text-[13px] md:text-[14px] text-ink-soft font-body mt-3 leading-[1.75]">{desc}</p>
            <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="font-mono text-[11px] font-medium px-3 py-1 rounded-full shadow-neu-small text-ink-soft bg-surface"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </>
    );
}

export default function Projects() {
    const reduced = useReducedMotion();

    return (
        <div className="flex flex-col min-h-screen px-4 md:px-0">
            <Reveal from="up" duration={0.9}>
                <div className="text-center pt-15">
                    <h2 id="projects-title" className="text-[40px] md:text-[64px] text-primary font-display font-black tracking-tight leading-[0.95] heading-balance">
                        <span className="font-normal italic">curated</span> works.
                    </h2>
                </div>
            </Reveal>
            <Reveal from="up" delay={0.08}>
                <p className="text-[13px] md:text-[14px] text-ink-soft font-body text-center mt-6 prose-measure mx-auto leading-[1.75]">
                    Selected work across full-stack web, cross-platform mobile, and civic tech, built through internships, collaboration, and hackathons.
                </p>
            </Reveal>

            <div className="flex justify-center">
                <motion.div
                    variants={reduced ? undefined : grid}
                    initial={reduced ? false : 'hidden'}
                    whileInView={reduced ? undefined : 'show'}
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 my-16 md:my-20 max-w-5xl w-full"
                >
                    {projects.map((project) => (
                        <motion.div key={project.title} variants={reduced ? undefined : item} className="h-full">
                            <TiltCard className="h-full shadow-neu rounded-panel bg-surface p-6 md:p-8 transition-shadow duration-300 ease-soft hover:shadow-neu-hover">
                                <ProjectCard {...project} />
                            </TiltCard>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
