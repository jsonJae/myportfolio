import { PenTool, Users, Compass } from 'lucide-react';
import Reveal from './Reveal';

const facets = [
    {
        Icon: PenTool,
        title: 'The designer',
        body: 'I reach for type, color, and composition before I reach for code. UI/UX and graphic design are how I make an idea legible before it becomes a product.',
    },
    {
        Icon: Users,
        title: 'The teammate',
        body: 'YSES HR taught me that onboarding, events, and small acts of inclusion are products too — built with attention and followed through.',
    },
    {
        Icon: Compass,
        title: 'The learner',
        body: 'I follow where AI is headed, test new tools early, and treat coding agents as collaborators — with my hand still on the wheel.',
    },
];

export default function Beyond() {
    return (
        <div className="flex min-h-screen flex-col justify-center px-4 py-24 md:px-8">
            <Reveal from="up" duration={0.9}>
                <div className="text-center">
                    <h2
                        id="beyond-title"
                        className="font-display text-[40px] font-black leading-[0.95] tracking-tight text-primary heading-balance md:text-[64px]"
                    >
                        <span className="font-normal italic">beyond</span> the code.
                    </h2>
                </div>
            </Reveal>
            <Reveal from="up" delay={0.08}>
                <p className="prose-measure mx-auto mt-6 text-center font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                    Software is what I do. These are the parts of me that shape how I do it.
                </p>
            </Reveal>

            <div className="mx-auto mt-16 grid w-full max-w-5xl gap-12 md:grid-cols-3 md:gap-10">
                {facets.map((facet, index) => (
                    <Reveal
                        key={facet.title}
                        from="up"
                        delay={0.1 + index * 0.08}
                        className="h-full"
                    >
                        <article className="flex h-full flex-col">
                            <div className="flex items-center justify-between">
                                <facet.Icon size={22} strokeWidth={1.6} className="text-primary" aria-hidden="true" />
                                <span className="font-mono text-[12px] font-medium text-muted/75">
                                    0{index + 1}
                                </span>
                            </div>
                            <h3 className="mt-6 font-display text-2xl font-black leading-tight text-primary md:text-[28px]">
                                {facet.title}
                            </h3>
                            <p className="mt-3 font-body text-[13px] leading-[1.75] text-ink-soft md:text-[14px]">
                                {facet.body}
                            </p>
                        </article>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}
