function ProjectCard(){
    return(
        <div className="flex flex-col w-full h-90 rounded-2xl border">
        </div>
    );  
}


export default function Projects(){
    return (
        <div className="flex flex-col min-h-screen">
            <p className="text-[64px] text-[#0824A9] font-hartwell text-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pt-15"> curated works. </p>
            <p className="text-[12px] text-black font-ambulatoria text-center -m-5"> Showcasing a range of development and graphic design projects built through collaboration and genuine passion. </p>

            <div className="flex justify-center">
                <div className="flex flex-col w-260 my-20 gap-15">
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                    <ProjectCard />
                </div>
            </div>
        </div>
    );
}