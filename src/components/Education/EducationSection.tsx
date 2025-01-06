import React from 'react';
import { EducationCard } from './EducationCard';
import { useTranslation } from 'react-i18next';

export const EducationSection: React.FC = () => {
  const { t } = useTranslation();

  const educationData = [
    {
      title: t('education.computerScience.title'),
      institution: t('education.computerScience.institution'),
      period: t('education.computerScience.period'),
      description: t('education.computerScience.description'),
      size: 'large',
    },
    {
      title: t('education.highSchool.title'),
      institution: t('education.highSchool.institution'),
      period: t('education.highSchool.period'),
      description: t('education.highSchool.description'),
    },
    {
      title: t('education.bio.title'),
      institution: t('education.bio.institution'),
      period: t('education.bio.period'),
      description: t('education.bio.description'),
    },
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <h2 className="mb-12 text-3xl font-bold">{t('sections.education')}</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {educationData.map((edu, index) => (
            <div
              key={index}
              className={`col-span-full p-6 md:p-0 ${
                edu.size === 'large' ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1 lg:col-span-1'
              }`}
            >
              <EducationCard {...edu} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};