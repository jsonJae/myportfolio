import { memo, useLayoutEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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

// The contour field never changes, so its paths are parsed once per page
// load and painted into two canvas bitmaps whenever the section resizes:
// faint hairlines for rest, and a pre-blurred bloom for focus. Scrolling then
// only moves composited bitmaps; no vector or blur work happens per frame.
let bandCache = null;

function getBands() {
    if (!bandCache) {
        bandCache = buildBands(buildField()).map((band) => ({ ...band, path: new Path2D(band.d) }));
    }
    return bandCache;
}

// Match the old SVG's `xMidYMid slice`: cover the box, centred.
function coverTransform(width, height) {
    const scale = Math.max(width / VIEW_W, height / VIEW_H);
    return {
        scale,
        x: (width - VIEW_W * scale) / 2,
        y: (height - VIEW_H * scale) / 2,
    };
}

function prepare(canvas, width, height, density) {
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    const ctx = canvas.getContext('2d');
    const fit = coverTransform(width, height);
    ctx.setTransform(
        fit.scale * density,
        0,
        0,
        fit.scale * density,
        fit.x * density,
        fit.y * density,
    );
    ctx.lineCap = 'round';
    return { ctx, unit: fit.scale * density };
}

// Fade the field into the surface at the top and bottom so contour lines
// never terminate on a visible hard edge. Baked into the bitmap instead of a
// CSS mask, which would force a repaint whenever anything inside it moves.
function fadeEdges(ctx, width, height, stops) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.globalCompositeOperation = 'destination-in';
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    for (const [offset, alpha] of stops) {
        gradient.addColorStop(Math.min(Math.max(offset, 0), 1), `rgba(0,0,0,${alpha})`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

const EDGE_STOPS = [
    [0, 0],
    [0.14, 1],
    [0.86, 1],
    [1, 0],
];

function paintRest(canvas, width, height, density) {
    const { ctx, unit } = prepare(canvas, width, height, density);
    ctx.strokeStyle = 'rgb(8, 36, 169)';
    for (const band of getBands()) {
        // Hairlines keep a constant on-screen width, like non-scaling-stroke.
        ctx.lineWidth = ((band.major ? 1.1 : 0.6) * density) / unit;
        ctx.globalAlpha = band.major ? 0.15 + band.t * 0.1 : 0.08 + band.t * 0.09;
        ctx.stroke(band.path);
    }
    fadeEdges(ctx, canvas.width, canvas.height, EDGE_STOPS);
}

// The full bloom (both blur passes) is painted once into an offscreen canvas,
// then copied into one soft-edged slice per timeline stop.
function paintBloom(width, height, density) {
    const canvas = document.createElement('canvas');
    const { ctx, unit } = prepare(canvas, width, height, density);
    const layers = [
        { color: 'rgb(8, 36, 169)', blur: 10, major: [7, 0.55], minor: [4.5, 0.4] },
        { color: 'rgb(29, 78, 216)', blur: 2, major: [2.6, 1], minor: [1.6, 0.72] },
    ];
    for (const layer of layers) {
        ctx.strokeStyle = layer.color;
        ctx.filter = `blur(${layer.blur * unit}px)`;
        for (const band of getBands()) {
            const [lineWidth, alpha] = band.major ? layer.major : layer.minor;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = alpha;
            ctx.stroke(band.path);
        }
    }
    return canvas;
}

function paintSlice(canvas, bloom, fraction, count) {
    canvas.width = bloom.width;
    canvas.height = bloom.height;
    const ctx = canvas.getContext('2d');
    // Kept quieter than the cards: the bloom marks focus, it is not the subject.
    ctx.globalAlpha = 0.7;
    ctx.drawImage(bloom, 0, 0);
    ctx.globalAlpha = 1;

    // Each stop owns a vertical slice centred on its card; the slice fades in
    // and out at its edges (the old focus gradient: 0 / 0.8 / 1 / 0.8 / 0).
    const span = (1 / count) * 0.94;
    const start = Math.min(Math.max(fraction - span / 2, 0), 1 - span);
    fadeEdges(ctx, canvas.width, canvas.height, [
        [0, 0],
        [start, 0],
        [start + span * 0.24, 0.8],
        [start + span * 0.5, 1],
        [start + span * 0.76, 0.8],
        [start + span, 0],
        [1, 0],
    ]);
    fadeEdges(ctx, canvas.width, canvas.height, EDGE_STOPS);
}

const DEFAULT_FRACTIONS = [0.24, 0.5, 0.76];

export default memo(function Contours({
    activeIndex = 0,
    bandFractions = DEFAULT_FRACTIONS,
}) {
    const ref = useRef(null);
    const restRef = useRef(null);
    const sliceRefs = useRef([]);

    const count = Math.max(bandFractions.length, 1);
    const safeIndex = Math.min(Math.max(activeIndex, 0), count - 1);
    const fractionKey = bandFractions.map((value) => value.toFixed(3)).join(',');

    // Repaint only when the section's size or the card positions change.
    // Scrolling never repaints: the active slice just cross-fades in.
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return undefined;

        const fractions = fractionKey.split(',').map(Number);
        let painted = '';
        const paint = () => {
            const width = node.clientWidth;
            const height = node.clientHeight;
            const key = `${width}x${height}`;
            if (!width || !height || key === painted) return;
            painted = key;

            const density = Math.min(window.devicePixelRatio || 1, 1.5);
            paintRest(restRef.current, width, height, density);
            // The bloom is soft by design, so it can live at a lower resolution.
            const bloom = paintBloom(width, height, Math.min(density, 0.75));
            fractions.forEach((fraction, index) => {
                const slice = sliceRefs.current[index];
                if (slice) paintSlice(slice, bloom, fraction, fractions.length);
            });
        };

        paint();
        const observer = new ResizeObserver(paint);
        observer.observe(node);
        return () => observer.disconnect();
    }, [fractionKey]);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const halo = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.55, 0.12]);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="contour-map pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    opacity: halo,
                    background:
                        'radial-gradient(620px 460px at 50% 40%, rgba(8, 36, 169, 0.1), transparent 72%), radial-gradient(520px 420px at 14% 60%, rgba(8, 36, 169, 0.06), transparent 74%)',
                }}
            />

            <canvas ref={restRef} className="absolute inset-0 h-full w-full" />

            {bandFractions.map((_, index) => (
                <canvas
                    key={index}
                    ref={(node) => {
                        sliceRefs.current[index] = node;
                    }}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-soft ${
                        index === safeIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
        </div>
    );
});
