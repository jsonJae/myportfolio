import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSquareLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import aboutMePic from '../assets/AboutMePic.png';




export default function About(){
    const aboutMe1 = 
        "A junior student at UPLB and a designer and developer who bridges creativity and code. I craft intuitive digital experiences through thoughtful design and bring them to life with clean, efficient development."
    const aboutMe2 = 
        "With expertise spanning graphic design, UI/UX, and full-stack development, I approach every project with both an aesthetic eye and technical precision. Whether I'm creating visual identities, sketching wireframes, or debugging code, my goal is to create solutions that are not only beautiful but functional and user-centered.";
    const aboutMe3 = 
        "I believe great digital products exist at the intersection of form and function – where elegant design meets robust engineering. Let's build something remarkable together.";

    return (
        <div className="flex flex-row w-full min-h-screen">

            <div className="flex flex-1 justify-center">
                <div className="flex flex-col max-w-110 justify-center">
                    <p className="text-[64px] text-[#0824A9] font-hartwell text-center mb-2 mt-10">
                        Hey, I'm Jason
                    </p>

                    <div className='space-y-2'>
                        <p className="text-[12px] text-black font-ambulatoria text-justify mt-2">
                            {aboutMe1}
                        </p>
                        <p className="text-[12px] text-black font-ambulatoria text-justify mt-2">
                            {aboutMe2}
                        </p>
                        <p className="text-[12px] text-black font-ambulatoria text-justify mt-2 mb-4">
                            {aboutMe3}
                        </p>
                    </div>

                    <div className='flex gap-2'>
                        <FontAwesomeIcon icon={faGithub} size="xl" style={{color: "#0824a9",}} className='cursor-pointer' onClick={() => window.open('https://github.com/jsonJae')}/>
                        <FontAwesomeIcon icon={faSquareLinkedin} size="xl" style={{color: "#0824a9",}} className='cursor-pointer' onClick={() => window.open('https://www.linkedin.com/in/jason-gian-duran-4754a7355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app')} />
                        <FontAwesomeIcon icon={faEnvelope} size="xl" style={{color: "#0824a9",}} onClick={() => window.open('mailto:jasongian28@gmail.com')} className='cursor-pointer' />
                    </div>
                </div>
            </div>

            <img src={aboutMePic} className="shrink-0" alt="About Me"/>
        </div>
    );
}
