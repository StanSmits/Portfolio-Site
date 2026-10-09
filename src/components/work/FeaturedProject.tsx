import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../content/types';
import { useLang } from '../../i18n/useLang';
import { usePointerTilt } from '../../hooks/usePointerTilt';
import { ProjectVisual } from './ProjectVisual';
import { ProjectDialog, type ProjectDialogHandle } from './ProjectDialog';
import { ProjectLinkButton } from './ProjectLinkButton';

export function FeaturedProject({ project }: { project: Project }) {
  const { t } = useTranslation();
  const { pick } = useLang();
  const tilt = usePointerTilt<HTMLDivElement>({ max: 6 });
  const dialog = useRef<ProjectDialogHandle>(null);

  return (
    <article
      aria-labelledby={`${project.id}-title`}
      data-reveal
      className="panel relative grid overflow-hidden lg:grid-cols-12"
    >
      <div className="flex flex-col p-6 sm:p-10 lg:col-span-5 lg:p-12">
        <div className="flex items-center justify-between gap-4">
          <p className="label flex items-center gap-2">
            <span className="dot" aria-hidden="true" />
            {t('work.featured')}
          </p>
          <p className="label">{project.year}</p>
        </div>
        <h3 id={`${project.id}-title`} className="h2 mt-8 !text-[clamp(2.5rem,1.6rem+3vw,4.5rem)]">
          {project.title}
        </h3>
        <p className="mt-3 font-medium text-ink/80">{pick(project.kicker)}</p>
        <p className="mt-6 text-muted">{pick(project.summary)}</p>

        <dl className="mt-8 space-y-3 border-t border-line/10 pt-6 text-sm">
          <div className="flex gap-4">
            <dt className="label w-24 shrink-0 pt-0.5">{t('work.role')}</dt>
            <dd>{pick(project.role)}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="label w-24 shrink-0 pt-0.5">{t('work.stack')}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-3 pt-10">
          {project.details && (
            <button
              type="button"
              className="btn btn-primary"
              aria-haspopup="dialog"
              onClick={(event) => dialog.current?.open(event.currentTarget)}
            >
              {t('work.readCase')}
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {project.links.map((link) => (
            <ProjectLinkButton key={link.href} link={link} className="btn btn-ghost" />
          ))}
        </div>
      </div>

      <figure className="relative min-h-[22rem] border-t border-line/10 bg-surface/70 sm:min-h-[28rem] lg:col-span-7 lg:border-l lg:border-t-0">
        <div
          ref={tilt.ref}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
          className="tilt absolute inset-0"
        >
          <ProjectVisual visual={project.visual} />
          <span className="tilt-glare" aria-hidden="true" />
        </div>
        <figcaption className="label absolute bottom-4 right-5 !text-[0.65rem]">{t('work.illustration')}</figcaption>
      </figure>

      {project.details && <ProjectDialog ref={dialog} project={project} />}
    </article>
  );
}
