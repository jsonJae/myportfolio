
import logo from '../assets/logoblack.png'

export default function Navbar() {
    return (
        <nav className="w-full fixed flex items-center justify-between py-6 px-10 z-50">
        
            {/* Logo */}
            <div>
                <img className = "w-[40px] h-[40px] cursor-pointer" src = {logo} />
            </div>

            {/* Center Menu */}
            <ul className="hidden md:flex space-x-10 text-sm font-hartwell">
                <li className="cursor-pointer hover:text-gray-500">Home</li>
                <li className="cursor-pointer hover:text-gray-500">Projects</li>
                <li className="cursor-pointer hover:text-gray-500">Skills</li>
                <li className="cursor-pointer hover:text-gray-500">Experiences</li>
            </ul>

            {/* Right button */}
            <button className="text-sm font-hartwell hover:bg-[#0824A9] hover:text-white transition duration-300">
                Get in Touch
            </button>

        </nav>
    );
}
