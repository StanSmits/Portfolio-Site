import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linkedin, Mail } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto text-center max-w-screen-lg">
        <h2 className="mb-12 text-3xl font-bold">{t('sections.contact')}</h2>
        <div
          ref={elementRef}
          className={`flex flex-wrap justify-center gap-8 transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <a
            href="https://www.linkedin.com/in/stan-smits-63227b21a/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-400 transition-colors hover:text-purple-300"
          >
            <Linkedin className="h-6 w-6" />
            {t('contact.linkedin')}
          </a>
          <a
            href="mailto:connect@stansmits.nl"
            className="flex items-center gap-2 text-purple-400 transition-colors hover:text-purple-300"
          >
            <Mail className="h-6 w-6" />
            {t('contact.email')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
