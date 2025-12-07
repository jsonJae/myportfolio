import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experiences from './components/Experiences';
import Footer from './components/Footer';

function App() {
  return (
    <div className = " text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Experiences />
      <Footer />
    </div>
  );
}

export default App;