import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experiences from './components/Experiences';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Beyond from './components/Beyond';
import Contact from './components/Contact';

function App() {
  return (
    <div className="overflow-hidden max-w-screen pb-24">
      <Navbar />
      <section id="home" className="scroll-mt-20"><Hero /></section>
      <section id="about" className="scroll-mt-20"><About /></section>
      <section id="experiences" aria-labelledby="experiences-title" className="scroll-mt-20"><Experiences /></section>
      <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20"><Skills /></section>
      <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20"><Projects /></section>
      <section id="beyond" aria-labelledby="beyond-title" className="scroll-mt-20"><Beyond /></section>
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20"><Contact /></section>
    </div>
  );
}

export default App;
