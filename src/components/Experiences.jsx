import { motion, useReducedMotion } from 'framer-motion';
import Reveal from './Reveal';

const experiences = [
    {
        role: 'Freelance WordPress Developer',
        company: 'Komo Developments',
        period: 'Aug 2026 — Oct 2026',
        context: 'Client work · Bricks Builder',
        points: [
            'Translated client requirements into website designs alongside the client-facing team, building responsive custom layouts in Bricks Builder.',
            'Applied brand kits — colors, type, and logos — so every client site held a consistent visual system.',
        ],
    },
    {
        role: 'Full-Stack Software Engineer Intern',
        company: 'QE 360',
        period: 'May 2026 — Aug 2026',
        context: 'Next.js · Supabase · MUX · OpenAI',
        points: [
            'Shipped full-stack features for a live event platform across attendee, judge, and admin views.',
            'Integrated MUX video streaming with webhooks, secrets, and environment variables for the deployed production site.',
            'Built a RAG chatbot on the OpenAI API with Supabase as its knowledge base.',
            'Wrote test charters and ran QA cases against user-story acceptance criteria.',
        ],
    },
    {
        role: 'Human Resources Department Member',
        company: "Young Software Engineers' Society",
        period: 'Sep 2024 — Present',
        context: 'Community · Onboarding · Events',
        points: [
            'Help the HR department run member engagement activities, onboarding, and internal events for the organization.',
        ],
    },
];

const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const entry = {
    hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function Experiences() {
    const reduced = useReducedMotion();

    return (
        <div className="flex min-h-screen flex-col justify-center px-4 py-24 md:px-8">
            <Reveal from="up" duration={0.9}>
                <div className="text-center">
                    <h2
                        id="experiences-title"
                        className="font-display text-[40px] font-black leading-[0.95] tracking-tight text-primary heading-balance md:text-[64px]"
                    >
                        <span className="font-normal italic">where</span> I’ve worked.
                    </h2>
                </div>
            </Reveal>
            <Reveal from="up" delay={0.08}>
                <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                    Internships, freelance work, and the org work that taught me how to build with people.
                </p>
            </Reveal>

            <motion.div
                variants={reduced ? undefined : list}
                initial={reduced ? false : 'hidden'}
                whileInView={reduced ? undefined : 'show'}
                viewport={{ once: true, margin: '-80px' }}
                className="mx-auto mt-16 w-full max-w-4xl"
            >
                {experiences.map((exp) => (
                    <motion.article
                        key={`${exp.company}-${exp.period}`}
                        variants={reduced ? undefined : entry}
                        className="grid gap-3 py-10 md:grid-cols-[12rem_1fr] md:gap-10"
                    >
                        <div className="font-mono text-[12px] leading-relaxed md:text-[13px]">
                            <p className="font-medium text-muted">{exp.period}</p>
                            <p className="mt-0.5 font-semibold text-primary">{exp.company}</p>
                        </div>
                        <div>
                            <h3 className="font-display text-2xl font-black leading-tight text-primary md:text-[28px]">
                                {exp.role}
                            </h3>
                            <p className="mt-1.5 font-mono text-[12px] text-muted">
                                {exp.context}
                            </p>
                            <ul className="mt-5 space-y-2.5">
                                {exp.points.map((point) => (
                                    <li
                                        key={point}
                                        className="flex gap-3 font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-primary/70"
                                        />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.article>
                ))}
            </motion.div>
        </div>
    );
}
