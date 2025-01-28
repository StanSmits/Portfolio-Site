import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image = '/images/image.png',
  url = 'https://stansmits.nl',
}) => {
  const { t } = useTranslation();
  const defaultTitle = t('meta.title');
  const defaultDescription = t('meta.description');

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={image} />

      {/* Preload Critical Resources */}
      <link rel="preload" href="/images/image.png" as="image" />
      <link rel="preconnect" href="https://api.github.com" />
    </Helmet>
  );
};