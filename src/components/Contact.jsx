import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ArrowUpRight, Send } from 'lucide-react';
import Reveal from './Reveal';

const links = [
    {
        icon: faEnvelope,
        label: 'Email',
        value: 'jasongian28@gmail.com',
        href: 'mailto:jasongian28@gmail.com',
    },
    {
        icon: faLinkedinIn,
        label: 'LinkedIn',
        value: 'jason-gian-duran',
        href: 'https://www.linkedin.com/in/jason-gian-duran-4754a7355',
    },
    {
        icon: faGithub,
        label: 'GitHub',
        value: '@jsonJae',
        href: 'https://github.com/jsonJae',
    },
    {
        icon: faFilePdf,
        label: 'Resume',
        value: 'PDF · download',
        href: '/DURAN-RESUME.pdf',
        download: true,
    },
];

export default function Contact() {
    const [sent, setSent] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get('name') ?? '').trim();
        const email = String(form.get('email') ?? '').trim();
        const message = String(form.get('message') ?? '').trim();
        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
        window.location.href = `mailto:jasongian28@gmail.com?subject=${subject}&body=${body}`;
        setSent(true);
    };

    return (
        <div className="flex min-h-screen flex-col justify-center px-4 py-24 md:px-8">
            <div className="mx-auto grid w-full max-w-5xl items-start gap-12 md:grid-cols-[1fr_1.05fr] md:gap-16">
                <Reveal from="up" duration={0.9}>
                    <h2
                        id="contact-title"
                        className="font-display text-[40px] font-black leading-[0.95] tracking-tight text-primary heading-balance md:text-[64px]"
                    >
                        let’s make <span className="font-normal italic">something</span>.
                    </h2>
                    <p className="mt-6 max-w-[34ch] font-body text-[14px] leading-[1.75] text-ink-soft md:text-[15px]">
                        Have an internship, a freelance brief, or just a question? Tell me what you’re
                        working on — my inbox is open.
                    </p>

                    <div className="mt-10 border-t border-black/[0.06]">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                {...(link.download ? { download: '' } : {})}
                                {...(link.label === 'LinkedIn' || link.label === 'GitHub'
                                    ? { target: '_blank', rel: 'noreferrer' }
                                    : {})}
                                className="group flex items-center gap-4 border-b border-black/[0.06] py-4"
                            >
                                <FontAwesomeIcon
                                    icon={link.icon}
                                    aria-hidden="true"
                                    className="w-[18px] text-[18px] text-primary"
                                />
                                <span className="flex min-w-0 flex-col">
                                    <span className="font-display text-[13px] font-bold text-primary">
                                        {link.label}
                                    </span>
                                    <span className="truncate font-body text-[14px] text-ink-soft transition-colors duration-300 group-hover:text-primary">
                                        {link.value}
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={16}
                                    strokeWidth={1.6}
                                    aria-hidden="true"
                                    className="ml-auto shrink-0 text-muted transition-[transform,color] duration-300 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                                />
                            </a>
                        ))}
                    </div>
                </Reveal>

                <Reveal from="up" delay={0.1} duration={0.9}>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col md:pt-2"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="flex flex-col">
                                <span className="mb-2 font-body text-[13px] font-medium text-ink-soft">
                                    Name
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Your name"
                                    className="border-b border-black/15 bg-transparent px-0 py-3 font-body text-[14px] text-ink placeholder:text-muted"
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="mb-2 font-body text-[13px] font-medium text-ink-soft">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="border-b border-black/15 bg-transparent px-0 py-3 font-body text-[14px] text-ink placeholder:text-muted"
                                />
                            </label>
                        </div>
                        <label className="mt-5 flex flex-col">
                            <span className="mb-2 font-body text-[13px] font-medium text-ink-soft">
                                Message
                            </span>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="What are you building?"
                                className="resize-none border-b border-black/15 bg-transparent px-0 py-3 font-body text-[14px] leading-[1.75] text-ink placeholder:text-muted"
                            />
                        </label>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <button
                                type="submit"
                                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 font-display text-[13px] font-bold tracking-[0.02em] text-white shadow-[0_12px_28px_-14px_rgba(8,36,169,0.7)] transition-[transform,background-color,box-shadow] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_34px_-16px_rgba(8,36,169,0.75)] active:translate-y-0 active:scale-[0.98]"
                            >
                                Send message
                                <Send
                                    size={14}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
                                />
                            </button>
                            <span className="font-body text-[12px] text-muted">
                                Opens your email app
                            </span>
                        </div>

                        {sent && (
                            <p
                                role="status"
                                className="mt-4 font-mono text-[10px] leading-[1.7] tracking-[0.04em] text-primary"
                            >
                                Your email app should be open with the message ready to send.
                            </p>
                        )}
                    </form>
                </Reveal>
            </div>

            <p className="mt-16 text-center font-mono text-[11px] text-muted/80">
                © {new Date().getFullYear()} Jason Gian Duran · Muntinlupa, Metro Manila, Philippines
            </p>
        </div>
    );
}
