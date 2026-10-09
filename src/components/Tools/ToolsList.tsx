import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../../utils/constants/tools';

export const ToolsList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <li key={tool.path}>
          <Link to={tool.path} className="panel group flex h-full flex-col p-6 transition-transform duration-500 ease-out hover:-translate-y-1">
            <span className="text-2xl" aria-hidden="true">
              {tool.icon}
            </span>
            <h2 className="h3 mt-4 !text-2xl">{t(`tools.${tool.id}.title`)}</h2>
            <p className="mt-3 text-sm text-muted">{t(`tools.${tool.id}.description`)}</p>
            <ArrowRight className="mt-6 h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
};
