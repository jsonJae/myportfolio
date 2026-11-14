import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser, faLayerGroup, faBriefcase } from '@fortawesome/free-solid-svg-icons';

const navItems = [
    { label: 'Home', id: 'home', icon: faHouse },
    { label: 'About', id: 'about', icon: faUser },
    { label: 'Projects', id: 'projects', icon: faLayerGroup },
    { label: 'Experiences', id: null, icon: faBriefcase },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight * 0.35;

            for (let i = navItems.length - 1; i >= 0; i--) {
                const id = navItems[i].id;
                if (!id) continue;
                const section = document.getElementById(id);
                if (section && section.offsetTop <= scrollPos) {
                    setActiveSection(id);
                    break;
                }
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
        >
            <ul className="flex items-center gap-1 rounded-full border border-white/60 bg-surface/85 p-1.5 shadow-neu backdrop-blur-md">
                {navItems.map((item) => {
                    const isActive = item.id && activeSection === item.id;
                    const isDisabled = !item.id;

                    return (
                        <li key={item.label}>
                            <button
                                type="button"
                                onClick={() => scrollTo(item.id)}
                                disabled={isDisabled}
                                aria-current={isActive ? 'page' : undefined}
                                aria-label={isDisabled ? `${item.label} (coming soon)` : item.label}
                                title={isDisabled ? 'Coming soon' : undefined}
                                className={`group flex items-center justify-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 ease-soft md:px-5 ${
                                    isDisabled
                                        ? 'text-muted-quiet cursor-not-allowed'
                                        : isActive
                                          ? 'shadow-neu-inset text-primary cursor-pointer'
                                          : 'text-muted hover:text-primary hover:shadow-neu-small hover:-translate-y-0.5 cursor-pointer'
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    aria-hidden="true"
                                    className={`text-[15px] transition-transform duration-300 ease-soft ${
                                        isDisabled ? '' : 'group-hover:scale-110'
                                    }`}
                                />
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
