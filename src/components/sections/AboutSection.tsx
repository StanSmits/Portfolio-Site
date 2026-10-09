import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PROFILE } from '../../content/profile';
import { useLang } from '../../i18n/useLang';
import { useReveal } from '../../hooks/useReveal';
import { SceneAnchor } from '../scene/SceneAnchor';

export function AboutSection() {
  const { t } = useTranslation();
  const { pick } = useLang();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const facts = [
    { term: t('about.facts.based'), value: pick(PROFILE.location) },
    { term: t('about.facts.now'), value: pick(PROFILE.currently) },
    { term: t('about.facts.studied'), value: pick(PROFILE.studied) },
    { term: t('about.facts.builds'), value: PROFILE.toolbox.join(' · ') },
  ];

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="section">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-10">
        {/* The exploded sculpture occupies this column; it stays in view while the text scrolls. */}
        <div className="col-span-12 lg:col-span-5">
          <SceneAnchor fallback="exploded" className="h-[38svh] min-h-[220px] lg:sticky lg:top-[14svh] lg:h-[72svh]" />
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-reveal>
            <p className="label flex items-center gap-3">
              <span className="font-mono tracking-normal text-ink">02</span>
              <span className="h-px w-8 bg-line/40" aria-hidden="true" />
              {t('about.label')}
            </p>
            <h2 id="about-title" className="h2 mt-6">
              {t('about.title')}
            </h2>
          </div>

          <div className="mt-10 space-y-6 text-[1.08rem] leading-relaxed text-ink/85">
            <p data-reveal>{t('about.p1')}</p>
            <p data-reveal>{t('about.p2')}</p>
            <p data-reveal>{t('about.p3')}</p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-end">
            <figure data-reveal className="relative overflow-hidden rounded-[var(--radius)] border border-line/10 bg-surface-strong">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/portrait-480.webp 480w, /images/portrait-800.webp 800w"
                  sizes="(min-width: 640px) 15rem, 100vw"
                />
                <img
                  src="/images/portrait-800.jpg"
                  alt={t('about.portraitAlt')}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </picture>
            </figure>

            <dl data-reveal className="divide-y divide-line/10 border-y border-line/10 text-sm">
              {facts.map((fact) => (
                <div key={fact.term} className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                  <dt className="label pt-0.5">{fact.term}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
