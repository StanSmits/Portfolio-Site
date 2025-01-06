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
  ];

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <h2 className="mb-12 text-3xl font-bold">{t('sections.education')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {educationData.map((edu, index) => (
            <div key={index} className={`${edu.size === 'large' ? 'col-span-full md:col-span-2' : 'col-span-full md:col-span-1'}`}>
              <EducationCard {...edu} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};