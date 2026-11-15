import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faDownload } from '@fortawesome/free-solid-svg-icons'
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

    const sentences = [
        "I'm a Computer Science senior at the University of the Philippines Los Baños who builds full-stack web and cross-platform mobile products end to end.",
        "Design and engineering stay side by side in my work, and right now I'm most curious about where AI is headed.",
    ]

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
                        className="text-[40px] md:text-[64px] text-primary font-display font-black tracking-tight leading-[0.95] heading-balance"
                    >
                        {['Hey,', "I'm", 'Jason'].map((text, index) => (
                            <span
                                key={text}
                                className={`inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]${index < 2 ? ' mr-[0.22em]' : ''}`}
                            >
                                <motion.span
                                    variants={reduced ? undefined : word}
                                    className={`inline-block${index === 2 ? ' font-normal italic' : ''}`}
                                >
                                    {text}
                                </motion.span>
                            </span>
                        ))}
                    </h2>

                    <div className="mt-7 max-w-[36rem] space-y-5">
                        {sentences.map((sentence) => (
                            <motion.p
                                key={sentence}
                                variants={reduced ? undefined : line}
                                className="text-[15px] md:text-[16px] text-ink-soft font-body leading-[1.8]"
                            >
                                {sentence}
                            </motion.p>
                        ))}
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <motion.a
                            variants={reduced ? undefined : line}
                            href="/DURAN-RESUME.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="group inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color] duration-300 ease-soft hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_10px_24px_-10px_rgba(8,36,169,0.45)] active:translate-y-0"
                        >
                            <FontAwesomeIcon icon={faDownload} aria-hidden="true" className="text-[14px] transition-transform duration-300 ease-soft group-hover:translate-y-0.5" />
                            Résumé
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
