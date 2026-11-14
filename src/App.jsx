import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experiences from './components/Experiences';
import Footer from './components/Footer';

function App() {
  return (
    <div className="overflow-hidden max-w-screen pb-24">
      <Navbar />
      <section id="home" className="scroll-mt-20"><Hero /></section>
      <section id="about" className="scroll-mt-20"><About /></section>
      <section id="projects" className="scroll-mt-20"><Projects /></section>
      <Skills />
      <Experiences />
      <Footer />
    </div>
  );
}

export default App;