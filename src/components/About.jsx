import { useState } from 'react'
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
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

// Kinetic greeting variants
const heyVariant = {
    hidden: { opacity: 0, y: 22, rotate: -8, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        rotate: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 18,
            mass: 0.8,
        },
    },
}

const imVariant = {
    hidden: { opacity: 0, y: 18, filter: 'blur(5px)' },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            mass: 0.8,
            delay: 0.06,
        },
    },
}

const nameGroup = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055, delayChildren: 0.16 } },
}

const letterEntrance = {
    hidden: { opacity: 0, y: 32, scale: 0.85, filter: 'blur(6px)' },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 320,
            damping: 16,
            mass: 0.75,
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

const letterTilts = [-5, 4, -4, 5, -3];

export default function About() {
    const reduced = useReducedMotion();
    const animate = reduced ? undefined : 'show';
    const initial = reduced ? false : 'hidden';

    // Interactive ripple wave counter for "Jason"
    const [waveId, setWaveId] = useState(0);
    const triggerWave = () => setWaveId((v) => v + 1);

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
                    <h2
                        id="about-title"
                        aria-label="hey, I’m Jason"
                        className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-primary select-none"
                    >
                        {/* Friendly animated greeting */}
                        <span className="inline-flex items-baseline gap-x-2 overflow-visible">
                            <motion.span
                                variants={reduced ? undefined : heyVariant}
                                className="inline-block overflow-visible"
                            >
                                <motion.span
                                    whileHover={
                                        reduced
                                            ? undefined
                                            : {
                                                  rotate: [0, -10, 10, -5, 5, 0],
                                                  scale: 1.08,
                                                  transition: { duration: 0.55, ease: 'easeInOut' },
                                              }
                                    }
                                    whileTap={reduced ? undefined : { scale: 0.94 }}
                                    className="inline-block cursor-pointer font-display text-[30px] font-medium italic leading-normal tracking-[-0.02em] text-primary/80 will-change-transform md:text-[44px]"
                                    title="Say hey!"
                                >
                                    hey,
                                </motion.span>
                            </motion.span>

                            <motion.span
                                variants={reduced ? undefined : imVariant}
                                className="inline-block overflow-visible"
                            >
                                <motion.span
                                    whileHover={
                                        reduced
                                            ? undefined
                                            : {
                                                  y: -4,
                                                  scale: 1.06,
                                                  transition: { type: 'spring', stiffness: 400, damping: 15 },
                                              }
                                    }
                                    className="inline-block font-display text-[30px] font-medium italic leading-normal tracking-[-0.02em] text-primary/80 will-change-transform md:text-[44px]"
                                >
                                    I’m
                                </motion.span>
                            </motion.span>
                        </span>

                        {/* Interactive kinetic name with tactile spring physics and click ripple */}
                        <span className="inline-block overflow-visible">
                            <motion.span
                                variants={reduced ? undefined : nameGroup}
                                onClick={triggerWave}
                                title="Click for ripple wave"
                                className="inline-flex cursor-pointer font-display text-[56px] font-black leading-normal tracking-[-0.045em] text-primary md:text-[88px]"
                            >
                                {['J', 'a', 's', 'o', 'n'].map((char, index) => (
                                    <motion.span
                                        key={`${char}-${index}`}
                                        variants={reduced ? undefined : letterEntrance}
                                        className="inline-block overflow-visible"
                                    >
                                        <motion.span
                                            whileHover={
                                                reduced
                                                    ? undefined
                                                    : {
                                                          y: -16,
                                                          scale: 1.15,
                                                          rotate: letterTilts[index],
                                                          filter: 'drop-shadow(0 14px 22px rgba(8,36,169,0.35))',
                                                          transition: { type: 'spring', stiffness: 450, damping: 14 },
                                                      }
                                            }
                                            whileTap={
                                                reduced
                                                    ? undefined
                                                    : {
                                                          y: 3,
                                                          scale: 0.93,
                                                          filter: 'drop-shadow(0 2px 4px rgba(8,36,169,0.18))',
                                                          transition: { type: 'spring', stiffness: 600, damping: 20 },
                                                      }
                                            }
                                            animate={
                                                waveId > 0 && !reduced
                                                    ? {
                                                          y: [0, -22, 0],
                                                          rotate: [0, letterTilts[index] * 1.8, 0],
                                                          scale: [1, 1.15, 1],
                                                          transition: {
                                                              duration: 0.5,
                                                              delay: index * 0.055,
                                                              ease: [0.34, 1.56, 0.64, 1],
                                                          },
                                                      }
                                                    : undefined
                                            }
                                            className="inline-block transition-[color] will-change-transform"
                                        >
                                            {char}
                                        </motion.span>
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
                            <strong className="font-semibold text-ink">Muntinlupa, Metro Manila, Philippines</strong>. I build
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
                                <span>Resume</span>
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
