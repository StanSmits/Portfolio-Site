import { useEffect, useState } from 'react';

interface GradientEffect {
  gradientPosition: { x: number; y: number };
  isInBounds: boolean;
}

export const useGradientEffect = (
  ref: React.RefObject<HTMLElement>,
  mousePosition: { x: number; y: number }
): GradientEffect => {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [isInBounds, setIsInBounds] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateGradientPosition = () => {
      const rect = element.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      
      const inBounds = 
        mousePosition.x >= rect.left &&
        mousePosition.x <= rect.right &&
        mousePosition.y >= rect.top &&
        mousePosition.y <= rect.bottom;

      setIsInBounds(inBounds);
      setGradientPosition({ x, y });
    };

    updateGradientPosition();
  }, [mousePosition]);

  return { gradientPosition, isInBounds };
};