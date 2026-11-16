import { useRef, useState } from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion';

const DEFAULT_SPRING = { mass: 0.1, stiffness: 220, damping: 18 };

function DockItem({
    item,
    mouseX,
    distance,
    baseItemSize,
    magnification,
    spring,
    reduceMotion,
    isHovered,
    isAnyHovered,
    onHoverStart,
    onHoverEnd,
}) {
    const ref = useRef(null);
    const isDisabled = Boolean(item.disabled);
    const isActive = Boolean(item.active);
    const maxSize = isDisabled || reduceMotion ? baseItemSize : magnification;

    const mouseDistance = useTransform(mouseX, (value) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return distance * 2;
        return value - rect.x - rect.width / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, maxSize, baseItemSize],
    );
    const size = useSpring(targetSize, spring);
    const iconScale = useTransform(
        size,
        [baseItemSize, maxSize === baseItemSize ? baseItemSize + 1 : maxSize],
        [1, 1.15],
    );

    // If another item is hovered while this item is the active section, dim it slightly as an anchor reference
    const isDimmed = isActive && isAnyHovered && !isHovered;
    const isWiped = (isHovered || isActive) && !isDisabled;

    const label = typeof item.label === 'string' ? item.label : item.ariaLabel ?? '';
    const stateClasses = isDisabled
        ? 'cursor-not-allowed border-black/5 bg-white/50 text-neutral-300'
        : isActive
          ? isDimmed
              ? 'border-primary/30 bg-primary/40 text-white/80 shadow-[0_2px_6px_-2px_rgba(8,36,169,0.2)]'
              : 'border-primary bg-primary text-white shadow-[0_4px_16px_-4px_rgba(8,36,169,0.45)]'
          : 'border-black/[0.05] bg-white text-neutral-600 shadow-[0_1px_2px_rgba(15,23,42,0.08)] hover:text-neutral-950 hover:shadow-[0_4px_14px_-4px_rgba(15,23,42,0.2)]';

    return (
        <motion.button
            ref={ref}
            type="button"
            onClick={() => {
                if (!isDisabled) item.onClick?.();
            }}
            aria-label={isDisabled ? `${label} (coming soon)` : label}
            aria-current={isActive ? 'location' : undefined}
            aria-disabled={isDisabled || undefined}
            tabIndex={isDisabled ? -1 : undefined}
            onPointerEnter={(event) => {
                if (event.pointerType !== 'touch') onHoverStart();
            }}
            onPointerLeave={onHoverEnd}
            onFocus={(event) => {
                if (event.target.matches(':focus-visible')) onHoverStart();
            }}
            onBlur={onHoverEnd}
            style={{ width: size, height: size }}
            className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border outline-offset-4 transition-[color,background-color,border-color,box-shadow,opacity] duration-300 ease-soft ${stateClasses} ${item.className ?? ''}`}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 origin-left rounded-full bg-primary transition-all duration-300 ease-soft ${
                    isWiped ? 'scale-x-100' : 'scale-x-0'
                } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
            />
            <motion.span
                aria-hidden="true"
                style={{ scale: iconScale }}
                className={`pointer-events-none relative z-10 flex items-center justify-center transition-colors duration-300 ${
                    isWiped ? (isDimmed ? 'text-white/80' : 'text-white') : ''
                }`}
            >
                {item.icon}
            </motion.span>

            <AnimatePresence>
                {isHovered && (
                    <motion.span
                        role="tooltip"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.18,
                            ease: [0, 0, 0.2, 1],
                        }}
                        style={{ x: '-50%' }}
                        className="pointer-events-none absolute -top-9 left-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-black/[0.06] bg-white px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-700 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.35)]"
                    >
                        {item.label}
                        {isDisabled && (
                            <span className="text-[9px] tracking-[0.18em] text-neutral-400">
                                Soon
                            </span>
                        )}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

export function MagnificationDock({
    items,
    className = '',
    distance = 150,
    panelHeight = 64,
    baseItemSize = 46,
    magnification = 66,
    spring = DEFAULT_SPRING,
}) {
    const mouseX = useMotionValue(Infinity);
    const reduceMotion = Boolean(useReducedMotion());
    const safeDistance = Math.max(distance, 1);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => {
                mouseX.set(Infinity);
                setHoveredIdx(null);
            }}
            style={{ height: panelHeight }}
            className={`inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-surface/80 p-2 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.18)] backdrop-blur-md ${className}`}
            role="toolbar"
            aria-orientation="horizontal"
        >
            {items.map((item, idx) => (
                <DockItem
                    key={item.label || idx}
                    item={item}
                    mouseX={mouseX}
                    distance={safeDistance}
                    baseItemSize={baseItemSize}
                    magnification={magnification}
                    spring={spring}
                    reduceMotion={reduceMotion}
                    isHovered={hoveredIdx === idx}
                    isAnyHovered={hoveredIdx !== null}
                    onHoverStart={() => setHoveredIdx(idx)}
                    onHoverEnd={() => setHoveredIdx(null)}
                />
            ))}
        </motion.div>
    );
}
