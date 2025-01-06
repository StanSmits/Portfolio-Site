import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const tools = [
  { name: 'calculator', path: '/tools/calculator' },
];

export const ToolsMenu: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="group relative">
      <span className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors cursor-pointer">
        {t('footer.tools')}
      </span>
      <div className="absolute left-0 bottom-full mb-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
        <div className="rounded-lg bg-gray-900/95 p-2 shadow-lg backdrop-blur-sm">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 hover:text-purple-400 rounded-md transition-colors"
            >
              {t(`tools.${tool.name}.title`)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};