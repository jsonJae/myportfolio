import { useState, useEffect } from 'react';
import { Home, UserRound, Briefcase, Layers, LayoutGrid, Sparkles, Mail } from 'lucide-react';
import { MagnificationDock } from './MagnificationDock';

const navItems = [
    { label: 'Home', id: 'home', Icon: Home },
    { label: 'About', id: 'about', Icon: UserRound },
    { label: 'Experience', id: 'experiences', Icon: Briefcase },
    { label: 'Stack', id: 'stack', Icon: Layers },
    { label: 'Projects', id: 'projects', Icon: LayoutGrid },
    { label: 'Beyond', id: 'beyond', Icon: Sparkles },
    { label: 'Contact', id: 'contact', Icon: Mail },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(max-width: 420px)');
        const update = () => setCompact(query.matches);
        update();
        query.addEventListener('change', update);
        return () => query.removeEventListener('change', update);
    }, []);

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

    const dockItems = navItems.map((item) => ({
        icon: <item.Icon size={19} strokeWidth={1.7} />,
        label: item.label,
        onClick: () => scrollTo(item.id),
        active: Boolean(item.id) && activeSection === item.id,
    }));

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
        >
            <MagnificationDock items={dockItems} baseItemSize={compact ? 42 : 46} />
        </nav>
    );
}
