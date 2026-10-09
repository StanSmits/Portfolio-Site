import { useTranslation } from 'react-i18next';
import { toLang } from '../../i18n/useLang';
import { setLanguage } from '../../i18n/setLanguage';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = toLang(i18n.resolvedLanguage ?? i18n.language);
  const next = current === 'nl' ? 'en' : 'nl';
  return (
    <button
      type="button"
      className={`icon-btn text-xs font-semibold tracking-[0.08em] ${className}`}
      onClick={() => setLanguage(next)}
      aria-label={t('nav.languageSwitchLabel')}
      title={t('nav.languageSwitch')}
      lang={next}
    >
      <span aria-hidden="true">{next.toUpperCase()}</span>
    </button>
  );
}
