import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Palette, PenTool, WandSparkles } from 'lucide-react';
import Reveal from './Reveal';
import { stackLogos } from '../data/stackLogos';

// Disciplines have no brand mark, and Google Stitch has no published logo in
// any open icon set, so these three keep a drawn icon instead of a fake logo.
const drawnIcons = {
    'UI/UX Design': PenTool,
    'Graphic Design': Palette,
    'Google Stitch': WandSparkles,
};

const tools = [
    'React',
    'Node.js',
    'Express',
    'MongoDB',
    'Next.js',
    'Supabase',
    'SvelteKit',
    'PocketBase',
    'Flutter',
    'Firebase',
    'MariaDB',
    'JavaScript',
    'Python',
    'Dart',
    'Java',
    'C',
    'R',
    'Figma',
    'UI/UX Design',
    'Graphic Design',
    'Git',
    'GitHub',
    'VS Code',
    'GitHub Copilot',
    'Google Antigravity',
    'Google Stitch',
    'Opencode',
].map((name) => ({ name, logo: stackLogos[name], Icon: drawnIcons[name] }));

// Cursor magnification, tuned to match the navigation dock: logos within the
// radius swell and lift toward the pointer, easing back as it moves on.
const RADIUS = 180;
const EASE = 0.18;

function ToolMark({ item }) {
    if (item.logo) {
        return (
            <img
                src={item.logo}
                alt=""
                draggable="false"
                className="pointer-events-none h-7 w-7 object-contain md:h-8 md:w-8"
            />
        );
    }
    const { Icon } = item;
    return <Icon strokeWidth={1.6} className="h-7 w-7 text-primary md:h-8 md:w-8" />;
}

export default function Skills() {
    const reduced = useReducedMotion();
    const panelRef = useRef(null);
    const gridRef = useRef(null);
    const tileRefs = useRef([]);

    useEffect(() => {
        const panel = panelRef.current;
        const grid = gridRef.current;
        const tiles = tileRefs.current.filter(Boolean);
        if (!panel || !grid || !tiles.length) return undefined;

        if (reduced) {
            grid.dataset.shown = 'true';
            return undefined;
        }

        // Entrance: the wall ripples in on a diagonal from the top-left. Delays
        // come from each tile's measured position, so the wave stays diagonal
        // whatever the column count at this screen width.
        const entrance = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                const box = grid.getBoundingClientRect();
                tiles.forEach((tile) => {
                    const rect = tile.getBoundingClientRect();
                    const across = (rect.left - box.left) / Math.max(box.width, 1);
                    const down = (rect.top - box.top) / Math.max(box.height, 1);
                    tile.style.setProperty('--enter-delay', `${(across * 0.45 + down * 0.35).toFixed(3)}s`);
                });
                grid.dataset.shown = 'true';
                entrance.disconnect();
            },
            { threshold: 0.2 },
        );
        entrance.observe(grid);

        const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
        let centers = [];
        const current = tiles.map(() => 0);
        const target = tiles.map(() => 0);
        let frame = 0;

        // Centres are stored relative to the grid, so scrolling while hovering
        // never needs a re-measure; only the pointer is converted each move.
        const measure = () => {
            const box = grid.getBoundingClientRect();
            centers = tiles.map((tile) => {
                const mark = tile.querySelector('[data-mark]');
                const rect = mark.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2 - box.left,
                    y: rect.top + rect.height / 2 - box.top,
                };
            });
        };

        const tick = () => {
            frame = 0;
            let moving = false;
            tiles.forEach((tile, index) => {
                const next = current[index] + (target[index] - current[index]) * EASE;
                const settled = Math.abs(target[index] - next) < 0.002;
                current[index] = settled ? target[index] : next;
                if (!settled) moving = true;
                tile.style.setProperty('--p', current[index].toFixed(3));
            });
            if (moving) frame = requestAnimationFrame(tick);
        };
        const wake = () => {
            if (!frame) frame = requestAnimationFrame(tick);
        };

        const onEnter = () => {
            if (fine.matches) measure();
        };

        const onMove = (event) => {
            const rect = panel.getBoundingClientRect();
            panel.style.setProperty('--mx', `${event.clientX - rect.left}px`);
            panel.style.setProperty('--my', `${event.clientY - rect.top}px`);
            if (!fine.matches) return;
            if (!centers.length) measure();
            const box = grid.getBoundingClientRect();
            const x = event.clientX - box.left;
            const y = event.clientY - box.top;
            centers.forEach((center, index) => {
                const falloff = Math.max(0, 1 - Math.hypot(x - center.x, y - center.y) / RADIUS);
                target[index] = falloff * falloff * (3 - 2 * falloff);
            });
            wake();
        };

        const onLeave = () => {
            target.fill(0);
            wake();
        };

        const onResize = () => {
            centers = [];
        };

        panel.addEventListener('pointerenter', onEnter);
        panel.addEventListener('pointermove', onMove);
        panel.addEventListener('pointerleave', onLeave);
        window.addEventListener('resize', onResize);

        return () => {
            entrance.disconnect();
            cancelAnimationFrame(frame);
            panel.removeEventListener('pointerenter', onEnter);
            panel.removeEventListener('pointermove', onMove);
            panel.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('resize', onResize);
            tiles.forEach((tile) => tile.style.removeProperty('--p'));
        };
    }, [reduced]);

    return (
        <div className="flex flex-col justify-center px-4 py-28 md:px-8 md:py-36">
            <Reveal from="up" duration={0.9}>
                <div className="text-center">
                    <h2
                        id="stack-title"
                        className="font-display text-[40px] font-black leading-[0.95] tracking-tight text-primary heading-balance md:text-[64px]"
                    >
                        <span className="font-normal italic">tools</span> of the trade.
                    </h2>
                </div>
            </Reveal>
            <Reveal from="up" delay={0.08}>
                <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                    The stacks, languages, and tools I reach for, from a blank Figma file to a deployed product.
                </p>
            </Reveal>

            <Reveal from="up" blur={0} delay={0.12} className="mx-auto mt-14 w-full max-w-5xl">
                <div
                    ref={panelRef}
                    className="group/panel relative overflow-hidden rounded-panel border border-primary/15 bg-white/55 px-3 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_24px_60px_-40px_rgba(8,36,169,0.45)] sm:px-6 md:px-8 md:py-10"
                >
                    {/* Dot grid, plus a brighter copy of it revealed around the cursor. */}
                    <span aria-hidden="true" className="stack-dots pointer-events-none absolute inset-0" />
                    <span
                        aria-hidden="true"
                        className="stack-dots-lit pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-soft group-hover/panel:opacity-100"
                    />

                    <ul
                        ref={gridRef}
                        aria-labelledby="stack-title"
                        data-shown="false"
                        className="stack-grid relative flex flex-wrap justify-center"
                    >
                        {tools.map((item, index) => (
                            <li
                                key={item.name}
                                ref={(node) => {
                                    tileRefs.current[index] = node;
                                }}
                                className="stack-tile w-1/4 px-1 py-3 sm:w-1/6 md:w-[14.2857%] md:py-4 lg:w-[11.1111%]"
                            >
                                <div className="stack-enter flex flex-col items-center gap-2.5 text-center">
                                    <span
                                        data-mark
                                        className="stack-mark grid size-14 place-items-center rounded-[18px] border bg-white md:size-16"
                                    >
                                        <ToolMark item={item} />
                                    </span>
                                    <span className="stack-name font-mono text-[10.5px] font-medium leading-[1.35] md:text-[12px]">
                                        {item.name}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Reveal>
        </div>
    );
}
