import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const spring = { stiffness: 140, damping: 18, mass: 0.7 };

export default function TiltCard({ children, className = '', max = 5 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawX, spring);
    const rotateY = useSpring(rawY, spring);

    const handleMove = (event) => {
        if (reduced) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rawY.set(px * max * 2);
        rawX.set(-py * max * 2);
    };

    const handleLeave = () => {
        rawX.set(0);
        rawY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            whileHover={reduced ? undefined : { y: -4 }}
            whileTap={reduced ? undefined : { scale: 0.985 }}
            className={`will-change-transform ${className}`}
        >
            {children}
        </motion.div>
    );
}
