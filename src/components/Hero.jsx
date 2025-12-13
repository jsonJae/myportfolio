import heroPic from '../assets/HeroPic.png';
function HeroHeaders({header, desc}){
    return(
        <div className = "max-w-[270px]">
                <p className = "text-[64px] text-[#0824A9] font-hartwell text-justify">{header}</p>
                <p className = "text-[12px] text-[#000000] font-ambulatoria text-justify"> {desc}</p>
        </div>
    )
}

export default function Hero(){
    const designerDesc = "specializes in graphic design and UI/UX design, turning ideas into stunning visuals and smooth user journeys"
    const developerDesc = "full stack developer who writes clean and maintainable codes, with keen interests in ML and AI"
    return (
        <div className = "flex flex-row">
            <HeroHeaders header = "designer" desc = {designerDesc} />
            <img src = {heroPic} />
            <HeroHeaders header = "developer" desc = {developerDesc} />
        </div>
    );
}