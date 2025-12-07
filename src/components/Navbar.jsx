
/*
    export default function Navbar() {
        return( 
            <nav className="fixed top-0 w-full z-50 transition-all duration 300 bg-slate 950/20 backdrop-blur-sa">
                <div className="max-w-7xl mx-auto px-4 sm:px6 lg:px-8"> 
                    <div className = "flex justify-between items-center h-14 sm:h-16 md:h-20"></div>
                </div>
            </nav>
        );
    }
*/

export default function Navbar() {
    return (
        <nav className="w-full flex items-center text-black justify-between py-6 px-10">
        
            {/* Logo */}
            <div className="text-3xl font-bold">JD</div>

            {/* Center Menu */}
            <ul className="hidden md:flex space-x-10 text-sm font-medium">
                <li className="cursor-pointer hover:text-gray-500">Home</li>
                <li className="cursor-pointer hover:text-gray-500">Projects</li>
                <li className="cursor-pointer hover:text-gray-500">Skills</li>
                <li className="cursor-pointer hover:text-gray-500">Experiences</li>
            </ul>

            {/* Right button */}
            <button className="text-sm font-medium hover:text-gray-500">
                Get in Touch
            </button>

        </nav>
    );
}
