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
import { LoadingSpinner } from './components/LoadingSpinner';
import { NotFound } from './components/NotFound';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [latestCommit, setLatestCommit] = useState<{ sha: string; html_url: string } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchLatestCommit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.github.com/repos/StanSmits/Portfolio-Site/commits');
        const data = await response.json();
        const latestCommit = data[0];
        setLatestCommit({ sha: latestCommit.sha, html_url: latestCommit.html_url });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching latest commit:', error);
        setIsLoading(false);
      }
    };

    fetchLatestCommit();
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen text-white">
        {isLoading && <LoadingSpinner />}
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer latestCommitNumber={latestCommit} />
        <LanguagePrompt />
      </div>
    </Router>
  );
}

export default App;