import { motion, useReducedMotion } from 'framer-motion';

const offsets = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: -36 },
    right: { x: 36 },
};

export default function Reveal({
    children,
    className = '',
    delay = 0,
    from = 'up',
    duration = 0.8,
    blur = 6,
}) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offsets[from], filter: `blur(${blur}px)` }}
            whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
