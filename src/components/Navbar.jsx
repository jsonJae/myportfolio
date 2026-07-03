import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experiences', id: null },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            const scrollPos = window.scrollY + 160;

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
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        setIsMobileOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed flex items-center justify-between top-5 left-1/2 -translate-x-1/2 z-50 rounded-full transition-all duration-700 ease-out
                    ${isScrolled
                        ? 'bg-surface shadow-neu-hover border border-white/50 py-2.5 px-4 md:px-6 scale-[0.96]'
                        : 'bg-surface/80 backdrop-blur-md shadow-neu py-4 px-12 md:px-28 scale-100'
                    }
                `}
            >
                <ul className="hidden md:flex items-center text-sm font-bold gap-1">
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <button
                                onClick={() => scrollTo(item.id)}
                                disabled={!item.id}
                                className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                                    item.id
                                        ? activeSection === item.id
                                            ? 'shadow-neu-inset text-primary cursor-pointer'
                                            : 'text-gray-500 hover:text-primary hover:shadow-neu-small cursor-pointer'
                                        : 'text-gray-300 cursor-default'
                                }`}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-primary transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                >
                    <span className="relative flex items-center justify-center w-5 h-5">
                        <FontAwesomeIcon
                            icon={faBars}
                            className={`absolute transition-all duration-300 ease-out ${
                                isMobileOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100'
                            }`}
                            size="lg"
                        />
                        <FontAwesomeIcon
                            icon={faXmark}
                            className={`absolute transition-all duration-300 ease-out ${
                                isMobileOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75'
                            }`}
                            size="lg"
                        />
                    </span>
                </button>
            </nav>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-surface/95 backdrop-blur-lg md:hidden"
                    >
                        <ul className="flex flex-col items-center gap-4">
                            {navItems.map((item, i) => (
                                <motion.li
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <button
                                        onClick={() => scrollTo(item.id)}
                                        disabled={!item.id}
                                        className={`px-8 py-3 rounded-2xl text-lg font-bold transition-all duration-300 ${
                                            item.id
                                                ? activeSection === item.id
                                                    ? 'shadow-neu-inset text-primary cursor-pointer'
                                                    : 'text-primary hover:shadow-neu-small hover:scale-105 cursor-pointer'
                                                : 'text-gray-300 cursor-default'
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
