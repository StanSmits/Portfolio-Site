import { ArrowDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SceneAnchor } from '../scene/SceneAnchor';
import { useSceneStatus } from '../scene/SceneContext';

export function HeroSection() {
  const { t } = useTranslation();
  const status = useSceneStatus();

  return (
    <section id="top" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col">
      <div className="shell grid flex-1 grid-cols-12 content-end gap-x-6 pb-10 pt-[calc(var(--header-h)+1rem)] md:pb-16 lg:content-center lg:pt-[var(--header-h)]">
        <SceneAnchor
          fallback="stack"
          className="col-span-12 h-[34svh] min-h-[200px] md:h-[38svh] lg:order-last lg:col-span-5 lg:h-[64svh]"
        />

        <div className="relative z-10 col-span-12 lg:col-span-7 lg:row-start-1">
          <p className="label flex items-center gap-3" data-hero-item style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="h-px w-8 bg-line/40" aria-hidden="true" />
            {t('hero.eyebrow')}
          </p>
          <h1 id="hero-title" className="display mt-6" data-hero-item style={{ '--d': '80ms' } as React.CSSProperties}>
            <span className="block">Stan</span>
            <span className="block pl-[0.6em] lg:pl-[0.9em]">Smits</span>
          </h1>
          <p className="lead mt-8 max-w-[34ch] text-ink/80" data-hero-item style={{ '--d': '180ms' } as React.CSSProperties}>
            {t('hero.statement')}
          </p>
          <div className="mt-9 flex flex-wrap gap-3" data-hero-item style={{ '--d': '260ms' } as React.CSSProperties}>
            <a href="#work" className="btn btn-primary">
              {t('hero.ctaWork')}
              <ArrowDown className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              {t('hero.ctaContact')}
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-10 flex items-center gap-3 text-sm text-muted" data-hero-item style={{ '--d': '340ms' } as React.CSSProperties}>
            <span className="dot" aria-hidden="true" />
            {t('hero.location')}
          </p>
        </div>
      </div>

      <div className="shell flex items-center justify-between pb-6 text-xs text-subtle" aria-hidden="true">
        <span className="flex items-center gap-3">
          <span className="relative block h-8 w-px overflow-hidden bg-line/15">
            <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ink/60" />
          </span>
          <span className="label">{t('hero.scroll')}</span>
        </span>
        <span className={`label transition-opacity duration-700 ${status === 'pending' ? 'opacity-100' : 'opacity-0'}`}>
          {t('hero.sceneLoading')}
        </span>
      </div>
    </section>
  );
}
