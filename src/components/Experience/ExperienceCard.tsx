import React, { useRef, useState } from 'react';
import { useGradientEffect } from '../../hooks/useGradientEffect';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './experience.css';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  description: string;
  mousePosition: { x: number; y: number };
  index: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  period,
  description,
  mousePosition,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { gradientPosition, isInBounds } = useGradientEffect(cardRef, mousePosition);
  const { elementRef, isVisible } = useScrollAnimation(index * 200);

  return (
    <div 
      ref={elementRef}
      className={`relative flex-1 p-6 h-full transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div
        ref={cardRef}
        className="h-full group relative overflow-hidden rounded-2xl bg-gray-900/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-900/70"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered && isInBounds ? 1 : 0,
            background: `radial-gradient(300px circle at ${gradientPosition.x}px ${gradientPosition.y}px, rgba(139, 92, 246, 0.15), transparent 60%)`,
          }}
        />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-purple-400">{company}</p>
          <p className="text-sm text-gray-400">{period}</p>
          <p className={`mt-4 text-gray-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {description}
          </p>
          <button
            className="mt-2 text-purple-400 hover:text-purple-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
    </div>
  );
};