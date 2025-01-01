import React from 'react';

interface BlobProps {
  className?: string;
  mousePosition: { x: number; y: number };
}

export const Blob: React.FC<BlobProps> = ({ className, mousePosition }) => {
  const translateX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const translateY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-r from-purple-600/30 to-blue-600/30 blur-3xl transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    />
  );
};