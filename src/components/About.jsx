import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ArrowDownToLine } from 'lucide-react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'

import aboutMePic from '../assets/AboutMePic.png';

const ease = [0.16, 1, 0.3, 1]

const stage = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}

const intro = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

// Kinetic title variants for "About Me"
const titleWordVariant = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 280,
            damping: 18,
            mass: 0.8,
        },
    },
}

const line = {
    hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
}

const portrait = {
    hidden: { opacity: 0, y: 54, scale: 1.04, filter: 'blur(12px)', clipPath: 'inset(0% 0% 100% 0%)' },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        clipPath: 'inset(0% 0% 0% 0%)',
        transition: { duration: 1.35, ease },
    },
}

const social = {
    hidden: { opacity: 0, scale: 0.55 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 18 } },
}

export default function About() {
    const reduced = useReducedMotion();
    const animate = reduced ? undefined : 'show';
    const initial = reduced ? false : 'hidden';

    // Active tooltip state for social icon buttons
    const [activeTooltip, setActiveTooltip] = useState(null);

    const links = [
        {
            icon: faGithub,
            label: 'GitHub',
            ariaLabel: 'GitHub profile',
            href: 'https://github.com/jsonJae',
            isExternal: true,
            iconClass: 'text-[17px]', // GitHub normalized optical scale
        },
        {
            icon: faLinkedinIn,
            label: 'LinkedIn',
            ariaLabel: 'LinkedIn profile',
            href: 'https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
            isExternal: true,
            iconClass: 'text-[16px]', // LinkedIn normalized optical scale
        },
        {
            icon: faEnvelope,
            label: 'Email',
            ariaLabel: 'Send email',
            href: 'mailto:jasongian28@gmail.com',
            isExternal: false,
            iconClass: 'text-[14.5px]', // Envelope normalized optical weight to prevent looking heavy
        },
    ];

    return (
        <section aria-labelledby="about-title" className="flex min-h-screen items-center justify-center px-4 py-24 md:px-8">
            <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] md:gap-16">
                <motion.div
                    variants={reduced ? undefined : intro}
                    initial={initial}
                    whileInView={animate}
                    viewport={{ once: true, margin: '-100px' }}
                    className="flex flex-col items-center text-center md:items-start md:text-left"
                >
                    <h2
                        id="about-title"
                        className="font-display text-[42px] font-black leading-[0.95] tracking-tight text-primary heading-balance select-none sm:text-[52px] md:text-[68px]"
                    >
                        <motion.span
                            variants={reduced ? undefined : titleWordVariant}
                            className="inline-block overflow-visible"
                        >
                            <span className="font-normal italic">About</span>{' '}
                            <span>Me.</span>
                        </motion.span>
                    </h2>

                    <div className="mt-8 max-w-[40rem]">
                        <motion.p
                            variants={reduced ? undefined : line}
                            className="text-pretty font-mono text-[15px] leading-[1.75] text-ink-soft md:text-[17px]"
                        >
                            I’m a Computer Science senior at the University of the Philippines Los Baños, based in{' '}
                            <strong className="font-semibold text-ink">Muntinlupa, Metro Manila, Philippines</strong>. I build
                            full-stack web and cross-platform mobile products end to end.
                        </motion.p>

                        <motion.p
                            variants={reduced ? undefined : line}
                            className="mt-5 font-mono text-[15px] leading-[1.75] text-ink-soft md:text-[17px]"
                        >
                            Right now I’m learning{' '}
                            <strong className="font-semibold text-ink">AI engineering and machine learning</strong> by
                            building small projects and wiring models into the software I already know how to make.
                        </motion.p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                        <div className="relative flex items-center justify-center">
                            <motion.a
                                variants={reduced ? undefined : line}
                                href="/DURAN-RESUME.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                aria-label="Download resume"
                                onMouseEnter={() => setActiveTooltip('resume')}
                                onMouseLeave={() => setActiveTooltip(null)}
                                onFocus={() => setActiveTooltip('resume')}
                                onBlur={() => setActiveTooltip(null)}
                                className="group relative inline-flex h-11 items-center overflow-hidden rounded-full border border-primary/35 bg-surface/50 px-5 font-mono text-[13px] font-bold tracking-[0.03em] text-primary shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_12px_24px_-8px_rgba(8,36,169,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] active:shadow-[inset_0_2px_4px_rgba(8,36,169,0.15)] md:text-[14px]"
                            >
                                {/* Wipe backdrop fill matching navbar dock */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100"
                                />
                                <span className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                                    <ArrowDownToLine
                                        size={15}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                        className="transition-transform duration-300 ease-soft group-hover:translate-y-0.5"
                                    />
                                    <span>Resume</span>
                                </span>
                            </motion.a>

                            {/* Accessible non-clipping tooltip, matching the social icons */}
                            <AnimatePresence>
                                {activeTooltip === 'resume' && (
                                    <motion.span
                                        role="tooltip"
                                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                        transition={{
                                            duration: reduced ? 0 : 0.16,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="pointer-events-none absolute -top-8.5 z-30 whitespace-nowrap rounded-md border border-black/[0.08] bg-surface px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.04em] text-ink shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
                                    >
                                        Download Resume
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-3">
                            {links.map((link) => {
                                const isHovered = activeTooltip === link.label;
                                return (
                                    <div key={link.label} className="relative flex items-center justify-center">
                                        <motion.a
                                            variants={reduced ? undefined : social}
                                            href={link.href}
                                            {...(link.isExternal
                                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                                : {})}
                                            aria-label={link.ariaLabel}
                                            onMouseEnter={() => setActiveTooltip(link.label)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                            onFocus={() => setActiveTooltip(link.label)}
                                            onBlur={() => setActiveTooltip(null)}
                                            className="group relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center overflow-hidden rounded-full border border-primary/25 bg-surface text-ink/75 shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_10px_22px_-6px_rgba(8,36,169,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-0 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(8,36,169,0.15)]"
                                        >
                                            {/* Horizontal wipe hover layer matching the navbar and resume */}
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100"
                                            />
                                            <FontAwesomeIcon
                                                icon={link.icon}
                                                aria-hidden="true"
                                                className={`relative z-10 ${link.iconClass} transition-[transform,color] duration-300 ease-soft group-hover:scale-110 group-hover:text-white`}
                                            />
                                        </motion.a>

                                        {/* Accessible non-clipping tooltip */}
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.span
                                                    role="tooltip"
                                                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                                    transition={{
                                                        duration: reduced ? 0 : 0.16,
                                                        ease: [0.16, 1, 0.3, 1],
                                                    }}
                                                    className="pointer-events-none absolute -top-8.5 z-30 whitespace-nowrap rounded-md border border-black/[0.08] bg-surface px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.04em] text-ink shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
                                                >
                                                    {link.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={reduced ? undefined : stage}
                    initial={initial}
                    whileInView={animate}
                    viewport={{ once: true, margin: '-100px' }}
                    className="relative flex w-full justify-center md:justify-end"
                >
                    <div className="group relative w-full max-w-[32rem] transition-transform duration-500 ease-soft hover:-translate-y-1.5">
                        <motion.img
                            variants={reduced ? undefined : portrait}
                            src={aboutMePic}
                            alt="Jason Gian Duran at his desk with papers tossed in the air"
                            draggable="false"
                            className="block h-auto w-full drop-shadow-[0_18px_32px_rgba(15,23,42,0.16)] transition-[filter] duration-500 ease-soft group-hover:drop-shadow-[0_26px_44px_rgba(15,23,42,0.22)]"
                            style={{
                                WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
                                maskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
