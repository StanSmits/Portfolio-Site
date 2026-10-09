import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ProjectLink } from '../../content/types';
import { useLang } from '../../i18n/useLang';

interface Props {
  link: ProjectLink;
  className?: string;
  /** Extends the link's hit area over the closest positioned ancestor (whole-card click). */
  stretched?: boolean;
}

export function ProjectLinkButton({ link, className = '', stretched = false }: Props) {
  const { pick } = useLang();
  const { t } = useTranslation();
  const stretch = stretched ? "after:absolute after:inset-0 after:rounded-[inherit] after:content-['']" : '';
  if (link.kind === 'internal') {
    return (
      <Link to={link.href} className={`${className} ${stretch}`}>
        {pick(link.label)}
        <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={`${className} ${stretch}`}>
      {pick(link.label)}
      <span className="sr-only"> ({t('work.openExternal')})</span>
      <ArrowUpRight className="btn-arrow btn-arrow-diag h-4 w-4" aria-hidden="true" />
    </a>
  );
}
