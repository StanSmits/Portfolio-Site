import { useEffect } from 'react';

/**
 * Fades in every `[data-reveal]` element inside `root` once it enters the viewport.
 * Elements stay visible when JavaScript or IntersectionObserver is unavailable,
 * because the hidden state is only applied under `.js-reveal` (set in index.html).
 */
export function useReveal(root: React.RefObject<HTMLElement>, deps: unknown[] = []) {
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
