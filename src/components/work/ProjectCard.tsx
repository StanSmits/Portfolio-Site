import { useTranslation } from 'react-i18next';
import type { Project } from '../../content/types';
import { useLang } from '../../i18n/useLang';
import { usePointerTilt } from '../../hooks/usePointerTilt';
import { ProjectVisual } from './ProjectVisual';
import { ProjectLinkButton } from './ProjectLinkButton';

/** Compact project card. The whole surface is clickable through its primary link. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { pick } = useLang();
  const { t } = useTranslation();
  const tilt = usePointerTilt<HTMLElement>({ max: 4 });
  const primary = project.links[0];

  return (
    <article
      ref={tilt.ref}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      data-reveal
      style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
      className="tilt panel group relative flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-ink/60"
    >
      <div className="relative aspect-[16/10] border-b border-line/10 bg-surface/60">
        <ProjectVisual visual={project.visual} />
        <span className="label absolute left-4 top-4 !text-[0.65rem]">{project.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="label">{pick(project.kicker)}</p>
        <h3 className="h3 mt-2">{project.title}</h3>
        <p className="mt-3 text-[0.95rem] text-muted">{pick(project.summary)}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t('work.stack')}>
          {project.technologies.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          {primary && (
            <ProjectLinkButton
              link={primary}
              stretched
              className="btn -ml-1 min-h-[2.75rem] px-1 py-1 text-sm underline-offset-4 group-hover:underline"
            />
          )}
        </div>
      </div>
      <span className="tilt-glare" aria-hidden="true" />
    </article>
  );
}
