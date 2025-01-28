import React from 'react';
import { useTranslation } from 'react-i18next';

export const SkipLink: React.FC = () => {
  const { t } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      {t('accessibility.skipToContent')}
    </a>
  );
};