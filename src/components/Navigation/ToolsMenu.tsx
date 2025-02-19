import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../../utils/constants/tools';

export const ToolsMenu: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="group relative w-full">
      <span className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">
        {t('footer.tools')}
      </span>
      <div className="absolute w-full grid bottom-full mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
        <div className="rounded-lg bg-gray-900/95 p-2 shadow-lg backdrop-blur-sm">
          {TOOLS.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors"
            >
              <span className="mr-2">{tool.icon}</span>
              {t(`tools.${tool.id}.title`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};