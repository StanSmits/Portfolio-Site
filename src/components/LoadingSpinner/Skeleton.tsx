import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 ${className}`}
      style={{
        backgroundSize: '200% 100%',
        animation: 'pulse 2s ease-in-out infinite',
      }}
    />
  );
};