import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/SEO/MetaTags';
import { TOOLS } from '../utils/constants/tools';

const ToolsLayout: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const tool = TOOLS.find((item) => item.path === pathname);
  const isIndex = pathname.replace(/\/$/, '') === '/tools';
  const title = tool ? t(`tools.${tool.id}.title`) : t('tools.title');

  return (
    <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
      <MetaTags
        title={`${title} — Stan Smits`}
        description={tool ? t(`tools.${tool.id}.description`) : undefined}
        path={pathname}
      />
      <div className="shell pb-24 pt-[calc(var(--header-h)+3rem)]">
        <Link
          to={isIndex ? '/' : '/tools'}
          className="inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('tools.goBack')}
        </Link>
        <h1 className="h2 mt-6">{t('tools.title')}</h1>
        <div className="mt-10">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default ToolsLayout;
