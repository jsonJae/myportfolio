import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSquareLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import aboutMePic from '../assets/AboutMePic.png';

export default function About() {
    const aboutMe1 =
        "A junior student at UPLB and a designer and developer who bridges creativity and code. I craft intuitive digital experiences through thoughtful design and bring them to life with clean, efficient development."
    const aboutMe2 =
        "With expertise spanning graphic design, UI/UX, and full-stack development, I approach every project with both an aesthetic eye and technical precision. Whether I'm creating visual identities, sketching wireframes, or debugging code, my goal is to create solutions that are not only beautiful but functional and user-centered.";
    const aboutMe3 =
        "I believe great digital products exist at the intersection of form and function – where elegant design meets robust engineering. Let's build something remarkable together.";

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen items-center px-4 md:px-0 pt-16 md:pt-20">
            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-110 justify-center w-full">
                    <p className="text-[40px] md:text-[64px] text-primary font-hartwell text-center mb-6 mt-10">
                        Hey, I'm Jason
                    </p>

                    <div className="shadow-neu rounded-3xl p-6 md:p-8 bg-surface space-y-4">
                        <p className="text-[12px] text-black font-ambulatoria text-justify">
                            {aboutMe1}
                        </p>
                        <p className="text-[12px] text-black font-ambulatoria text-justify">
                            {aboutMe2}
                        </p>
                        <p className="text-[12px] text-black font-ambulatoria text-justify">
                            {aboutMe3}
                        </p>
                    </div>

                    <div className="flex gap-4 mt-6">
                        {[
                            { icon: faGithub, onClick: () => window.open('https://github.com/jsonJae') },
                            { icon: faSquareLinkedin, onClick: () => window.open('https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app') },
                            { icon: faEnvelope, onClick: () => window.open('mailto:jasongian28@gmail.com') },
                        ].map(({ icon, onClick }) => (
                            <div
                                key={icon.iconName}
                                className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center cursor-pointer transition-all duration-400 ease-out hover:shadow-neu-small hover:scale-110 active:scale-95"
                                onClick={onClick}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && onClick()}
                            >
                                <FontAwesomeIcon icon={icon} size="lg" className="text-primary transition-all duration-400 ease-out hover:scale-110 hover:text-blue-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative shrink-0 max-w-full md:max-w-none mt-8 md:mt-0">
                <img
                    src={aboutMePic}
                    alt="About Me"
                    className="relative z-20"
                />
            </div>
        </div>
    );
}
