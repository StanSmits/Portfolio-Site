import React from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface EducationCardProps {
  title: string;
  institution: string;
  period: string;
  description: string;
  size?: 'normal' | 'large';
  index: number;
}

export const EducationCard: React.FC<EducationCardProps> = ({
  title,
  institution,
  period,
  description,
  size = 'normal',
  index,
}) => {
  const { t } = useTranslation();
  const { elementRef, isVisible } = useScrollAnimation(index * 200);

  return (
    <div
      ref={elementRef}
      className={`${size === 'large' ? 'col-span-full md:col-span-2' : 'col-span-full md:col-span-1'} transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="group h-full rounded-2xl bg-gray-900/50 p-6 transition-all hover:scale-[1.02] hover:bg-gray-900/70">
        <div className="flex h-full flex-col">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-purple-400">{institution}</p>
          <p className="text-sm text-gray-400">{period}</p>
          <p className="mt-4 text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};