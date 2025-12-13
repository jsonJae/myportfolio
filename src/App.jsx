import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experiences from './components/Experiences';
import Footer from './components/Footer';


function App() {
  return (
    <div className = "overflow-hidden max-w-screen">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experiences />
      <Footer />
    </div>
  );
}

export default App;