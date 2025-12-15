import heroPic from '../assets/HeroPic.png';

// Designer Header Component
function DesHeader() {
    const designerDesc = "specializes in graphic design and UI/UX design, turning ideas into stunning visuals and smooth user journeys";

    return (
        <div className="absolute left-16 z-20 max-w-[270px] text-justify">
            <p className="text-[64px] text-[#0824A9] font-hartwell leading-none"> designer </p>
            <p className="text-[12px] text-black font-ambulatoria mt-2"> {designerDesc} </p>
        </div>
    );
}

// Developer Header Component
function DevHeader() {
    const developerDesc = "full stack developer who writes clean and maintainable codes, with keen interests in ML and AI";

    return (
        <div className="absolute right-16 z-20 max-w-[280px] text-justify">
            <p className="text-[64px] text-[#0824A9] font-hartwell leading-none"> developer </p>
            <p className="text-[12px] text-black font-ambulatoria mt-2"> {developerDesc} </p>
        </div>
    );
}

// Hero Section
export default function Hero() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden shadow-md">
            <DesHeader />
            <img src={heroPic} alt="Hero" className= "absolute bottom-0 left-1/2 -translate-x-1/2 z-10 max-h-[90vh] object-contain " />
            <DevHeader />
        </section>
    );
}
