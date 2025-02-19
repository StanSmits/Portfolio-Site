import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ToolsLayout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-20">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-300 hover:text-purple-500 focus:outline-none transition-all duration-300 hover:scale-[1.02]"
        >
          <ArrowLeft className="mr-2" />
          {t('tools.goBack')}
        </button>
        <h1 className="text-4xl font-bold text-white mt-4">{t('tools.title')}</h1>
      </div>
      <div className="rounded-lg bg-gray-900/50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ToolsLayout;