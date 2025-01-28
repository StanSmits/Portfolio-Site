import React, { Suspense } from 'react';
import { EducationCard } from './EducationCard';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../LoadingSpinner/Skeleton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const EducationCardSkeleton = () => (
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

const EducationSection: React.FC = () => {
  const { t } = useTranslation();

  const educationData = [
    {
      title: t('education.bio.title'),
      institution: t('education.bio.institution'),
      period: t('education.bio.period'),
      description: t('education.bio.description'),
      size: 'large' as 'large' | 'normal' | undefined,
    },
    {
      title: t('education.computerScience.title'),
      institution: t('education.computerScience.institution'),
      period: t('education.computerScience.period'),
      description: t('education.computerScience.description'),
    },
    {
      title: t('education.highSchool.title'),
      institution: t('education.highSchool.institution'),
      period: t('education.highSchool.period'),
      description: t('education.highSchool.description'),
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <SectionTitle title={t('sections.education')} />
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className={`col-span-full p-6 md:p-0 ${
                edu.size === 'large'
                  ? 'md:col-span-2 lg:col-span-2'
                  : 'md:col-span-1 lg:col-span-1'
              }`}
            >
              <Suspense fallback={<EducationCardSkeleton />}>
                <EducationCard {...edu} index={index} />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
