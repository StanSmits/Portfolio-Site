import React, { Suspense } from 'react';
import { ExperienceCard } from './ExperienceCard';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../LoadingSpinner/Skeleton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './experience.css';

const ExperienceCardSkeleton = () => (
  <div className="h-64">
    <Skeleton className="h-full rounded-2xl" />
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <h2
      ref={elementRef}
      className={`mb-12 text-3xl font-bold transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {title}
    </h2>
  );
};

const ExperienceSection: React.FC<{
  mousePosition: { x: number; y: number };
}> = ({ mousePosition }) => {
  const { t } = useTranslation();

  const experiences = [
    {
      title: t('experience.enforcer.title'),
      company: t('experience.enforcer.company'),
      period: t('experience.enforcer.period'),
      description: t('experience.enforcer.description'),
    },
    {
      title: t('experience.driver.title'),
      company: t('experience.driver.company'),
      period: t('experience.driver.period'),
      description: t('experience.driver.description'),
    },
    {
      title: t('experience.installer.title'),
      company: t('experience.installer.company'),
      period: t('experience.installer.period'),
      description: t('experience.installer.description'),
    },
    {
      title: t('experience.specialist.title'),
      company: t('experience.specialist.company'),
      period: t('experience.specialist.period'),
      description: t('experience.specialist.description'),
    },
    {
      title: t('experience.customerService.title'),
      company: t('experience.customerService.company'),
      period: t('experience.customerService.period'),
      description: t('experience.customerService.description'),
    },
    {
      title: t('experience.allRound.title'),
      company: t('experience.allRound.company'),
      period: t('experience.allRound.period'),
      description: t('experience.allRound.description'),
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <SectionTitle title={t('sections.experience')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp, index) => (
            <div key={index} className="w-full h-full">
              <Suspense fallback={<ExperienceCardSkeleton />}>
                <ExperienceCard
                  {...exp}
                  mousePosition={mousePosition}
                  index={index}
                />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
