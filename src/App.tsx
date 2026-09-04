import './index.css';
import Navbar from './components/Navbar';
import ThreeRoomHero from './components/ThreeRoomHero';
import About from './components/About';
import TechStack from './components/TechStack';
import FeaturedProject from './components/FeaturedProject';
import Projects from './components/Projects';
import ProblemSolving from './components/ProblemSolving';
import EngineeringApproach from './components/EngineeringApproach';
import SystemDesign from './components/SystemDesign';
import Journey from './components/Journey';
import ScrollFallingObject from './components/ScrollFallingObject';
import GitHubSection from './components/GitHub';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        {/* ── 3D Room Hero (Three.js) ── */}
        <ThreeRoomHero />

        <div className="section-divider" />
        <About />
        <div className="section-divider" />

        <TechStack />
        <div className="section-divider" />

        <FeaturedProject />
        <div className="section-divider" />

        <Projects />
        <div className="section-divider" />

        <ProblemSolving />
        <div className="section-divider" />

        <EngineeringApproach />
        <div className="section-divider" />

        <SystemDesign />
        <div className="section-divider" />

        <Journey />
        <div className="section-divider" />

        {/* ── Scroll-driven falling ice object (Three.js) ── */}
        <ScrollFallingObject />
        <div className="section-divider" />

        <GitHubSection />
        <div className="section-divider" />

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
