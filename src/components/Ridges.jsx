import { memo, useMemo } from 'react';

const WIDTH = 1440;
const HEIGHT = 900;
const PAD = 240;
const STEPS = 18;

const TINTS = {
    slate: '163, 177, 198',
    ink: '8, 36, 169',
};

const layers = [
    { baseY: 435, amp: 34, opacity: 0.04, tint: 'slate', seed: 7, duration: 40, drift: 14, delay: 1.1 },
    { baseY: 470, amp: 42, opacity: 0.05, tint: 'slate', seed: 11, duration: 34, drift: 18, delay: 0 },
    { baseY: 512, amp: 54, opacity: 0.045, tint: 'ink', seed: 19, duration: 32, drift: -20, delay: 2.6 },
    { baseY: 550, amp: 64, opacity: 0.075, tint: 'slate', seed: 29, duration: 27, drift: -16, delay: 1.5 },
    { baseY: 592, amp: 58, opacity: 0.065, tint: 'ink', seed: 37, duration: 35, drift: 22, delay: 0.6 },
    { baseY: 635, amp: 50, opacity: 0.1, tint: 'slate', seed: 43, duration: 38, drift: 24, delay: 0.8 },
    { baseY: 678, amp: 66, opacity: 0.085, tint: 'ink', seed: 53, duration: 29, drift: -24, delay: 1.8 },
    { baseY: 715, amp: 78, opacity: 0.125, tint: 'slate', seed: 67, duration: 30, drift: -22, delay: 2.2 },
    { baseY: 758, amp: 62, opacity: 0.11, tint: 'ink', seed: 79, duration: 42, drift: 18, delay: 0.2 },
    { baseY: 795, amp: 56, opacity: 0.16, tint: 'slate', seed: 89, duration: 44, drift: 20, delay: 0.4 },
    { baseY: 835, amp: 44, opacity: 0.14, tint: 'ink', seed: 101, duration: 33, drift: -18, delay: 2.9 },
    { baseY: 864, amp: 36, opacity: 0.2, tint: 'slate', seed: 113, duration: 36, drift: -14, delay: 3 },
];

function makeRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function buildLayer({ baseY, amp, seed }) {
    const random = makeRandom(seed);
    const phase = random() * Math.PI * 2;
    const frequency = 1.3 + random() * 1.7;
    const points = [];

    for (let i = 0; i <= STEPS; i += 1) {
        const x = -PAD + ((WIDTH + PAD * 2) * i) / STEPS;
        const wave = Math.sin(phase + (i / STEPS) * Math.PI * frequency) * amp * 0.7;
        const jitter = (random() * 2 - 1) * amp * 0.35;
        const y = Math.max(baseY - amp * 1.8, Math.min(baseY + amp * 1.8, baseY + wave + jitter));
        points.push([x, y]);
    }

    let line = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;

        line += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }

    const area = `${line} L ${points[points.length - 1][0].toFixed(1)} ${HEIGHT + PAD} L ${points[0][0].toFixed(1)} ${HEIGHT + PAD} Z`;

    return { line, area };
}

export default memo(function Ridges() {
    const shapes = useMemo(() => layers.map((layer) => ({ ...layer, ...buildLayer(layer) })), []);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                preserveAspectRatio="none"
                className="h-full w-full"
            >
                {shapes.map((shape, index) => (
                    <g
                        key={index}
                        className="ridge-layer"
                        style={{
                            '--ridge-drift': `${shape.drift}px`,
                            '--ridge-duration': `${shape.duration}s`,
                            animationDelay: `${shape.delay}s`,
                        }}
                    >
                        <path d={shape.area} fill={`rgba(${TINTS[shape.tint]}, ${shape.opacity})`} />
                        <path
                            d={shape.line}
                            fill="none"
                            stroke={shape.tint === 'ink' ? 'rgba(255, 255, 255, 0.42)' : 'rgba(255, 255, 255, 0.5)'}
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
});
