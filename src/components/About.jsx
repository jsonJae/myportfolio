import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSquareLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
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
        { icon: faGithub, label: 'GitHub', onClick: () => window.open('https://github.com/jsonJae', '_blank', 'noopener,noreferrer') },
        { icon: faSquareLinkedin, label: 'LinkedIn', onClick: () => window.open('https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', '_blank', 'noopener,noreferrer') },
        { icon: faEnvelope, label: 'Email', onClick: () => window.open('mailto:jasongian28@gmail.com') },
    ]

    return (
        <section aria-labelledby="about-title" className="flex min-h-screen items-center justify-center px-4 py-24 md:px-8">
            <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:gap-16">
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

                    <div className="mt-7 max-w-[34rem] space-y-4">
                        {sentences.map((sentence) => (
                            <motion.p
                                key={sentence}
                                variants={reduced ? undefined : line}
                                className="text-[13px] md:text-[14px] text-ink-soft font-body leading-[1.75]"
                            >
                                {sentence}
                            </motion.p>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                        {links.map(({ icon, label, onClick }) => (
                            <motion.button
                                variants={reduced ? undefined : social}
                                type="button"
                                key={icon.iconName}
                                aria-label={label}
                                onClick={onClick}
                                className="group w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center cursor-pointer transition-shadow duration-300 ease-soft hover:shadow-neu-small active:shadow-neu-inset"
                            >
                                <FontAwesomeIcon icon={icon} size="lg" className="text-primary transition-transform duration-300 ease-soft group-hover:scale-110 group-hover:text-primary-hover" />
                            </motion.button>
                        ))}
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
                            className="block h-auto w-full drop-shadow-[0_18px_30px_rgba(163,177,198,0.4)] transition-[filter] duration-500 ease-soft group-hover:drop-shadow-[0_26px_42px_rgba(163,177,198,0.55)]"
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
