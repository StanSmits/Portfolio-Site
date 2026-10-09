import i18n from './i18n';
import type { Lang } from '../content/types';

/** Switch language and remember the explicit choice (also dismisses the first-visit prompt). */
export function setLanguage(lang: Lang) {
  void i18n.changeLanguage(lang);
  try {
    localStorage.setItem('languagePromptShown', 'true');
  } catch {
    // Storage unavailable: the choice still applies to this session.
  }
  document.cookie = `i18next=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}
