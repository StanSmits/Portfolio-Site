import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EDUCATION, EXPERIENCE } from '../../content/experience';
import type { TimelineEntry } from '../../content/types';
import { useLang } from '../../i18n/useLang';
import { useReveal } from '../../hooks/useReveal';
import { SceneAnchor } from '../scene/SceneAnchor';
import { SectionHeader } from './SectionHeader';

function Timeline({ entries, headingId }: { entries: readonly TimelineEntry[]; headingId: string }) {
  const { pick } = useLang();
  return (
    <ol aria-labelledby={headingId} className="border-t border-line/15">
      {entries.map((entry, index) => {
        const current = /present|heden/i.test(pick(entry.period));
        return (
          <li
            key={entry.id}
            data-reveal
            style={{ '--reveal-delay': `${Math.min(index, 4) * 60}ms` } as React.CSSProperties}
            className="group grid gap-x-6 gap-y-2 border-b border-line/15 py-7 sm:grid-cols-[9rem_1fr]"
          >
            <p className="flex items-center gap-2 self-start font-mono text-xs text-subtle sm:pt-2">
              {current && <span className="dot" aria-hidden="true" />}
              {pick(entry.period).replace(' - ', ' — ')}
            </p>
            <div>
              <h4 className="font-display text-[1.35rem] font-semibold leading-tight tracking-tight">
                {pick(entry.title)}
              </h4>
              <p className="mt-1 text-sm font-medium text-muted">{pick(entry.organisation)}</p>
              <p className="mt-3 max-w-[62ch] text-[0.95rem] leading-relaxed text-muted">{pick(entry.description)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ExperienceSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="experience" aria-labelledby="experience-title" className="section">
      <div className="shell">
        <SectionHeader
          id="experience-title"
          index="03"
          label={t('experience.label')}
          title={t('experience.title')}
          intro={t('experience.intro')}
          aside={<SceneAnchor className="col-span-12 hidden h-[40svh] md:col-span-5 md:block" />}
        />

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h3 id="experience-work" className="label mb-6">
              {t('experience.work')}
            </h3>
            <Timeline entries={EXPERIENCE} headingId="experience-work" />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <h3 id="experience-education" className="label mb-6">
              {t('experience.education')}
            </h3>
            <Timeline entries={EDUCATION} headingId="experience-education" />
          </div>
        </div>
      </div>
    </section>
  );
}
