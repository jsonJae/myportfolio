import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Calendar, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import Ridges from './Ridges';

const experiences = [
    {
        id: 'komo',
        role: 'Freelance WordPress Developer',
        company: 'Komo Developments',
        period: 'Aug 2026 — Oct 2026',
        badge: 'Recent Contract',
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
        badge: 'Engineering Internship',
        context: 'Next.js · Supabase · MUX · OpenAI',
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
        badge: 'Current Community Org',
        context: 'Community · Onboarding · Events',
        tags: ['Leadership', 'Event Operations', 'Mentorship', 'Community'],
        points: [
            'Help the HR department run member engagement activities, onboarding, and internal events for the organization.',
        ],
    },
];

export default function Experiences() {
    const reduced = useReducedMotion();
    const [selectedExpId, setSelectedExpId] = useState(experiences[0].id);
    const [scrollProgress, setScrollProgress] = useState(0);

    const timelineContainerRef = useRef(null);
    const cardRefs = useRef({});
    const isManualScrolling = useRef(false);

    // Scroll listener:
    // 1. Advances the glowing visual progress indicator on the vertical timeline track.
    // 2. Automatically expands the experience closest to the active viewport focus (unless user just clicked one).
    useEffect(() => {
        const handleScroll = () => {
            const container = timelineContainerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Track progress through timeline bounds (0 to 1)
            const totalScrollableDistance = rect.height;
            const currentPosition = viewportHeight * 0.45 - rect.top;
            const progress = Math.max(0, Math.min(1, currentPosition / totalScrollableDistance));
            setScrollProgress(progress);

            // Skip auto-detecting while a smooth click scroll is currently animating
            if (isManualScrolling.current) return;

            const focalPoint = viewportHeight * 0.45;
            let closestId = null;
            let closestDistance = Infinity;

            experiences.forEach((exp) => {
                const el = cardRefs.current[exp.id];
                if (el) {
                    const cardRect = el.getBoundingClientRect();
                    const cardCenter = cardRect.top + cardRect.height * 0.35;
                    const distance = Math.abs(cardCenter - focalPoint);

                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestId = exp.id;
                    }
                }
            });

            if (closestId && closestId !== selectedExpId) {
                setSelectedExpId(closestId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial evaluate

        return () => window.removeEventListener('scroll', handleScroll);
    }, [selectedExpId]);

    // When an experience is clicked: automatically smooth scroll to it and expand it
    const handleExperienceClick = (id) => {
        setSelectedExpId(id);
        isManualScrolling.current = true;

        const el = cardRefs.current[id];
        if (el) {
            // Smoothly center the clicked experience card in view
            const elRect = el.getBoundingClientRect();
            const absoluteElTop = elRect.top + window.scrollY;
            const targetY = absoluteElTop - window.innerHeight * 0.28;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }

        // Re-enable auto-scroll observer after smooth scroll completes
        setTimeout(() => {
            isManualScrolling.current = false;
        }, 700);
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center px-4 py-24 md:px-8 overflow-hidden">
            {/* Ambient Ridges Background inside Experience Section */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
                <Ridges />
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
                        Internships, freelance work, and org leadership building real systems with people.
                    </p>
                </Reveal>

                {/* Interactive Timeline Container */}
                <div ref={timelineContainerRef} className="mx-auto mt-14 w-full max-w-4xl">
                    {/* Timeline Stem & Milestone Entries */}
                    <div className="relative pl-6 sm:pl-8 md:pl-10">
                        {/* Background Connecting Track Line */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-[11px] sm:left-[15px] md:left-[19px] top-4 bottom-6 w-[2px] bg-black/[0.08]"
                        />

                        {/* Active Gradient Fill Line that advances with scroll */}
                        <div
                            aria-hidden="true"
                            style={{
                                height: `${scrollProgress * 100}%`,
                            }}
                            className="pointer-events-none absolute left-[11px] sm:left-[15px] md:left-[19px] top-4 max-h-[calc(100%-2.5rem)] w-[2px] bg-gradient-to-b from-primary via-primary to-primary-hover shadow-[0_0_8px_rgba(8,36,169,0.5)] transition-[height] duration-150 ease-out"
                        />

                        {/* Visual Glowing Indicator Dot that glides down the line on scroll */}
                        <div
                            aria-hidden="true"
                            style={{
                                top: `calc(1rem + ${scrollProgress * 100}% * 0.88)`,
                            }}
                            className="pointer-events-none absolute left-[8px] sm:left-[12px] md:left-[16px] z-20 h-2 w-2 -translate-x-[0.5px] rounded-full bg-primary shadow-[0_0_12px_rgba(8,36,169,0.8),0_0_4px_rgba(8,36,169,1)] transition-[top] duration-150 ease-out"
                        >
                            <span className="absolute -inset-1 rounded-full bg-primary/30 animate-ping" />
                        </div>

                        <div className="space-y-8">
                            {experiences.map((exp) => {
                                const isSelected = selectedExpId === exp.id;

                                return (
                                    <motion.div
                                        key={exp.id}
                                        ref={(el) => (cardRefs.current[exp.id] = el)}
                                        layout
                                        transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative group"
                                    >
                                        {/* Timeline Node / Indicator Dot */}
                                        <button
                                            type="button"
                                            aria-label={`Select and scroll to ${exp.role} at ${exp.company}`}
                                            onClick={() => handleExperienceClick(exp.id)}
                                            className={`absolute -left-[23px] sm:-left-[27px] md:-left-[31px] top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                isSelected
                                                    ? 'border-primary bg-primary text-white shadow-[0_0_0_4px_rgba(8,36,169,0.2)] scale-110'
                                                    : 'border-primary/40 bg-white text-primary hover:border-primary hover:scale-105'
                                            }`}
                                        >
                                            <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                                        </button>

                                        {/* Interactive Card */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            aria-expanded={isSelected}
                                            onClick={() => handleExperienceClick(exp.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleExperienceClick(exp.id);
                                                }
                                            }}
                                            className={`cursor-pointer rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-6 sm:p-7 md:p-8 backdrop-blur-[2px] ${
                                                isSelected
                                                    ? 'bg-white/95 border-primary/40 shadow-[0_16px_36px_-12px_rgba(8,36,169,0.18)] ring-1 ring-primary/20'
                                                    : 'bg-white/70 border-black/[0.06] hover:bg-white/90 hover:border-primary/20 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]'
                                            }`}
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-primary">
                                                        <Briefcase size={13} className="shrink-0" />
                                                        <span>{exp.company}</span>
                                                        <span className="text-black/25">·</span>
                                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] tracking-wide text-primary">
                                                            {exp.badge}
                                                        </span>
                                                    </div>
                                                    <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-black leading-snug text-primary md:text-[26px]">
                                                        {exp.role}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-surface/80 px-3 py-1 font-mono text-[11px] font-medium text-muted">
                                                    <Calendar size={12} className="shrink-0" />
                                                    <span>{exp.period}</span>
                                                </div>
                                            </div>

                                            <p className="mt-2 font-mono text-[12px] text-muted">
                                                {exp.context}
                                            </p>

                                            {/* Expandable detailed accomplishments */}
                                            <AnimatePresence initial={false}>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-5 pt-5 border-t border-black/[0.06]">
                                                            {/* Tech Stack Pills */}
                                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                                {exp.tags.map((tag) => (
                                                                    <span
                                                                        key={tag}
                                                                        className="inline-flex items-center gap-1 rounded-md bg-surface px-2.5 py-1 font-mono text-[10px] font-medium text-ink-soft border border-black/[0.04]"
                                                                    >
                                                                        <Sparkles size={10} className="text-primary/70" />
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Bullet points */}
                                                            <ul className="space-y-2.5">
                                                                {exp.points.map((point) => (
                                                                    <li
                                                                        key={point}
                                                                        className="flex gap-3 font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]"
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
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Card footer indicator */}
                                            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-primary/75">
                                                <span className="text-[10px] text-muted">
                                                    {isSelected ? 'Active milestone' : 'Click to scroll & expand'}
                                                </span>
                                                <ChevronRight
                                                    size={14}
                                                    className={`transition-transform duration-300 ${isSelected ? 'rotate-90 text-primary' : 'group-hover:translate-x-0.5'}`}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
