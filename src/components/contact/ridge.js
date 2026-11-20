// Ridgelines for the contact finale, drawn the same way as the hero's Ridges:
// a seeded sine with jitter, smoothed into a Catmull-Rom curve. Each band is a
// 1440 x 200 box stretched to the section's width; `line` is the crest and
// `area` fills from the crest down to the bottom of the box.

export const BAND_W = 1440;
export const BAND_H = 200;

function makeRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

export function ridgeBand({ seed, base = 120, amp = 50, steps = 14 }) {
    const random = makeRandom(seed);
    const phase = random() * Math.PI * 2;
    const frequency = 1.2 + random() * 1.6;
    const points = [];

    for (let i = 0; i <= steps; i += 1) {
        const x = (BAND_W * i) / steps;
        const wave = Math.sin(phase + (i / steps) * Math.PI * frequency) * amp * 0.7;
        const jitter = (random() * 2 - 1) * amp * 0.35;
        const y = Math.max(6, Math.min(BAND_H - 4, base + wave + jitter));
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

    return { line, area: `${line} L ${BAND_W} ${BAND_H} L 0 ${BAND_H} Z` };
}
