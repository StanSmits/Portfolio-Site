import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toLang } from '../../i18n/useLang';
import { setLanguage } from '../../i18n/setLanguage';

/** First-visit language choice. Non-modal and dismissed permanently once a language is picked. */
export function LanguagePrompt() {
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();
  const current = toLang(i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem('languagePromptShown'));
    } catch {
      seen = true;
    }
    if (seen) return;
    const timer = window.setTimeout(() => setShow(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  const choose = (lang: 'en' | 'nl') => {
    setLanguage(lang);
    setShow(false);
  };

  return (
    <aside
      aria-label={t('languagePrompt.select')}
      className="panel fixed bottom-4 left-4 right-4 z-40 p-4 sm:left-auto sm:max-w-xs"
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <p className="text-sm text-muted">{t('languagePrompt.select')}</p>
      <div className="mt-3 flex gap-2">
        {(['nl', 'en'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            lang={lang}
            onClick={() => choose(lang)}
            aria-pressed={current === lang}
            className={`btn min-h-[2.75rem] flex-1 px-4 py-2 text-sm ${current === lang ? 'btn-primary' : 'btn-ghost'}`}
          >
            {lang === 'nl' ? 'Nederlands' : 'English'}
          </button>
        ))}
      </div>
    </aside>
  );
}
