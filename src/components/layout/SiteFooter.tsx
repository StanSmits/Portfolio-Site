import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PROFILE } from '../../content/profile';
import { TOOLS } from '../../utils/constants/tools';
import { useLatestCommit } from '../../hooks/useLatestCommit';

export function SiteFooter() {
  const { t } = useTranslation();
  const commit = useLatestCommit();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line/10 bg-bg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="shell grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-semibold tracking-tight">{PROFILE.name}</p>
          <p className="mt-2 text-sm text-muted">{t('footer.copyright', { year })}</p>
        </div>

        <nav aria-label={t('footer.tools')} className="md:col-span-3">
          <p className="label mb-3">{t('footer.tools')}</p>
          <ul className="space-y-1 text-sm">
            {TOOLS.map((tool) => (
              <li key={tool.id}>
                <Link to={tool.path} className="link-line inline-flex min-h-[2.25rem] items-center text-muted hover:text-ink">
                  {t(`tools.${tool.id}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 md:text-right">
          <p className="label mb-3">{t('footer.elsewhere')}</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-[2.25rem] items-center text-muted hover:text-ink">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={PROFILE.siteRepository} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-[2.25rem] items-center text-muted hover:text-ink">
                {t('footer.source')}
              </a>
            </li>
            {commit && (
              <li>
                <a href={commit.url} target="_blank" rel="noopener noreferrer" className="link-line inline-flex min-h-[2.25rem] items-center font-mono text-xs text-subtle hover:text-ink">
                  {t('footer.latestCommit')} {commit.sha.slice(0, 7)}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="shell flex items-center justify-between border-t border-line/10 py-5 text-xs text-subtle">
        <span>{PROFILE.location.en}</span>
        <a href="#top" className="inline-flex min-h-[2.75rem] items-center gap-2 hover:text-ink" onClick={(event) => {
          if (window.location.pathname !== '/') return;
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          document.getElementById('main-content')?.focus({ preventScroll: true });
        }}>
          {t('footer.backToTop')}
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
