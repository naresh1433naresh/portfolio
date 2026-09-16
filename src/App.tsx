import { Suspense, lazy } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import About from './components/About';
import TechStack from './components/TechStack';
import FeaturedProject from './components/FeaturedProject';
import Projects from './components/Projects';
import ProblemSolving from './components/ProblemSolving';
import EngineeringApproach from './components/EngineeringApproach';
import SystemDesign from './components/SystemDesign';
import Journey from './components/Journey';
import GitHubSection from './components/GitHub';
import Contact from './components/Contact';
import Footer from './components/Footer';

// ── Lazy-load the Two Three.js/WebGL sections ──
// This separates ~600KB of Three.js code from the initial JS bundle,
// dramatically improving FCP and TTI. The rest of the page loads instantly.
const ThreeRoomHero = lazy(() => import('./components/ThreeRoomHero'));
const ScrollFallingObject = lazy(() => import('./components/ScrollFallingObject'));

// Fallback shown while Three.js chunk loads
function HeroFallback() {
  return (
    <div className="hero-suspense-fallback" style={{ height: '100vh' }}>
      <div className="hero-suspense-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

// Simple inline section placeholder for the scroll scene
function ScrollFallback() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 40%, #dde3e9 0%, #c5cdd6 35%, #0a0a0f 100%)',
    }}>
      <div className="hero-suspense-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        {/* ── 3D Room Hero — lazy loaded so Three.js doesn't block initial paint ── */}
        <Suspense fallback={<HeroFallback />}>
          <ThreeRoomHero />
        </Suspense>

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

        {/* ── Scroll-driven falling ice object — lazy loaded ── */}
        <Suspense fallback={<ScrollFallback />}>
          <ScrollFallingObject />
        </Suspense>
        <div className="section-divider" />

        <GitHubSection />
        <div className="section-divider" />

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
