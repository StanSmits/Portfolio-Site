import React from 'react';
import { useParticles } from '../../hooks/useParticles';

export const ParticleOverlay: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  const particles = useParticles(15);

  return (
    <div className="absolute inset-0 z-10">
      {particles.map((particle, index) => {
        const translateX = (mousePosition.x / window.innerWidth - 0.5) * 20 * particle.factor;
        const translateY = (mousePosition.y / window.innerHeight - 0.5) * 20 * particle.factor;
        const scale = 1 + Math.abs(translateX + translateY) / 400;

        return (
          <div
            key={index}
            className={`absolute ${particle.shape} bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm`}
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.x + '%',
              top: particle.y + '%',
              transform: `translate(${translateX}px, ${translateY}px) rotate(${particle.rotation + translateX * 0.2}deg) scale(${scale})`,
              animation: 'squiggle 2s infinite ease-in-out',
            }}
          />
        );
      })}
    </div>
  );
};