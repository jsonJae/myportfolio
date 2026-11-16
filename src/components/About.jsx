import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { ArrowDownToLine } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

import aboutMePic from '../assets/AboutMePic.png';

const ease = [0.16, 1, 0.3, 1]

const stage = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
}

const intro = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

const word = {
    hidden: { y: '112%' },
    show: { y: '0%', transition: { duration: 1.05, ease } },
}

const nameGroup = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
}

const letter = {
    hidden: { y: '118%' },
    show: { y: '0%', transition: { duration: 0.85, ease } },
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

    const links = [
        { icon: faGithub, label: 'GitHub', href: 'https://github.com/jsonJae' },
        { icon: faLinkedinIn, label: 'LinkedIn', href: 'https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
        { icon: faEnvelope, label: 'Email', href: 'mailto:jasongian28@gmail.com' },
    ]

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
                    <h2 id="about-title" className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 text-primary">
                        <span className="inline-block overflow-hidden pb-[0.22em] -mb-[0.22em]">
                            <motion.span
                                variants={reduced ? undefined : word}
                                className="inline-block font-display text-[30px] font-medium italic leading-none tracking-[-0.02em] text-primary/80 md:text-[44px]"
                            >
                                hey, I’m
                            </motion.span>
                        </span>
                        <span className="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                            <motion.span
                                variants={reduced ? undefined : nameGroup}
                                className="inline-flex font-display text-[56px] font-black leading-[0.92] tracking-[-0.045em] text-primary md:text-[88px]"
                            >
                                {['J', 'a', 's', 'o', 'n'].map((char) => (
                                    <motion.span
                                        key={char}
                                        variants={reduced ? undefined : letter}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.span>
                        </span>
                    </h2>

                    <div className="mt-8 max-w-[40rem]">
                        <motion.p
                            variants={reduced ? undefined : line}
                            className="text-pretty font-mono text-[15px] leading-[1.75] text-ink-soft md:text-[17px]"
                        >
                            I’m a Computer Science senior at the University of the Philippines Los Baños, based in{' '}
                            <strong className="font-semibold text-ink">Muntinlupa, Philippines</strong>. I build
                            full-stack web and cross-platform mobile products end to end.
                        </motion.p>

                        <motion.p
                            variants={reduced ? undefined : line}
                            className="mt-5 font-mono text-[15px] leading-[1.75] text-ink-soft md:text-[17px]"
                        >
                            Design and engineering stay side by side in my work, and right now I’m most curious about{' '}
                            <strong className="font-semibold text-ink">where AI is headed</strong>.
                        </motion.p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <motion.a
                            variants={reduced ? undefined : line}
                            href="/DURAN-RESUME.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="group relative inline-flex items-center overflow-hidden rounded-full border border-primary/35 bg-transparent px-6 py-3 font-display text-[13px] font-bold tracking-[0.03em] text-primary transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_14px_28px_-10px_rgba(8,36,169,0.45)] active:translate-y-0 active:scale-[0.98] md:text-[14px]"
                        >
                            {/* Wipe backdrop fill matching navbar dock */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-soft group-hover:scale-x-100"
                            />
                            <span className="relative z-10 inline-flex items-center gap-2.5 transition-colors duration-300 group-hover:text-white">
                                <ArrowDownToLine
                                    size={15}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 ease-soft group-hover:translate-y-0.5"
                                />
                                <span>Résumé</span>
                            </span>
                        </motion.a>

                        <div className="flex items-center gap-1">
                            {links.map((link) => (
                                <motion.a
                                    variants={reduced ? undefined : social}
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full text-ink/60 transition-[color,transform] duration-300 ease-soft hover:-translate-y-0.5 hover:text-primary"
                                >
                                    <FontAwesomeIcon icon={link.icon} aria-hidden="true" className="text-[21px] transition-transform duration-300 ease-soft group-hover:scale-105" />
                                </motion.a>
                            ))}
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
