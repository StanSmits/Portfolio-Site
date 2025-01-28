import React from 'react';

export const ReactiveBlob: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const translateX = (mousePosition.x / window.innerWidth - 0.5) * 60;
  const translateY = (mousePosition.y / window.innerHeight - 0.5) * 60;

  return (
    <>
      <div
        className="absolute left-[-50%] top-[-50%] h-[100%] w-[100%] animate-blob rounded-[40%] bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-3xl"
        style={{
          transform: `translate(${translateX}px, ${translateY}px) rotate(${translateX * 0.5}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <div
        className="absolute left-[-30%] top-[-30%] h-[160%] w-[160%] animate-blob rounded-[40%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"
        style={{
          transform: `translate(${translateX * -0.8}px, ${translateY * -0.8}px) rotate(${translateX * -0.3}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute left-[-40%] top-[-40%] h-[130%] w-[130%] animate-blob rounded-[45%] bg-gradient-to-br from-purple-600/5 to-blue-600/5 blur-2xl"
        style={{
          transform: `translate(${translateX * 0.6}px, ${translateY * 0.6}px) rotate(${translateX * 0.2}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animationDelay: '4s',
        }}
      />
    </>
  );
};