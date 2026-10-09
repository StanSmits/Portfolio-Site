import type { NavItem, Profile } from './types';

export const PROFILE: Profile = {
  name: 'Stan Smits',
  email: 'connect@stansmits.nl',
  location: { en: 'Amsterdam, NL', nl: 'Amsterdam' },
  currently: {
    en: 'Public space enforcer, Municipality of Amsterdam',
    nl: 'Handhaver openbare ruimte, Gemeente Amsterdam',
  },
  studied: { en: 'Computer Science, Hogeschool Leiden', nl: 'Informatica, Hogeschool Leiden' },
  toolbox: ['TypeScript', 'React', 'Supabase', 'PostgreSQL', 'Three.js'],
  linkedin: 'https://www.linkedin.com/in/stan-smits-63227b21a/',
  github: 'https://github.com/StanSmits',
  siteRepository: 'https://github.com/StanSmits/Portfolio-Site',
};

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'work', label: { en: 'Work', nl: 'Werk' } },
  { id: 'about', label: { en: 'About', nl: 'Over' } },
  { id: 'experience', label: { en: 'Experience', nl: 'Ervaring' } },
  { id: 'contact', label: { en: 'Contact', nl: 'Contact' } },
];
