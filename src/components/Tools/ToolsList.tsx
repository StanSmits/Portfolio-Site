import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../../utils/constants/tools';

export const ToolsList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <Link
          key={tool.path}
          to={tool.path}
          className="group p-6 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">{tool.icon}</span>
            <h2 className="text-xl font-semibold text-white">
              {t(`tools.${tool.id}.title`)}
            </h2>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
            {t(`tools.${tool.id}.description`)}
          </p>
        </Link>
      ))}
    </div>
  );
};