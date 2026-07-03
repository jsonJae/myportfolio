const projects = [
    {
        title: "Project Alpha",
        desc: "A full-stack web application built with React and Node.js, featuring real-time collaboration tools.",
        tags: ["React", "Node.js", "Socket.io"],
    },
    {
        title: "Project Beta",
        desc: "UI/UX design system and component library for a fintech startup, built in Figma and shipped to engineering.",
        tags: ["Figma", "Design System", "Prototyping"],
    },
    {
        title: "Project Gamma",
        desc: "Machine learning pipeline for image classification, deployed via TensorFlow Serving on Kubernetes.",
        tags: ["Python", "TensorFlow", "Kubernetes"],
    },
    {
        title: "Project Delta",
        desc: "Mobile-first landing page and marketing site for a creative agency, optimized for performance and accessibility.",
        tags: ["Next.js", "Tailwind", "GSAP"],
    },
];

function ProjectCard({ title, desc, tags }) {
    return (
        <div className="shadow-neu rounded-[32px] bg-surface p-6 md:p-8 transition-all duration-300 ease-out hover:shadow-neu-hover hover:-translate-y-1 active:translate-y-0.5 cursor-pointer">
            <div className="w-full h-44 md:h-48 rounded-2xl bg-surface shadow-neu-inset mb-6 flex items-center justify-center">
                <span className="text-primary font-hartwell text-lg opacity-40">preview</span>
            </div>
            <h3 className="text-xl md:text-2xl text-primary font-hartwell leading-tight">{title}</h3>
            <p className="text-[12px] text-black font-ambulatoria mt-3 leading-relaxed">{desc}</p>
            <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-full shadow-neu-small text-gray-600"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Projects() {
    return (
        <div className="flex flex-col min-h-screen px-4 md:px-0">
            <p className="text-[40px] md:text-[64px] text-primary font-hartwell text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pt-15">
                curated works.
            </p>
            <p className="text-[12px] text-black font-ambulatoria text-center -mt-5 max-w-xl mx-auto">
                Showcasing a range of development and graphic design projects built through collaboration and genuine passion.
            </p>

            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 my-16 md:my-20 max-w-5xl w-full">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} {...project} />
                    ))}
                </div>
            </div>
        </div>
    );
}
