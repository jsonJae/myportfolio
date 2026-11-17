import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import Reveal from './Reveal';
import Contours from './Contours';

const experiences = [
    {
        id: 'komo',
        role: 'Freelance WordPress Developer',
        company: 'Komo Developments',
        period: 'Aug 2026 — Oct 2026',
        badge: 'Freelance Contract',
        context: 'Client work · Bricks Builder',
        tags: ['WordPress', 'Bricks Builder', 'Custom CSS', 'Brand Systems'],
        points: [
            'Translated client requirements into website designs alongside the client-facing team, building responsive custom layouts in Bricks Builder.',
            'Applied brand kits — colors, type, and logos — so every client site held a consistent visual system.',
        ],
    },
    {
        id: 'qe360',
        role: 'Full-Stack Software Engineer Intern',
        company: 'QE 360',
        period: 'May 2026 — Aug 2026',
        badge: 'Internship',
        context: 'Live event platform · Full-stack',
        tags: ['Next.js', 'Supabase', 'MUX Video', 'OpenAI API', 'RAG Chatbot'],
        points: [
            'Shipped full-stack features for a live event platform across attendee, judge, and admin views.',
            'Integrated MUX video streaming with webhooks, secrets, and environment variables for the deployed production site.',
            'Built a RAG chatbot on the OpenAI API with Supabase as its knowledge base.',
            'Wrote test charters and ran QA cases against user-story acceptance criteria.',
        ],
    },
    {
        id: 'ysest',
        role: 'Human Resources Department Member',
        company: "Young Software Engineers' Society",
        period: 'Sep 2024 — Present',
        badge: 'Student Organization',
        context: 'HR department · Onboarding & events',
        tags: ['Leadership', 'Event Operations', 'Mentorship', 'Community'],
        points: [
            'Help the HR department run member engagement activities, onboarding, and internal events for the organization.',
        ],
    },
];

export default function Experiences() {
    const reduced = useReducedMotion();

    const trackRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start 0.45', 'end 0.45'],
    });
    const smoothedProgress = useSpring(scrollYProgress, {
        stiffness: 170,
        damping: 30,
        mass: 0.35,
    });
    const progress = reduced ? scrollYProgress : smoothedProgress;

    const sectionRef = useRef(null);
    const cardRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [bandFractions, setBandFractions] = useState(null);

    // Map each role's card to a vertical slice of the contour map, then track
    // which card sits nearest the reading line so the glow can follow it.
    useEffect(() => {
        let frame = 0;

        const measureBands = () => {
            const section = sectionRef.current;
            if (!section) return;

            const sectionRect = section.getBoundingClientRect();
            const sectionHeight = sectionRect.height || 1;
            const next = cardRefs.current
                .filter(Boolean)
                .map((card) => {
                    const rect = card.getBoundingClientRect();
                    return (rect.top + rect.height / 2 - sectionRect.top) / sectionHeight;
                });

            if (!next.length) return;

            setBandFractions((prev) =>
                prev &&
                prev.length === next.length &&
                prev.every((value, index) => Math.abs(value - next[index]) < 0.004)
                    ? prev
                    : next,
            );
        };

        const measureActive = () => {
            frame = 0;
            const focusLine = window.innerHeight * 0.45;
            let nextIndex = 0;
            let closest = Infinity;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                const rect = card.getBoundingClientRect();
                const distance = Math.abs(rect.top + rect.height / 2 - focusLine);
                if (distance < closest) {
                    closest = distance;
                    nextIndex = index;
                }
            });

            setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        };

        const handleScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(measureActive);
        };

        const handleResize = () => {
            measureBands();
            handleScroll();
        };

        measureBands();
        measureActive();

        const observer =
            typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => measureBands())
                : null;
        if (observer && sectionRef.current) observer.observe(sectionRef.current);

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            if (observer) observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative flex min-h-screen flex-col justify-center px-4 py-24 md:px-8 overflow-hidden"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <Contours
                    activeIndex={activeIndex}
                    bandFractions={bandFractions ?? undefined}
                />
            </div>

            <div className="relative z-10">
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
                        Internships, freelance projects, and student-org roles — building real systems with people.
                    </p>
                </Reveal>

                <div className="mx-auto mt-14 w-full max-w-4xl">
                    <div className="relative pl-6 sm:pl-8 md:pl-10">
                        <div
                            ref={trackRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-8 left-[12px] top-8 w-[2px] sm:left-[16px] md:left-[20px]"
                        >
                            <div className="absolute inset-0 rounded-full bg-black/[0.08]" />
                            <motion.div
                                style={{ scaleY: progress }}
                                className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-primary via-primary to-primary-hover shadow-[0_0_8px_rgba(8,36,169,0.45)]"
                            />
                        </div>

                        <ol className="space-y-8">
                            {experiences.map((exp, index) => (
                                <li
                                    key={exp.id}
                                    ref={(node) => {
                                        cardRefs.current[index] = node;
                                    }}
                                    className="relative"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`absolute -left-[16px] top-7 z-10 h-2.5 w-2.5 rounded-full border-2 border-primary bg-primary ring-[3px] ring-surface transition-[box-shadow,transform] duration-500 ease-soft sm:-left-[20px] md:-left-[24px] md:top-8 ${
                                            activeIndex === index
                                                ? 'scale-110 shadow-[0_0_0_4px_rgba(8,36,169,0.14),0_0_16px_rgba(8,36,169,0.6)]'
                                                : 'scale-100 shadow-[0_0_0_0_rgba(8,36,169,0),0_0_0_rgba(8,36,169,0)]'
                                        }`}
                                    />

                                    <Reveal from="up" delay={reduced ? 0 : index * 0.06}>
                                        <article className="rounded-card border border-black/[0.06] bg-white/90 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7 md:p-8">
                                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                                                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] font-semibold text-primary">
                                                    <Briefcase size={13} className="shrink-0" />
                                                    <span>{exp.company}</span>
                                                    <span aria-hidden="true" className="text-black/25">
                                                        ·
                                                    </span>
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-primary">
                                                        {exp.badge}
                                                    </span>
                                                </div>

                                                <div className="w-full sm:w-auto sm:shrink-0">
                                                    <div className="flex w-fit items-center gap-1.5 rounded-full border border-black/[0.06] bg-surface/80 px-3 py-1 font-mono text-[11px] font-medium text-muted">
                                                        <Calendar size={12} className="shrink-0" />
                                                        <span>{exp.period}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="mt-2 font-display text-[22px] font-black leading-snug text-primary heading-balance sm:text-2xl md:text-[26px]">
                                                {exp.role}
                                            </h3>

                                            <p className="mt-1.5 font-mono text-[12px] text-muted">
                                                {exp.context}
                                            </p>

                                            <div className="mt-5 border-t border-black/[0.06] pt-5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {exp.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center rounded-full border border-black/[0.05] bg-surface px-2.5 py-1 font-mono text-[10px] font-medium text-ink-soft"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <ul className="mt-4 space-y-2.5">
                                                    {exp.points.map((point) => (
                                                        <li
                                                            key={point}
                                                            className="flex gap-3 font-body text-[13px] leading-[1.75] text-ink-soft text-pretty md:text-[14px]"
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                                            />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </article>
                                    </Reveal>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
