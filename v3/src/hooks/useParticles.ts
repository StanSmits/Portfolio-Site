import { useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  rotation: number;
  factor: number;
  shape: string;
}

export const useParticles = (count: number): Particle[] => {
  return useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 15,
      rotation: Math.random() * 360,
      factor: Math.random() * 0.8 + 0.4,
      shape: Math.random() > 0.5 ? 'rounded-xl' : 'rotate-45',
    }));
  }, [count]);
};