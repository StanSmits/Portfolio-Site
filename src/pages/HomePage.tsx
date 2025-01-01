import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { ExperienceSection } from '../components/Experience/ExperienceSection';
import { EducationSection } from '../components/Education/EducationSection';
import { ContactSection } from '../components/Contact/ContactSection';
import { Position } from '../types/common';

interface HomePageProps {
  mousePosition: Position;
}

export const HomePage: React.FC<HomePageProps> = ({ mousePosition }) => {
  return (
    <>
      <Hero mousePosition={mousePosition} />
      <EducationSection />
      <ExperienceSection mousePosition={mousePosition} />
      <ContactSection />
    </>
  );
};