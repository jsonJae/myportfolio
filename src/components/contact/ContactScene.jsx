import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useSpring, useTransform } from 'framer-motion';
import { Send } from 'lucide-react';
import { BAND_H, BAND_W, ridgeBand } from './ridge';

// The contact finale's backdrop: everything behind the contact content.
//
// As the section scrolls in (p: 0 when its top meets the viewport's bottom,
// 1 at the end of the page), three pale ranges rise one after another, then
// the front range, solid Ultramarine, floods the section. It stops with its
// crest just inside the top, so the last screen is ink under a ridgeline with
// the hero's Fog Paper sky above.
//
// The ink is then dressed as a map, a print shop and a letter at once:
// contour lines draw themselves around two summits; a compass rose turns to
// north over the right-hand summit; letterpress type blocks drift in beside
// the copy; airmail stripes run down the edges; and a paper plane takes off
// from the "@" block and flies a dotted trail to the compose button (on
// phones it crosses the sky instead). At the end of the page (arrived) it
// all lands in turn: the blocks press and leave their prints, the postmark
// slams down, a pin drops on the summit, the plane loops and settles, the
// name fills in, and envelope seams fold in behind it.
//
// Motion is transforms tied to scroll and, with a mouse, to the pointer.
// Reduced motion renders the finished scene and nothing moves.

const FOG = '237, 240, 245';

// Pale ranges, back to front, then the ink. `end` is where each band settles,
// as a share of its own height; `from`/`to` is the slice of p it rises over,
// so the back ranges lead and the ink follows.
const RANGES = [
    { color: '#DDE3ED', crest: 'rgba(255, 255, 255, 0.7)', seed: 7, base: 118, amp: 46, from: 0, to: 0.5, end: -1.5 },
    { color: '#C6D0E3', crest: 'rgba(255, 255, 255, 0.6)', seed: 19, base: 126, amp: 54, from: 0.03, to: 0.54, end: 1.2 },
    { color: '#9EACD4', crest: 'rgba(255, 255, 255, 0.5)', seed: 37, base: 132, amp: 56, from: 0.06, to: 0.58, end: 3.6 },
];
const INK = { color: '#0824A9', crest: `rgba(${FOG}, 0.3)`, seed: 53, base: 138, amp: 50, from: 0.1, to: 0.62, end: 6 };

// Contour summits. x and y are shares of the section; rings grow by `step`.
// `compact` is the phone placement: smaller, pushed into the corners.
const SUMMITS = [
    { id: 'west', x: 0.15, y: 0.66, r0: 22, step: 34, rings: 7, seed: 3, compact: { x: 0.06, y: 0.84, step: 20 } },
    { id: 'east', x: 0.86, y: 0.32, r0: 18, step: 30, rings: 7, seed: 11, compact: { x: 0.95, y: 0.3, step: 18 } },
];

// Letterpress sorts: a glyph set in reverse on a block of type metal.
// x is from the block's own side, y from the top, both as shares. `wide`
// blocks sit beside the copy from lg; the others flank the ridges below lg.
const SORTS = [
    { glyph: 'J', side: 'left', x: 0.06, y: 0.24, w: 100, rot: -7, depth: 0.8, delay: 0.1, wide: true },
    { glyph: '@', side: 'left', x: 0.13, y: 0.57, w: 84, rot: 6, depth: 1.3, delay: 0.24, wide: true, route: true },
    { glyph: 'J', side: 'left', x: 0.035, y: 0.12, w: 54, rot: -8, depth: 0.8, delay: 0.1 },
    { glyph: '@', side: 'right', x: 0.04, y: 0.105, w: 50, rot: 9, depth: 1.1, delay: 0.24 },
];

function seeded(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

// A closed, smooth ring: polar wobble, then a closed Catmull-Rom curve.
function ringPath(radius, phases, k, centre) {
    const steps = 44;
    const points = [];
    for (let i = 0; i < steps; i += 1) {
        const t = (i / steps) * Math.PI * 2;
        const wobble =
            1 +
            0.13 * Math.sin(2 * t + phases[0] + k * 0.12) +
            0.07 * Math.sin(3 * t + phases[1] - k * 0.1) +
            0.035 * Math.sin(5 * t + phases[2] + k * 0.2);
        points.push([centre + Math.cos(t) * radius * wobble, centre + Math.sin(t) * radius * wobble * 0.82]);
    }
    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
    for (let i = 0; i < steps; i += 1) {
        const p0 = points[(i - 1 + steps) % steps];
        const p1 = points[i];
        const p2 = points[(i + 1) % steps];
        const p3 = points[(i + 2) % steps];
        d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return `${d} Z`;
}

function Range({ range, p, reduced, scale }) {
    const { area, line } = useMemo(() => ridgeBand(range), [range]);
    const end = `${range.end * scale}%`;
    const rise = useTransform(p, [range.from, range.to], ['100%', end]);
    return (
        <motion.div
            style={{ y: reduced ? end : rise }}
            className="absolute inset-x-0 top-0 flex h-[calc(100%+16vh)] flex-col will-change-transform"
        >
            <svg
                viewBox={`0 0 ${BAND_W} ${BAND_H}`}
                preserveAspectRatio="none"
                className="block h-[clamp(56px,13vh,140px)] w-full shrink-0"
            >
                <path d={area} fill={range.color} />
                <path d={line} fill="none" stroke={range.crest} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="-mt-px flex-1" style={{ backgroundColor: range.color }} />
        </motion.div>
    );
}

// One contour ring, drawn as the ink settles; the inner rings finish last.
function Ring({ d, k, rings, p, reduced }) {
    const start = 0.5 + k * 0.025;
    const draw = useTransform(p, [start, start + 0.28], [0, 1]);
    return (
        <motion.path
            d={d}
            fill="none"
            stroke={`rgba(${FOG}, ${(0.045 + (rings - k) * 0.014).toFixed(3)})`}
            strokeWidth="1.1"
            style={{ pathLength: reduced ? 1 : draw }}
        />
    );
}

function Summit({ summit, p, mx, reduced, compact }) {
    const geometry = compact ? { ...summit, ...summit.compact } : summit;
    const size = Math.round(2 * (geometry.r0 + geometry.step * geometry.rings) * 1.25);
    const rings = useMemo(() => {
        const random = seeded(summit.seed);
        const phases = [random() * 6.28, random() * 6.28, random() * 6.28];
        // Outermost first, so the inner rings (drawn last) sit on top.
        return Array.from({ length: summit.rings }, (_, k) =>
            ringPath(geometry.r0 + geometry.step * (summit.rings - 1 - k), phases, k, size / 2),
        );
    }, [summit, geometry.r0, geometry.step, size]);
    const y = useTransform(p, [0.5, 1], [60, 0]);
    const x = useTransform(mx, (m) => m * -8);

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{
                left: `calc(${geometry.x * 100}% - ${size / 2}px)`,
                top: `calc(${geometry.y * 100}% - ${size / 2}px)`,
                y: reduced ? 0 : y,
                x: reduced ? 0 : x,
            }}
            className="absolute overflow-visible"
        >
            {rings.map((d, k) => (
                <Ring key={k} d={d} k={k} rings={summit.rings} p={p} reduced={reduced} />
            ))}
        </motion.svg>
    );
}

// The compass rose over the east summit: it swings toward north with the
// scroll and settles on a loose spring. At the end a pin drops on its centre.
function Compass({ p, mx, my, arrived, reduced }) {
    const swing = useTransform(p, [0.45, 1], [-150, 0]);
    const rotate = useSpring(swing, { stiffness: 60, damping: 9 });
    const x = useTransform(mx, (m) => m * 10);
    const y = useTransform(my, (m) => m * 8);
    const ticks = useMemo(
        () =>
            Array.from({ length: 72 }, (_, i) => {
                const a = (i * 5 * Math.PI) / 180;
                const major = i % 6 === 0;
                const r1 = major ? 74 : 79;
                return {
                    x1: 100 + Math.sin(a) * r1,
                    y1: 100 - Math.cos(a) * r1,
                    x2: 100 + Math.sin(a) * 85,
                    y2: 100 - Math.cos(a) * 85,
                    major,
                };
            }),
        [],
    );
    const shown = arrived || reduced;

    return (
        <motion.div
            style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}
            className="absolute right-[5.5%] top-[19%] hidden w-[200px] lg:block"
        >
            <svg viewBox="0 0 200 236" className="w-full overflow-visible">
                {/* Crosshair: the map's grid lines through the summit. */}
                <g stroke={`rgba(${FOG}, 0.28)`} strokeWidth="1" strokeDasharray="2 5">
                    <line x1="100" y1="-34" x2="100" y2="6" />
                    <line x1="100" y1="194" x2="100" y2="210" />
                    <line x1="-44" y1="100" x2="6" y2="100" />
                    <line x1="194" y1="100" x2="244" y2="100" />
                </g>
                <circle cx="100" cy="100" r="85" fill="none" stroke={`rgba(${FOG}, 0.4)`} strokeWidth="1.2" />
                <circle cx="100" cy="100" r="66" fill="none" stroke={`rgba(${FOG}, 0.18)`} strokeWidth="1" />
                {ticks.map((t, i) => (
                    <line
                        key={i}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={`rgba(${FOG}, ${t.major ? 0.6 : 0.25})`}
                        strokeWidth={t.major ? 1.3 : 0.8}
                    />
                ))}
                <motion.g style={{ rotate: reduced ? 0 : rotate, originX: '100px', originY: '100px' }}>
                    {[0, 90, 180, 270].map((a) => (
                        <g key={a} transform={`rotate(${a} 100 100)`}>
                            <path d="M100 100 L100 40 L108 92 Z" fill={`rgba(${FOG}, ${a === 0 ? 0.92 : 0.55})`} />
                            <path d="M100 100 L100 40 L92 92 Z" fill="none" stroke={`rgba(${FOG}, 0.55)`} strokeWidth="1" />
                        </g>
                    ))}
                    {[45, 135, 225, 315].map((a) => (
                        <g key={a} transform={`rotate(${a} 100 100)`}>
                            <path d="M100 100 L100 66 L105 95 Z" fill={`rgba(${FOG}, 0.35)`} />
                            <path d="M100 100 L100 66 L95 95 Z" fill="none" stroke={`rgba(${FOG}, 0.35)`} strokeWidth="0.9" />
                        </g>
                    ))}
                    <text x="100" y="31" textAnchor="middle" className="contact-compass-n">
                        N
                    </text>
                </motion.g>
                <circle cx="100" cy="100" r="4" fill="#0824A9" stroke={`rgba(${FOG}, 0.9)`} strokeWidth="1.5" />
                <text x="100" y="232" textAnchor="middle" className="contact-compass-label">
                    14.41°N · 121.04°E
                </text>
            </svg>

            {/* The pin drops on the summit, and its ripple spreads over the contours. */}
            <motion.span
                initial={false}
                animate={shown && !reduced ? { scale: [0.4, 2.6], opacity: [0.7, 0] } : { scale: 0.4, opacity: 0 }}
                transition={shown && !reduced ? { duration: 1.1, delay: 0.62, ease: 'easeOut' } : { duration: 0.15 }}
                className="absolute left-1/2 top-[42.4%] -ml-6 -mt-6 size-12 rounded-full border border-surface/70"
            />
            <motion.svg
                viewBox="0 0 24 32"
                initial={false}
                animate={shown ? { y: 0, opacity: 1, scale: 1 } : { y: -70, opacity: 0, scale: 0.8 }}
                transition={
                    shown && !reduced
                        ? { type: 'spring', stiffness: 420, damping: 13, delay: 0.5 }
                        : { duration: 0.15 }
                }
                className="absolute left-1/2 top-[42.4%] -ml-[13px] -mt-[34px] w-[26px] drop-shadow-[0_6px_6px_rgba(2,8,40,0.45)]"
            >
                <path d="M12 31 C12 31 2 18.5 2 11.5 a10 10 0 0 1 20 0 C22 18.5 12 31 12 31 Z" fill="#EDF0F5" />
                <circle cx="12" cy="11.5" r="4" fill="#0824A9" />
            </motion.svg>
        </motion.div>
    );
}

// A sort: a block of type metal with the glyph set in reverse on its face,
// lit from the top left, with the nicks a compositor feels for. At the end it
// presses and leaves its print, the right way round, on the ink.
function Sort({ sort, p, mx, my, reduced, arrived }) {
    const id = useId().replace(/:/g, '');
    const rise = useTransform(p, [0.42, 1], [sort.depth * 230, 0]);
    const tilt = useTransform(p, [0.42, 1], [sort.rot + sort.depth * 10, sort.rot]);
    const y = useTransform([rise, my], ([r, m]) => r + m * sort.depth * 9);
    const x = useTransform(mx, (m) => m * sort.depth * 12);
    const rotate = useTransform([tilt, mx], ([t, m]) => t + m * sort.depth * 3);
    const shown = arrived || reduced;

    return (
        <motion.div
            style={{
                [sort.side]: `${sort.x * 100}%`,
                top: `${sort.y * 100}%`,
                width: sort.w,
                x: reduced ? 0 : x,
                y: reduced ? 0 : y,
                rotate: reduced ? sort.rot : rotate,
            }}
            className={`absolute ${sort.wide ? 'hidden lg:block' : 'lg:hidden'}`}
        >
            {/* The print it leaves when it presses. */}
            <motion.span
                initial={false}
                animate={shown ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.18, filter: 'blur(6px)' }}
                transition={
                    shown && !reduced
                        ? { duration: 0.7, delay: sort.delay + 0.16, ease: [0.16, 1, 0.3, 1] }
                        : { duration: 0.15 }
                }
                style={{ fontSize: sort.w * 0.86 }}
                className="contact-sort-print"
            >
                {sort.glyph}
            </motion.span>

            <motion.svg
                viewBox="0 0 100 124"
                initial={false}
                animate={shown && !reduced ? { y: [0, 9, 0], scale: [1, 0.93, 1] } : { y: 0, scale: 1 }}
                transition={{ duration: 0.42, delay: sort.delay, ease: 'easeInOut' }}
                className="contact-sort relative w-full overflow-visible"
            >
                <defs>
                    <linearGradient id={`${id}-lit`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor={`rgba(${FOG}, 0.16)`} />
                        <stop offset="0.6" stopColor={`rgba(${FOG}, 0.03)`} />
                    </linearGradient>
                </defs>
                <path d="M8 16 L20 5 L96 5 L84 16 Z" fill={`rgba(${FOG}, 0.18)`} stroke={`rgba(${FOG}, 0.5)`} strokeWidth="1.1" />
                <path d="M84 16 L96 5 L96 109 L84 120 Z" fill={`rgba(${FOG}, 0.07)`} stroke={`rgba(${FOG}, 0.38)`} strokeWidth="1.1" />
                <rect x="8" y="16" width="76" height="104" rx="2.5" fill={`url(#${id}-lit)`} stroke={`rgba(${FOG}, 0.66)`} strokeWidth="1.4" />
                <line x1="8" y1="104" x2="84" y2="104" stroke={`rgba(${FOG}, 0.3)`} strokeWidth="1" />
                <line x1="8" y1="109" x2="84" y2="109" stroke={`rgba(${FOG}, 0.22)`} strokeWidth="1" />
                <text x="46" y="80" textAnchor="middle" transform="translate(92 0) scale(-1 1)" className="contact-sort-glyph">
                    {sort.glyph}
                </text>
            </motion.svg>
        </motion.div>
    );
}

// Airmail stripes down both edges of the ink, sliding slowly like a band.
function Airmail({ side }) {
    return (
        <div className={`absolute bottom-0 top-[16%] w-[6px] overflow-hidden md:w-[9px] ${side === 'left' ? 'left-0' : 'right-0'}`}>
            <div className="contact-airmail" />
        </div>
    );
}

// The cancellation mark: a circular date stamp with Muntinlupa's coordinates
// and today's date, and wavy cancel lines drawn like the ridges.
function Postmark({ arrived, reduced, className = '' }) {
    const id = useId().replace(/:/g, '');
    const date = useMemo(() => {
        const now = new Date();
        return {
            day: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase(),
            year: now.getFullYear(),
        };
    }, []);
    const shown = arrived || reduced;

    return (
        <motion.svg
            viewBox="0 0 300 132"
            initial={false}
            animate={shown ? { opacity: 1, scale: 1, rotate: -11 } : { opacity: 0, scale: 1.55, rotate: -24 }}
            transition={
                shown && !reduced
                    ? { type: 'spring', stiffness: 560, damping: 26, mass: 0.8, delay: 0.36 }
                    : { duration: 0.18 }
            }
            className={`contact-postmark pointer-events-none absolute ${className}`}
        >
            <defs>
                {/* Rubber-stamp ink: a slight wobble in the strokes and worn specks. */}
                <filter id={`${id}-ink`} x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="wobble" />
                    <feDisplacementMap in="SourceGraphic" in2="wobble" scale="2.2" result="moved" />
                    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="grain" />
                    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.55" result="worn" />
                    <feComposite in="moved" in2="worn" operator="in" />
                </filter>
                <path id={`${id}-top`} d="M 21 66 A 45 45 0 0 1 111 66" />
                <path id={`${id}-bottom`} d="M 14 66 A 52 52 0 0 0 118 66" />
            </defs>
            <g filter={`url(#${id}-ink)`} fill="none" stroke="currentColor">
                <circle cx="66" cy="66" r="60" strokeWidth="3.2" />
                <circle cx="66" cy="66" r="38" strokeWidth="1.2" />
                <text className="contact-postmark-ring" fill="currentColor" stroke="none">
                    <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
                        MUNTINLUPA · PH
                    </textPath>
                </text>
                <text className="contact-postmark-ring" fill="currentColor" stroke="none">
                    <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
                        14.41°N · 121.04°E
                    </textPath>
                </text>
                <text x="66" y="63" textAnchor="middle" className="contact-postmark-day" fill="currentColor" stroke="none">
                    {date.day}
                </text>
                <text x="66" y="82" textAnchor="middle" className="contact-postmark-year" fill="currentColor" stroke="none">
                    {date.year}
                </text>
                {[34, 50, 66, 82, 98].map((y, index) => (
                    <path
                        key={y}
                        d={`M 132 ${y} q 21 ${index % 2 ? 9 : -9} 42 0 t 42 0 t 42 0 t 42 0`}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                ))}
            </g>
        </motion.svg>
    );
}

// A paper plane riding a path with CSS offset-path, nose along the line.
// When the page ends it loops once and settles.
function Plane({ d, distance, arrived, reduced, className, size = 22 }) {
    const shown = arrived || reduced;
    return (
        <motion.div
            style={{ offsetPath: `path('${d}')`, offsetRotate: 'auto', offsetDistance: distance }}
            className={`absolute left-0 top-0 ${className}`}
        >
            <motion.div
                initial={false}
                animate={
                    shown && !reduced
                        ? { rotate: [45, -315], y: [0, -26, 0], scale: [1, 1.18, 1] }
                        : { rotate: 45, y: 0, scale: 1 }
                }
                transition={{ duration: 0.95, delay: 0.7, ease: [0.45, 0, 0.25, 1] }}
                style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            >
                <Send size={size} strokeWidth={1.6} aria-hidden="true" />
            </motion.div>
        </motion.div>
    );
}

// Measures the scene (and optionally a target inside it) so paths can be
// drawn in the scene's pixel space. A passive effect, not a layout effect:
// the scene's ref belongs to the parent, and React attaches it after this
// child's layout effects have run, so a layout effect would find no scene.
function useSceneBox(sceneRef, targetRef, remeasureKey) {
    const [box, setBox] = useState(null);
    const measureRef = useRef(() => {});
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return undefined;
        const measure = () => {
            const s = scene.getBoundingClientRect();
            const t = targetRef?.current?.getBoundingClientRect();
            setBox({
                w: s.width,
                h: s.height,
                target: t && t.width ? { x: t.left - s.left, y: t.top - s.top, w: t.width, h: t.height } : null,
            });
        };
        measureRef.current = measure;
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(scene);
        if (targetRef?.current) observer.observe(targetRef.current);
        return () => observer.disconnect();
    }, [sceneRef, targetRef, remeasureKey]);
    return [box, measureRef];
}

// Desktop: a dotted trail from the "@" block to the compose button, drawn as
// the ink settles, with the plane at its tip.
function Route({ sceneRef, targetRef, p, reduced, arrived }) {
    const id = useId().replace(/:/g, '');
    const [box, measureRef] = useSceneBox(sceneRef, targetRef, arrived);
    const draw = useTransform(p, [0.55, 0.95], [0, 1]);
    const distance = useTransform(draw, (v) => `${(v * 100).toFixed(2)}%`);
    const dot = useTransform(draw, [0.9, 1], [0, 1]);
    const above = useRef(false);
    const start = SORTS.find((sort) => sort.route);

    // The button has its own entrance, so measure again just before the trail
    // starts to draw, once it has settled.
    useMotionValueEvent(p, 'change', (value) => {
        const now = value > 0.5;
        if (now && !above.current) measureRef.current();
        above.current = now;
    });

    const geo = useMemo(() => {
        if (!box || box.w < 1024 || !box.target) return null;
        const sx = box.w * start.x + start.w * 0.96;
        const sy = box.h * start.y + start.w * 1.24 * 0.55;
        const ex = box.target.x - 16;
        const ey = box.target.y + box.target.h / 2;
        return {
            ex,
            ey,
            d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${(sx + 150).toFixed(1)} ${(sy + 110).toFixed(1)}, ${(ex - 230).toFixed(1)} ${(ey + 150).toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        };
    }, [box, start]);

    if (!geo) return null;

    return (
        <div className="absolute inset-0 hidden lg:block">
            <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} className="absolute inset-0">
                <defs>
                    <mask id={`${id}-draw`} maskUnits="userSpaceOnUse">
                        <motion.path d={geo.d} fill="none" stroke="#fff" strokeWidth="10" style={{ pathLength: reduced ? 1 : draw }} />
                    </mask>
                </defs>
                <path
                    d={geo.d}
                    mask={`url(#${id}-draw)`}
                    fill="none"
                    stroke={`rgba(${FOG}, 0.5)`}
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeDasharray="0.1 9"
                />
                <motion.circle
                    cx={geo.ex}
                    cy={geo.ey}
                    r="4"
                    fill="#EDF0F5"
                    className="contact-route-dot"
                    style={{ '--dot-ink': reduced ? 1 : dot }}
                />
                {arrived && !reduced && <circle cx={geo.ex} cy={geo.ey} r="4" className="contact-route-ping" />}
            </svg>
            <Plane d={geo.d} distance={reduced ? '100%' : distance} arrived={arrived} reduced={reduced} className="text-surface" />
        </div>
    );
}

// Phones and tablets: the plane crosses the sky above the ridges instead,
// leaving a dotted contrail, and parks short of the menu button.
function SkyFlight({ sceneRef, p, reduced, arrived }) {
    const id = useId().replace(/:/g, '');
    const [box] = useSceneBox(sceneRef, null, 0);
    const draw = useTransform(p, [0.18, 0.88], [0, 1]);
    const distance = useTransform(draw, (v) => `${(v * 100).toFixed(2)}%`);

    if (!box || box.w >= 1024) return null;
    const sy = Math.min(box.h * 0.16, 150);
    const ey = Math.min(box.h * 0.075, 70);
    const ex = box.w * 0.7;
    const d = `M -20 ${sy.toFixed(1)} C ${(box.w * 0.25).toFixed(1)} ${(sy - 10).toFixed(1)}, ${(box.w * 0.45).toFixed(1)} ${(ey + 40).toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;

    return (
        <div className="absolute inset-0 lg:hidden">
            <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} className="absolute inset-0">
                <defs>
                    <mask id={`${id}-draw`} maskUnits="userSpaceOnUse">
                        <motion.path d={d} fill="none" stroke="#fff" strokeWidth="10" style={{ pathLength: reduced ? 1 : draw }} />
                    </mask>
                </defs>
                <path
                    d={d}
                    mask={`url(#${id}-draw)`}
                    fill="none"
                    stroke="rgba(8, 36, 169, 0.45)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="0.1 8"
                />
            </svg>
            <Plane d={d} distance={reduced ? '100%' : distance} arrived={arrived} reduced={reduced} className="text-primary" size={20} />
        </div>
    );
}

// Envelope seams: the back flap's two folds, drawn in behind the name when
// the page ends.
function Seams({ arrived, reduced }) {
    const shown = arrived || reduced;
    const transition = shown && !reduced ? { duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] } : { duration: 0.2 };
    return (
        // Shallower on phones, so the folds meet below the link buttons.
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[17%] w-full md:h-[30%]">
            {['M 0 100 L 50 8', 'M 100 100 L 50 8'].map((d) => (
                <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke={`rgba(${FOG}, 0.16)`}
                    strokeWidth="1.25"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{ pathLength: shown ? 1 : 0 }}
                    transition={transition}
                />
            ))}
        </svg>
    );
}

export default function ContactScene({ sceneRef, targetRef, p, mx, my, arrived, reduced, compact }) {
    const nameY = useTransform(p, [0.6, 1], [140, 0]);
    const nameOpacity = useTransform(p, [0.6, 0.92], [0, 1]);
    const nameX = useTransform(mx, (m) => m * -10);
    const scale = compact ? 0.45 : 1;

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {RANGES.map((range) => (
                <Range key={range.seed} range={range} p={p} reduced={reduced} scale={scale} />
            ))}
            <Range range={INK} p={p} reduced={reduced} scale={scale} />

            {SUMMITS.map((summit) => (
                <Summit key={summit.id} summit={summit} p={p} mx={mx} reduced={reduced} compact={compact} />
            ))}

            <Airmail side="left" />
            <Airmail side="right" />
            <Seams arrived={arrived} reduced={reduced} />

            <motion.p
                data-arrived={arrived || reduced ? 'true' : 'false'}
                style={{ y: reduced ? 0 : nameY, x: reduced ? 0 : nameX, '--name-ink': reduced ? 1 : nameOpacity }}
                className="contact-name absolute inset-x-0 bottom-0 select-none whitespace-nowrap text-center font-display italic"
            >
                Jason.
            </motion.p>

            <Compass p={p} mx={mx} my={my} arrived={arrived} reduced={reduced} />

            {/* Desktop: beside the copy, below the compass. Phones: at the foot of the page. */}
            <Postmark arrived={arrived} reduced={reduced} className="right-[3%] top-[60%] hidden w-[250px] lg:block" />
            <Postmark
                arrived={arrived}
                reduced={reduced}
                className="bottom-[1%] left-3 w-1/2 md:bottom-[7%] md:w-[min(64%,300px)] lg:hidden"
            />

            {SORTS.map((sort, index) => (
                <Sort key={index} sort={sort} p={p} mx={mx} my={my} reduced={reduced} arrived={arrived} />
            ))}

            <Route sceneRef={sceneRef} targetRef={targetRef} p={p} reduced={reduced} arrived={arrived} />
            <SkyFlight sceneRef={sceneRef} p={p} reduced={reduced} arrived={arrived} />
        </div>
    );
}
