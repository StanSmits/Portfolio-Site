import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="group relative">
      <span className="flex items-center px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">
        <span className="mr-2">{i18n.language === 'nl' ? '🇳🇱' : '🇬🇧'}</span>
        {i18n.language === 'nl' ? 'NL' : 'EN'}
      </span>
      <div className="absolute bottom-full mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
        <div className="rounded-lg bg-gray-900/95 p-2 shadow-lg backdrop-blur-sm">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors"
          >
            <span className="mr-2">🇬🇧</span>
            English
          </button>
          <button
            onClick={() => i18n.changeLanguage('nl')}
            className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors"
          >
            <span className="mr-2">🇳🇱</span>
            Nederlands
          </button>
        </div>
      </div>
    </div>
  );
};
