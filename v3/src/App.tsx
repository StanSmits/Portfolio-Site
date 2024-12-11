import React, { useState, useEffect } from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { Hero } from './components/Hero/Hero';
import { ExperienceSection } from './components/Experience/ExperienceSection';
import { EducationCard } from './components/EducationCard';
import { BackgroundGradient } from './components/BackgroundGradient';

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
    <div className="relative min-h-screen bg-gray-950 text-white">
      <BackgroundGradient mousePosition={mousePosition} />
      <Hero mousePosition={mousePosition} />
      {/* Education Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-3xl font-bold">Education</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EducationCard
              title="Computer Science"
              institution="University of Technology"
              period="2018 - 2022"
              description="Specialized in software engineering and web development. Graduated with honors."
              size="large"
            />
            <EducationCard
              title="Web Development Bootcamp"
              institution="Code Academy"
              period="2017 - 2018"
              description="Intensive program focusing on modern web technologies and best practices."
            />
            <EducationCard
              title="Digital Design"
              institution="Design Institute"
              period="2016 - 2017"
              description="Fundamentals of UI/UX design and digital creativity."
            />
          </div>
        </div>
      </section>

      <ExperienceSection mousePosition={mousePosition} />

      {/* Contact Section */}
      <section className="bg-gray-900/50 px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-12 text-3xl font-bold">Let's Connect</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://www.linkedin.com/in/stan-smits-63227b21a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-400 transition-colors hover:text-purple-300"
            >
              <Linkedin className="h-6 w-6" />
              LinkedIn
            </a>
            <a
              href="mailto:connect@stansmits.nl"
              className="flex items-center gap-2 text-purple-400 transition-colors hover:text-purple-300"
            >
              <Mail className="h-6 w-6" />
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} Stan Smits. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;