import React from 'react';

interface BackgroundGradientProps {
  mousePosition: { x: number; y: number };
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ mousePosition }) => {
  // Inverse movement calculation
  const translateX = (mousePosition.x / window.innerWidth - 0.5) * -40;
  const translateY = (mousePosition.y / window.innerHeight - 0.5) * -40;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute h-[75vh] w-[75vw] rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px))`,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};