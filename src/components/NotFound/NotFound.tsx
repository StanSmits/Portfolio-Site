import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../SEO/MetaTags';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
      <MetaTags title={`404 — ${t('notFound.title')}`} />
      <div className="shell flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
        <p className="label">404</p>
        <h1 className="h2 mt-4">{t('notFound.title')}</h1>
        <p className="lead mt-6">{t('notFound.description')}</p>
        <Link to="/" className="btn btn-primary mt-10 self-start">
          {t('notFound.homeLink')}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
