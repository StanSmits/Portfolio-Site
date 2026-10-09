import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECTS } from '../../content/projects';
import { useReveal } from '../../hooks/useReveal';
import { FeaturedProject } from '../work/FeaturedProject';
import { ProjectCard } from '../work/ProjectCard';
import { SceneAnchor } from '../scene/SceneAnchor';
import { SectionHeader } from './SectionHeader';

export function WorkSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const featured = PROJECTS.filter((project) => project.featured);
  const others = PROJECTS.filter((project) => !project.featured);

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="section">
      <div className="shell">
        <SectionHeader
          id="work-title"
          index="01"
          label={t('work.label')}
          title={t('work.title')}
          intro={t('work.intro')}
          aside={<SceneAnchor className="col-span-12 hidden h-[44svh] md:col-span-5 md:block" />}
        />

        <div className="mt-16 space-y-6 md:mt-20">
          {featured.map((project) => (
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>

        <h3 className="label mt-20 md:mt-24" data-reveal>
          {t('work.smallTools')}
        </h3>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {others.map((project, index) => (
            <li key={project.id} className="flex">
              <ProjectCard project={project} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
