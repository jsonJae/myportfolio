import { memo, useEffect, useId, useMemo, useRef } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';

const VIEW_W = 1440;
const VIEW_H = 1200;
const COLS = 72;
const ROWS = 60;
const BANDS = 15;

const PEAKS = [
    { cx: 720, cy: 90, sx: 240, sy: 190, weight: 0.95 },
    { cx: 250, cy: 500, sx: 235, sy: 285, weight: 1 },
    { cx: 1200, cy: 540, sx: 250, sy: 270, weight: 0.96 },
    { cx: 320, cy: 1030, sx: 250, sy: 235, weight: 0.9 },
    { cx: 1110, cy: 1010, sx: 260, sy: 240, weight: 0.92 },
];

function elevation(x, y) {
    let height = 0;

    for (const peak of PEAKS) {
        const dx = (x - peak.cx) / peak.sx;
        const dy = (y - peak.cy) / peak.sy;
        height += peak.weight * Math.exp(-(dx * dx + dy * dy) * 0.5);
    }

    height += 0.05 * Math.sin(x * 0.0062 + 1.3) * Math.cos(y * 0.0051 - 0.7);
    height += 0.03 * Math.sin(x * 0.0125 - y * 0.0108 + 0.4);

    return height;
}

function buildField() {
    const nodes = [];

    for (let row = 0; row <= ROWS; row += 1) {
        const line = [];
        for (let col = 0; col <= COLS; col += 1) {
            line.push(elevation((col / COLS) * VIEW_W, (row / ROWS) * VIEW_H));
        }
        nodes.push(line);
    }

    return nodes;
}

const EDGE_PAIRS = {
    0: [],
    1: [[3, 0]],
    2: [[0, 1]],
    3: [[3, 1]],
    4: [[1, 2]],
    5: [[3, 2], [0, 1]],
    6: [[0, 2]],
    7: [[3, 2]],
    8: [[2, 3]],
    9: [[0, 2]],
    10: [[0, 3], [1, 2]],
    11: [[1, 2]],
    12: [[1, 3]],
    13: [[0, 1]],
    14: [[3, 0]],
    15: [],
};

function ratio(a, b, level) {
    const span = b - a;
    if (Math.abs(span) < 1e-9) return 0.5;
    return (level - a) / span;
}

function cellSegments(nodes, row, col, level) {
    const x0 = (col / COLS) * VIEW_W;
    const x1 = ((col + 1) / COLS) * VIEW_W;
    const y0 = (row / ROWS) * VIEW_H;
    const y1 = ((row + 1) / ROWS) * VIEW_H;

    const tl = nodes[row][col];
    const tr = nodes[row][col + 1];
    const br = nodes[row + 1][col + 1];
    const bl = nodes[row + 1][col];

    let mask = 0;
    if (tl >= level) mask |= 1;
    if (tr >= level) mask |= 2;
    if (br >= level) mask |= 4;
    if (bl >= level) mask |= 8;

    const pairs = EDGE_PAIRS[mask];
    if (!pairs || pairs.length === 0) return null;

    const tTop = ratio(tl, tr, level);
    const tRight = ratio(tr, br, level);
    const tBottom = ratio(bl, br, level);
    const tLeft = ratio(tl, bl, level);

    const edges = [
        [x0 + tTop * (x1 - x0), y0],
        [x1, y0 + tRight * (y1 - y0)],
        [x0 + tBottom * (x1 - x0), y1],
        [x0, y0 + tLeft * (y1 - y0)],
    ];

    return pairs.map(([from, to]) => [edges[from], edges[to]]);
}

function buildBands(nodes) {
    let min = Infinity;
    let max = -Infinity;

    for (const row of nodes) {
        for (const value of row) {
            if (value < min) min = value;
            if (value > max) max = value;
        }
    }

    const range = max - min;
    const bands = [];

    for (let band = 0; band < BANDS; band += 1) {
        const t = BANDS === 1 ? 0 : band / (BANDS - 1);
        const level = min + range * (0.16 + 0.66 * t);
        let d = '';

        for (let row = 0; row < ROWS; row += 1) {
            for (let col = 0; col < COLS; col += 1) {
                const segments = cellSegments(nodes, row, col, level);
                if (!segments) continue;

                for (const [[ax, ay], [bx, by]] of segments) {
                    d += `M${Math.round(ax)} ${Math.round(ay)}L${Math.round(bx)} ${Math.round(by)}`;
                }
            }
        }

        if (!d) continue;

        bands.push({ d, t, major: band % 4 === 0 });
    }

    return bands;
}

const DEFAULT_FRACTIONS = [0.24, 0.5, 0.76];

export default memo(function Contours({
    activeIndex = 0,
    bandFractions = DEFAULT_FRACTIONS,
}) {
    const bands = useMemo(() => buildBands(buildField()), []);
    const ref = useRef(null);
    const reduced = useReducedMotion();

    const uid = useId().replace(/[:]/g, '');
    const maskId = `contour-focus-${uid}`;
    const fadeId = `contour-focus-fade-${uid}`;

    // Each stop on the timeline owns a vertical slice of the map. The glow
    // band is anchored to that slice's measured centre, so scrolling the
    // timeline walks the blue bloom down the topography card by card.
    const count = Math.max(bandFractions.length, 1);
    const bandHeight = (VIEW_H / count) * 0.94;
    const safeIndex = Math.min(Math.max(activeIndex, 0), count - 1);
    const fraction = bandFractions[safeIndex] ?? (safeIndex + 0.5) / count;
    const targetY = Math.min(
        Math.max(fraction * VIEW_H - bandHeight / 2, 0),
        VIEW_H - bandHeight,
    );

    const focusTarget = useMotionValue(0);
    const focusSpring = useSpring(focusTarget, {
        stiffness: 90,
        damping: 22,
        mass: 0.6,
    });
    const focusY = reduced ? focusTarget : focusSpring;

    useEffect(() => {
        focusTarget.set(targetY);
    }, [focusTarget, targetY]);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const smoothed = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 32,
        mass: 0.4,
    });
    const progress = reduced ? scrollYProgress : smoothed;
    const halo = useTransform(progress, [0, 0.4, 1], [0, 0.55, 0.12]);

    // Fade the field into the surface at the top and bottom so contour lines
    // never terminate on a visible hard edge.
    const edgeFade = {
        maskImage:
            'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
        WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
    };

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="contour-map pointer-events-none absolute inset-0 z-0 overflow-hidden"
            style={edgeFade}
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    opacity: halo,
                    background:
                        'radial-gradient(620px 460px at 50% 40%, rgba(8, 36, 169, 0.1), transparent 72%), radial-gradient(520px 420px at 14% 60%, rgba(8, 36, 169, 0.06), transparent 74%)',
                }}
            />
            <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="xMidYMid slice"
                className="h-full w-full"
            >
                <defs>
                    <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0824A9" stopOpacity="0" />
                        <stop offset="24%" stopColor="#0B2AC4" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#1D4ED8" stopOpacity="1" />
                        <stop offset="76%" stopColor="#0B2AC4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0824A9" stopOpacity="0" />
                    </linearGradient>
                    <mask
                        id={maskId}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={VIEW_W}
                        height={VIEW_H}
                    >
                        <motion.rect
                            x="0"
                            width={VIEW_W}
                            height={bandHeight}
                            fill={`url(#${fadeId})`}
                            style={{ y: focusY }}
                        />
                    </mask>
                </defs>

                {/* Rest state: faint hairlines covering the whole field. */}
                {bands.map((band, index) => (
                    <path
                        key={index}
                        d={band.d}
                        fill="none"
                        stroke="rgb(8, 36, 169)"
                        strokeWidth={band.major ? 1.1 : 0.6}
                        strokeOpacity={
                            band.major ? 0.15 + band.t * 0.1 : 0.08 + band.t * 0.09
                        }
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}

                {/* Focus state: the blue bloom lives only inside the active band. */}
                <g mask={`url(#${maskId})`}>
                    <g
                        fill="none"
                        stroke="rgb(8, 36, 169)"
                        strokeLinecap="round"
                        style={{ filter: 'blur(10px)' }}
                    >
                        {bands.map((band, index) => (
                            <path
                                key={index}
                                d={band.d}
                                strokeWidth={band.major ? 7 : 4.5}
                                strokeOpacity={band.major ? 0.55 : 0.4}
                            />
                        ))}
                    </g>
                    <g
                        fill="none"
                        stroke="rgb(29, 78, 216)"
                        strokeLinecap="round"
                        style={{ filter: 'blur(2px)' }}
                    >
                        {bands.map((band, index) => (
                            <path
                                key={index}
                                d={band.d}
                                strokeWidth={band.major ? 2.6 : 1.6}
                                strokeOpacity={band.major ? 1 : 0.72}
                            />
                        ))}
                    </g>
                </g>
            </svg>
        </div>
    );
});
