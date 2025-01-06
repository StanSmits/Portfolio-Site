import React from 'react';
import { NavigationLink } from '../Navigation/NavigationLink';
import { ToolsMenu } from '../Navigation/ToolsMenu';
import { LanguageSelector } from '../LanguageSelector/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-800 px-4 py-6">
      <div className="container mx-auto flex items-center justify-between max-w-screen-lg">
        <nav className="flex items-center space-x-2">
          <NavigationLink to="/">{t('footer.home')}</NavigationLink>
          <span className="text-gray-600">|</span>
          <ToolsMenu />
          <span className="text-gray-600">|</span>
          <LanguageSelector />
        </nav>
        <p className="text-gray-400">© {currentYear} Stan Smits</p>
      </div>
    </footer>
  );
};