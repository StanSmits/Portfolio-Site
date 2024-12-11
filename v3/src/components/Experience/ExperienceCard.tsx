import React, { useRef, useState } from 'react';
import { useGradientEffect } from '../../hooks/useGradientEffect';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  description: string;
  mousePosition: { x: number; y: number };
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  period,
  description,
  mousePosition,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { gradientPosition, isInBounds } = useGradientEffect(cardRef, mousePosition);

  return (
    <div 
      ref={cardRef} 
      className="relative flex-1 p-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-gray-900/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-900/70">
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered && isInBounds ? 1 : 0,
            background: `radial-gradient(300px circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(139, 92, 246, 0.15), transparent 60%)`,
            transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-purple-400">{company}</p>
          <p className="text-sm text-gray-400">{period}</p>
          <p className="mt-4 text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};