import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSquareLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import aboutMePic from '../assets/AboutMePic.png';
import Reveal from './Reveal';

export default function About() {
    const aboutMe1 =
        "I'm a Computer Science senior at the University of the Philippines Los Baños with a builder's mindset and a growing focus on AI and autonomous development workflows."
    const aboutMe2 =
        "I ship full-stack web and cross-platform mobile products end-to-end, from architecture to deployment. I work across the MERN stack, Flutter with Firebase, SvelteKit with PocketBase, and Next.js with Supabase, and I treat AI coding agents like Copilot, Antigravity, and Opencode as collaborators, directing them to move faster while owning every design decision."
    const aboutMe3 =
        "Design and engineering sit side by side in my work, so the products I build stay beautiful, functional, and user-centered. I'm looking for an internship that puts both my curiosity about where AI is headed and my ability to execute independently to good use."

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen items-center px-4 md:px-0 pt-16 md:pt-20">
            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-110 justify-center w-full">
                    <Reveal from="up" duration={0.9}>
                        <p className="text-[40px] md:text-[64px] text-primary font-display font-black tracking-tight text-center mb-6 mt-10">
                            Hey, I'm Jason
                        </p>
                    </Reveal>

                    <Reveal from="up" delay={0.08}>
                        <div className="shadow-neu rounded-3xl p-6 md:p-8 bg-surface space-y-4">
                            <p className="text-[13px] md:text-[14px] text-ink-soft font-body leading-[1.75] text-left md:text-justify">
                                {aboutMe1}
                            </p>
                            <p className="text-[13px] md:text-[14px] text-ink-soft font-body leading-[1.75] text-left md:text-justify">
                                {aboutMe2}
                            </p>
                            <p className="text-[13px] md:text-[14px] text-ink-soft font-body leading-[1.75] text-left md:text-justify">
                                {aboutMe3}
                            </p>
                        </div>
                    </Reveal>

                    <Reveal from="up" delay={0.16}>
                        <div className="flex gap-4 mt-6">
                            {[
                                { icon: faGithub, label: 'GitHub', onClick: () => window.open('https://github.com/jsonJae', '_blank', 'noopener,noreferrer') },
                                { icon: faSquareLinkedin, label: 'LinkedIn', onClick: () => window.open('https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', '_blank', 'noopener,noreferrer') },
                                { icon: faEnvelope, label: 'Email', onClick: () => window.open('mailto:jasongian28@gmail.com') },
                            ].map(({ icon, label, onClick }) => (
                                <button
                                    type="button"
                                    key={icon.iconName}
                                    aria-label={label}
                                    onClick={onClick}
                                    className="group w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center cursor-pointer transition-all duration-300 ease-soft hover:shadow-neu-small hover:scale-110 active:scale-95 active:shadow-neu-inset"
                                >
                                    <FontAwesomeIcon icon={icon} size="lg" className="text-primary transition-all duration-300 ease-soft group-hover:scale-110 group-hover:text-primary-hover" />
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>

            <Reveal from="right" delay={0.12} className="relative shrink-0 max-w-full md:max-w-none mt-8 md:mt-0">
                <img
                    src={aboutMePic}
                    alt="About Me"
                    className="relative z-20"
                />
            </Reveal>
        </div>
    );
}
