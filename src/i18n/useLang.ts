import { useTranslation } from 'react-i18next';
import type { Lang, Localized } from '../content/types';

export function toLang(language: string | undefined): Lang {
  return language?.startsWith('en') ? 'en' : 'nl';
}

/** Current language plus a helper to pick a value from a `Localized` record. */
export function useLang() {
  const { i18n } = useTranslation();
  const lang = toLang(i18n.resolvedLanguage ?? i18n.language);
  const pick = <T,>(value: Localized<T>): T => value[lang];
  return { lang, pick };
}
