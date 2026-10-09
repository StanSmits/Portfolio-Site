import { useTranslation } from 'react-i18next';
import { MetaTags } from '../components/SEO/MetaTags';
import { SceneProvider } from '../components/scene/SceneLayer';
import { HeroSection } from '../components/sections/HeroSection';
import { WorkSection } from '../components/sections/WorkSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ContactSection } from '../components/sections/ContactSection';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <SceneProvider>
      <MetaTags title={t('meta.title')} description={t('meta.description')} />
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </SceneProvider>
  );
}
