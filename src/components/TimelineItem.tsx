import React from 'react';

interface TimelineItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  company,
  period,
  description,
}) => {
  return (
    <div className="relative flex-1 p-6">
      <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 p-6 transition-all hover:scale-[1.02] hover:bg-gray-900/70">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-1 text-purple-400">{company}</p>
        <p className="text-sm text-gray-400">{period}</p>
        <p className="mt-4 text-gray-300">{description}</p>
      </div>
    </div>
  );
};