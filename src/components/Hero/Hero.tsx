import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileImage } from './ProfileImage';
import { ParticleOverlay } from './ParticleOverlay';
import { ReactiveBlob } from './ReactiveBlob';
import { Skeleton } from '../LoadingSpinner/Skeleton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { MetaTags } from '../SEO/MetaTags';

const HeroContent: React.FC = () => {
  const { t } = useTranslation();
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`relative z-10 text-center lg:text-left transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
        <span className="text-purple-500">{t('hero.title')}</span>
      </h1>
      <p className="mt-4 text-lg text-gray-300 sm:text-xl">
        {t('hero.description')}
      </p>
    </div>
  );
};

const HeroSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-16 w-3/4 rounded-lg" />
    <Skeleton className="h-20 w-full rounded-lg" />
  </div>
);

const Hero: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  const { elementRef, isVisible } = useScrollAnimation(200);
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] overflow-hidden px-4 py-12 sm:py-16">
      <MetaTags title={t('meta.title')} description={t('meta.description')} />
      <ReactiveBlob mousePosition={mousePosition} />

      <div className="container mx-auto grid items-center gap-8 lg:grid-cols-2">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroContent />
        </Suspense>
        <div
          ref={elementRef}
          className={`relative mx-auto max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <ProfileImage />
          <ParticleOverlay mousePosition={mousePosition} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
