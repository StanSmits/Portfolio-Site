import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SectionLinkProps {
  id: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  current?: boolean;
}

/**
 * Links to a homepage section. On the homepage it is a native fragment link, so URLs,
 * history and keyboard behaviour stay standard; elsewhere it routes back to the homepage.
 */
export function SectionLink({ id, children, className, onNavigate, current }: SectionLinkProps) {
  const { pathname } = useLocation();
  const ariaCurrent = current ? ('true' as const) : undefined;
  if (pathname === '/') {
    return (
      <a href={`#${id}`} className={className} onClick={onNavigate} aria-current={ariaCurrent}>
        {children}
      </a>
    );
  }
  return (
    <Link to={{ pathname: '/', hash: `#${id}` }} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
