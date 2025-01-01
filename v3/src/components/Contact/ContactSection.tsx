import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto text-center max-w-screen-lg">
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
  );
};