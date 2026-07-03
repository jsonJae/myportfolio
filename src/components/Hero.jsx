import { motion } from 'framer-motion';
import heroPic from '../assets/HeroPic.png';

const cloudWords = [
    { text: 'UI/UX', size: 'text-[26px]', top: 'top-[50%]', left: 'left-[58%]', delay: 0 },
    { text: 'React', size: 'text-[20px]', top: 'top-[57%]', left: 'left-[54%]', delay: 0.3 },
    { text: 'Figma', size: 'text-[16px]', top: 'top-[57%]', left: 'left-[46%]', delay: 0.6 },
    { text: 'Node.js', size: 'text-[18px]', top: 'top-[50%]', left: 'left-[42%]', delay: 0.9 },
    { text: 'Wireframe', size: 'text-[13px]', top: 'top-[43%]', left: 'left-[46%]', delay: 1.2 },
    { text: 'TypeScript', size: 'text-[14px]', top: 'top-[43%]', left: 'left-[54%]', delay: 1.5 },
    { text: 'Prototype', size: 'text-[14px]', top: 'top-[64%]', left: 'left-[50%]', delay: 1.8 },
    { text: 'Python', size: 'text-[22px]', top: 'top-[57%]', left: 'left-[38%]', delay: 2.1 },
    { text: 'Brand', size: 'text-[15px]', top: 'top-[43%]', left: 'left-[38%]', delay: 0.5 },
    { text: 'Docker', size: 'text-[13px]', top: 'top-[36%]', left: 'left-[50%]', delay: 0.8 },
    { text: 'Typography', size: 'text-[11px]', top: 'top-[64%]', left: 'left-[62%]', delay: 1.1 },
    { text: 'GraphQL', size: 'text-[14px]', top: 'top-[62%]', left: 'left-[38%]', delay: 1.4 },
    { text: 'Motion', size: 'text-[17px]', top: 'top-[55%]', left: 'left-[68%]', delay: 1.7 },
    { text: 'MongoDB', size: 'text-[15px]', top: 'top-[69%]', left: 'left-[45%]', delay: 2.0 },
    { text: 'Grid', size: 'text-[12px]', top: 'top-[69%]', left: 'left-[55%]', delay: 0.4 },
    { text: 'CSS', size: 'text-[18px]', top: 'top-[31%]', left: 'left-[45%]', delay: 0.7 },
    { text: 'Tailwind', size: 'text-[13px]', top: 'top-[55%]', left: 'left-[31%]', delay: 1.0 },
    { text: 'API', size: 'text-[16px]', top: 'top-[36%]', left: 'left-[62%]', delay: 1.3 },
];

function FloatingWord({ text, size, top, left, right, delay }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.45, 0.25, 0.5, 0.3], y: [20, 0, -8, 4, -4] }}
            transition={{ duration: 6, delay, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className={`absolute ${size} ${top} ${left || ''} ${right || ''} text-primary font-hartwell pointer-events-none select-none leading-none text-glow`}
        >
            {text}
        </motion.span>
    );
}

const glowVariants = {
    animate: {
        scale: [1, 1.04, 0.98, 1.02, 1],
        opacity: [0.15, 0.25, 0.12, 0.2, 0.15],
    },
};

function DesignerLabel() {
    const desc = "specializes in graphic design and UI/UX design, turning ideas into stunning visuals and smooth user journeys";

    return (
        <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="absolute bottom-[16%] left-4 md:left-20 md:top-[38%] md:bottom-auto z-40 w-[170px] sm:w-[210px] md:w-[310px]"
        >
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="shadow-neu-deep rounded-[24px] md:rounded-[28px] bg-surface/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 border border-white/60 transition-colors duration-300 cursor-pointer select-none"
            >
                <p className="text-[30px] sm:text-[40px] md:text-[54px] text-primary font-hartwell leading-[0.9] tracking-tight">
                    designer
                </p>
                <div className="mt-2 md:mt-3 h-[2px] w-8 sm:w-10 md:w-12 bg-primary/30 rounded-full" />
                <p className="text-[11px] sm:text-[12px] md:text-[14px] text-black/70 font-ambulatoria mt-2 md:mt-3 leading-relaxed">
                    {desc}
                </p>
            </motion.div>
        </motion.div>
    );
}

function DeveloperLabel() {
    const desc = "full stack developer who writes clean and maintainable codes, with keen interests in ML and AI";

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="absolute bottom-[16%] right-4 md:right-20 md:top-[38%] md:bottom-auto z-40 w-[170px] sm:w-[210px] md:w-[310px]"
        >
            <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="shadow-neu-deep rounded-[24px] md:rounded-[28px] bg-surface/80 backdrop-blur-sm p-5 sm:p-6 md:p-8 border border-white/60 transition-colors duration-300 cursor-pointer select-none"
            >
                <p className="text-[30px] sm:text-[40px] md:text-[54px] text-primary font-hartwell leading-[0.9] tracking-tight">
                    developer
                </p>
                <div className="mt-2 md:mt-3 h-[2px] w-8 sm:w-10 md:w-12 bg-primary/30 rounded-full" />
                <p className="text-[11px] sm:text-[12px] md:text-[14px] text-black/70 font-ambulatoria mt-2 md:mt-3 leading-relaxed">
                    {desc}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function Hero() {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <motion.div
                variants={glowVariants}
                animate="animate"
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full shadow-neu-inset opacity-40"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full shadow-neu opacity-30" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full shadow-neu opacity-20" />

            {cloudWords.map((w, i) => (
                <FloatingWord key={i} {...w} />
            ))}

            <img
                src={heroPic}
                alt="Hero"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 max-h-[90vh] object-contain"
            />

            <DesignerLabel />
            <DeveloperLabel />

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface/100 to-transparent z-20 pointer-events-none" />
        </section>
    );
}
