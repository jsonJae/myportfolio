import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { CodeXml, LayoutTemplate, UsersRound } from 'lucide-react';
import Reveal from './Reveal';
import Contours from './Contours';

const experiences = [
    {
        id: 'komo',
        role: 'Freelance WordPress Developer',
        company: 'Komo Developments',
        period: 'Aug 2026 — Oct 2026',
        type: 'Freelance contract',
        icon: LayoutTemplate,
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
        type: 'Internship',
        icon: CodeXml,
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
        type: 'Student organization',
        icon: UsersRound,
        tags: ['Leadership', 'Event Operations', 'Mentorship', 'Community'],
        points: [
            'Help the HR department run member engagement activities, onboarding, and internal events for the organization.',
        ],
    },
];

// Soft spotlight that follows the cursor inside a card. Writes two CSS
// variables on the card itself, so only that one card repaints.
function trackSpotlight(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

function ExperienceCard({ exp, active }) {
    const Icon = exp.icon;

    return (
        <article
            data-active={active}
            onPointerMove={trackSpotlight}
            className="group/card relative overflow-hidden rounded-card border border-black/[0.06] bg-white/85 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[transform,border-color,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_44px_-26px_rgba(8,36,169,0.45)] data-[active=true]:border-primary/20 data-[active=true]:shadow-[0_18px_40px_-28px_rgba(8,36,169,0.4)] sm:p-7 md:p-8"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-soft group-hover/card:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,0%),rgba(8,36,169,0.07),transparent_70%)]"
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:gap-5">
                <span
                    aria-hidden="true"
                    className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-primary/20 bg-surface text-primary transition-[color,border-color] duration-500 ease-soft group-hover/card:border-primary group-hover/card:text-white group-data-[active=true]/card:border-primary group-data-[active=true]/card:text-white"
                >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-soft group-hover/card:scale-x-100 group-data-[active=true]/card:scale-x-100" />
                    <Icon size={20} strokeWidth={1.75} className="relative" />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
                        <p>
                            <span className="font-semibold text-primary">{exp.company}</span>
                            <span aria-hidden="true" className="px-1.5 text-black/25">
                                ·
                            </span>
                            {exp.type}
                        </p>
                        <p className="tabular-nums">{exp.period}</p>
                    </div>

                    <h3 className="mt-1.5 font-display text-[28px] leading-[1.08] text-primary heading-balance sm:text-[32px]">
                        {exp.role}
                    </h3>

                    <ul className="mt-4 space-y-2">
                        {exp.points.map((point) => (
                            <li
                                key={point}
                                className="flex gap-3 font-body text-[13px] leading-[1.75] text-ink-soft text-pretty md:text-[14px]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-[0.75em] h-1 w-1 shrink-0 rounded-full bg-primary/60"
                                />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-5 font-mono text-[11px] leading-[1.7] text-muted transition-colors duration-500 ease-soft group-hover/card:text-primary group-data-[active=true]/card:text-primary">
                        <span className="sr-only">Stack: </span>
                        {exp.tags.join(' / ')}
                    </p>
                </div>
            </div>
        </article>
    );
}

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
                            className="font-display text-[48px] leading-[0.92] tracking-[-0.02em] text-primary heading-balance md:text-[80px]"
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

                                    <Reveal from="up" blur={0} delay={reduced ? 0 : index * 0.06}>
                                        <ExperienceCard exp={exp} active={activeIndex === index} />
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
