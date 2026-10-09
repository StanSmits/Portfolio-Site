export type Lang = 'en' | 'nl';

/** A value available in every supported language. */
export type Localized<T = string> = Record<Lang, T>;

export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  email: string;
  location: Localized;
  currently: Localized;
  studied: Localized;
  toolbox: string[];
  linkedin: string;
  github: string;
  siteRepository: string;
}

export interface ProjectLink {
  label: Localized;
  href: string;
  /** Internal links use the client router; external ones open in a new tab. */
  kind: 'internal' | 'external';
}

export interface ProjectDetailSection {
  heading: Localized;
  body: Localized;
}

export interface Project {
  id: string;
  title: string;
  /** Short line shown under the title. */
  kicker: Localized;
  summary: Localized;
  year: string;
  role: Localized;
  technologies: string[];
  links: ProjectLink[];
  featured?: boolean;
  /** Visual treatment used on the card. Visuals are illustrations, never fake screenshots. */
  visual: 'rvw' | 'tod' | 'wage' | 'site';
  /** Optional long-form content shown in the project dialog. */
  details?: ProjectDetailSection[];
}

export interface TimelineEntry {
  id: string;
  title: Localized;
  organisation: Localized;
  period: Localized;
  description: Localized;
}

export type NavId = 'work' | 'about' | 'experience' | 'contact';

export interface NavItem {
  id: NavId;
  label: Localized;
}
