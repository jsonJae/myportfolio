import { useState, useEffect } from 'react';

const navItems = [
    'Home',
    'About',
    'Projects',
    'Skills',
    'Experiences'
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='flex justify-center'>
            <div className={`fixed flex justify-between items-center py-3 px-10 top-[20px] rounded-full text-black z-50 transition-all duration-500 ease-in-out
                ${isScrolled 
                    ? 'bg-white shadow-lg border border-gray-200 gap-12' 
                    : 'backdrop-blur-md bg-white bg-opacity-20 shadow-lg gap-32'
                }
            `}>
                <ul className={`
                    flex text-sm font-bold transition-all duration-500
                    ${isScrolled ? 'gap-8' : 'gap-16'}
                `}>
                    {navItems.map((item) => (
                        <li className='relative group cursor-pointer' key={item}>
                            {item}
                            <span className='absolute left-0 -bottom-1 w-0 h-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-300 group-hover:w-full'></span>
                        </li>
                    ))}
                </ul>
                <button className='bg-gradient-to-r from-blue-500 to-blue-300 py-1 px-6 rounded-3xl shadow-lg text-white text-sm font-bold hover:from-blue-600 hover:to-blue-400 hover:shadow-blue-200 transition-all duration-300'>
                    Contact
                </button>
            </div>
        </div>
    );
}