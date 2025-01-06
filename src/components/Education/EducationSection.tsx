import React from 'react';
import { EducationCard } from './EducationCard';
import { useTranslation } from 'react-i18next';

export const EducationSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-screen-lg">
        <h2 className="mb-12 text-3xl font-bold">{t('sections.education')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full md:col-span-2 lg:col-span-2">
            <EducationCard
              title="Computer Science"
              institution="Hogeschool Leiden"
              period="2021 - 2024"
              description="Specialized in software engineering and computer science."
              size="large"
            />
          </div>
          <div className="col-span-full md:col-span-1">
            <EducationCard
              title="Middelbare School (Havo)"
              institution="Fioretti College Lisse"
              period="- 2016"
              description="Graduated with a strong foundation in mathematics and science."
            />
          </div>
        </div>
      </div>
    </section>
  );
};