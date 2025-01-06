import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguagePrompt: React.FC = () => {
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Reset the language prompt state
    localStorage.removeItem('languagePromptShown');
    setShow(true);
  }, []);

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setShow(false);
    localStorage.setItem('languagePromptShown', 'true');
    console.log(i18n.language);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-900/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="space-y-2">
        <p className="text-sm text-gray-300">{t('languagePrompt.select')}</p>
        <div className="flex space-x-2">
          <button
            onClick={() => handleLanguageSelect('en')}
            className={
              i18n.language === 'en'
                ? 'text-purple-400 flex items-center px-3 py-1 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-600 rounded-md transition-colors duration-300'
                : 'flex items-center px-3 py-1 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors duration-300'
            }
          >
            <span className="mr-2">🇬🇧</span>
            English
          </button>
          <button
            onClick={() => handleLanguageSelect('nl')}
            className={
              i18n.language === 'nl'
                ? 'text-purple-400 flex items-center px-3 py-1 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-600 rounded-md transition-colors duration-300'
               : 'flex items-center px-3 py-1 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors duration-300'
            }
          >
            <span className="mr-2">🇳🇱</span>
            Nederlands
          </button>
        </div>
      </div>
    </div>
  );
};
