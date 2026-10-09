import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MetaTagsProps {
  title?: string;
  description?: string;
  /** Path relative to the site root, e.g. "/tools/tod". */
  path?: string;
}

const ORIGIN = 'https://stansmits.nl';

function setMeta(selector: string, attribute: 'content' | 'href', value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

/**
 * Updates the static tags declared in index.html in place, so crawlers without
 * JavaScript see sensible defaults and there are never duplicate tags.
 */
export function MetaTags({ title, description, path = '/' }: MetaTagsProps) {
  const { t } = useTranslation();
  const pageTitle = title || t('meta.title');
  const pageDescription = description || t('meta.description');

  useEffect(() => {
    const url = `${ORIGIN}${path}`;
    document.title = pageTitle;
    setMeta('meta[name="description"]', 'content', pageDescription);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDescription);
    setMeta('meta[property="og:url"]', 'content', url);
  }, [pageTitle, pageDescription, path]);

  return null;
}
