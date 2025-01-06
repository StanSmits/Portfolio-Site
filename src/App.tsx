import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero/Hero';
import { ExperienceSection } from './components/Experience/ExperienceSection';
import { EducationSection } from './components/Education/EducationSection';
import { ContactSection } from './components/Contact/ContactSection';
import { Footer } from './components/Footer/Footer';
import { BackgroundGradient } from './components/BackgroundGradient';
import { ToolsLayout } from './layouts/ToolsLayout';
import { Calculator } from './components/Tools/Calculator';
import { LanguagePrompt } from './components/LanguagePrompt/LanguagePrompt';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen text-white">
        <BackgroundGradient mousePosition={mousePosition} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero mousePosition={mousePosition} />
                <EducationSection />
                <ExperienceSection mousePosition={mousePosition} />
                <ContactSection />
              </>
            }
          />
          <Route path="/tools" element={<ToolsLayout />}>
            <Route path="calculator" element={<Calculator />} />
          </Route>
        </Routes>
        <Footer />
        <LanguagePrompt />
      </div>
    </Router>
  );
}

export default App;