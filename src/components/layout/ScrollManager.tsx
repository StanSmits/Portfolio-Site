import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Router-level scroll handling: scroll to the hash target after client-side navigation
 * (e.g. from /tools to /#work) and to the top on new pages. Back/forward navigation
 * keeps the browser's own scroll restoration.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    if (hash) {
      // Wait a frame so the target section has rendered.
      const frame = requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
