import React from 'react';

interface BackgroundGradientProps {
  mousePosition: { x: number; y: number };
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ mousePosition }) => {
  // Inverse movement calculation
  const scrollY = window.scrollY;
  const translateY = (scrollY / window.innerHeight - 0.5) * 100;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute h-[50vh] w-[50vw] rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${0}px), calc(-50% + ${translateY}px))`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};