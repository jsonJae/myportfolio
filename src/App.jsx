import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experiences from './components/Experiences';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Beyond from './components/Beyond';
import Contact from './components/Contact';
import ChatBot from './components/ChatBot';

function App() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const handleNavigate = (targetId) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;

    // Trigger visual zoom-out framing
    setIsTransitioning(true);

    // Use native scrollIntoView on the element itself so it respects the element's exact layout position
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Settle transition back to 100% scale once scroll reaches destination
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 650);
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-primary overflow-x-hidden">
      {/* 
        View-frame transition:
        - Uses inset frame borders (padding/inset change) rather than transform scale-y.
        - Scaling whole-page height with scale-y previously compressed document heights during scroll,
          causing offset miscalculations and overshooting.
        - Using horizontal scale + bottom padding preserves the true vertical document coordinate space perfectly!
      */}
      <div
        className={`w-full bg-surface min-h-screen transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu origin-top ${
          isTransitioning
            ? 'scale-x-[0.93] pb-36 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]'
            : 'scale-x-100 pb-24 shadow-none'
        }`}
      >
        <section id="home" className="scroll-mt-20"><Hero /></section>
        <section id="about" className="scroll-mt-20"><About /></section>
        <section id="experiences" aria-labelledby="experiences-title" className="scroll-mt-20"><Experiences /></section>
        <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20"><Skills /></section>
        <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20"><Projects /></section>
        <section id="beyond" aria-labelledby="beyond-title" className="scroll-mt-20"><Beyond /></section>
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20"><Contact /></section>
      </div>

      <Navbar onNavigate={handleNavigate} />
      <ChatBot />
    </div>
  );
}

export default App;
