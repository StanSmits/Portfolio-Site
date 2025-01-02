import React from 'react';

interface EducationCardProps {
  title: string;
  institution: string;
  period: string;
  description: string;
  size?: 'normal' | 'large';
}

export const EducationCard: React.FC<EducationCardProps> = ({
  title,
  institution,
  period,
  description,
  size = 'normal',
}) => {
  const cardContent = (
    <div className="group h-full rounded-2xl bg-gray-900/50 p-6 transition-all hover:scale-[1.02] hover:bg-gray-900/70">
      <div className="flex h-full flex-col">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-purple-400">{institution}</p>
        <p className="text-sm text-gray-400">{period}</p>
        <p className="mt-4 text-gray-300">{description}</p>
      </div>
    </div>
  );

  return size === 'large' ? (
    <div className="col-span-2 row-span-2">
      {cardContent}
    </div>
  ) : (
    cardContent
  );
};
