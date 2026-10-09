import type { Project } from './types';
import { PROFILE } from './profile';

/**
 * Projects shown in the Work section. Only genuine projects belong here.
 * Card visuals are drawn illustrations of each product, not screenshots.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: 'rvw-generator',
    title: 'RvW Generator',
    kicker: {
      en: 'Feitcode helper for enforcement reports',
      nl: 'Feitcode-hulp voor handhavingsrapportage',
    },
    summary: {
      en: 'A web app that turns a Dutch offence code (feitcode) and a few structured answers into a consistently structured “reden van wetenschap” — the factual account that accompanies a report.',
      nl: 'Een webapp die van een feitcode en een paar gestructureerde antwoorden een consequent opgebouwde reden van wetenschap maakt — de feitelijke onderbouwing bij een rapportage.',
    },
    year: '2025 —',
    role: {
      en: 'Concept, design, development & maintenance',
      nl: 'Concept, ontwerp, ontwikkeling & beheer',
    },
    technologies: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Edge functions', 'Stripe', 'PWA'],
    links: [
      {
        label: { en: 'Visit the live app', nl: 'Bekijk de live app' },
        href: 'https://feitcodes.stansmits.nl',
        kind: 'external',
      },
    ],
    featured: true,
    visual: 'rvw',
    details: [
      {
        heading: { en: 'The problem', nl: 'Het probleem' },
        body: {
          en: 'Every offence code needs its own reden van wetenschap: a precise account of what was observed and how. Writing these by hand means rebuilding the same structure again and again, with the right legal wording for each code.',
          nl: 'Elke feitcode vraagt om een eigen reden van wetenschap: een precieze beschrijving van wat er is waargenomen en hoe. Die met de hand schrijven betekent steeds opnieuw dezelfde opbouw maken, met de juiste juridische formulering per code.',
        },
      },
      {
        heading: { en: 'The workflow', nl: 'De werkwijze' },
        body: {
          en: 'Search for a code by number or by plain description, answer a short form with the situation-specific details, and copy the generated text. Frequently used codes can be kept as favourites, and generated texts can be saved for later.',
          nl: 'Zoek een code op nummer of op omschrijving, vul een kort formulier in met de details van de situatie en kopieer de gegenereerde tekst. Veelgebruikte codes bewaar je als favoriet en gegenereerde teksten kun je opslaan voor later.',
        },
      },
      {
        heading: { en: 'Structured input, conditional logic', nl: 'Gestructureerde invoer, conditionele logica' },
        body: {
          en: 'Each code has a template with placeholders. Fields are text inputs, dropdowns or radio groups, and conditional rules — equals, contains, is empty and their opposites — decide which fields appear based on earlier answers. One shared template schema validates and renders templates in both the browser and the backend, with a test that fails the build when the two copies drift.',
          nl: 'Elke code heeft een sjabloon met invulvelden. Velden zijn tekstinvoer, keuzelijsten of keuzerondjes, en conditionele regels — gelijk aan, bevat, is leeg en hun tegenhangers — bepalen welke velden verschijnen op basis van eerdere antwoorden. Eén gedeeld sjabloonschema valideert en rendert sjablonen in zowel de browser als de backend, met een test die de build laat falen als de twee kopieën uit elkaar lopen.',
        },
      },
      {
        heading: { en: 'Search that understands the domain', nl: 'Zoeken dat het domein begrijpt' },
        body: {
          en: 'A custom ranking engine normalises queries, recognises domain concepts and matches partial codes, so officers can find the right code with the words they would actually use.',
          nl: 'Een eigen rankingmodule normaliseert zoekopdrachten, herkent begrippen uit het vakgebied en matcht gedeeltelijke codes, zodat je de juiste code vindt met de woorden die je in de praktijk gebruikt.',
        },
      },
      {
        heading: { en: 'Under the hood', nl: 'Onder de motorkap' },
        body: {
          en: 'React and TypeScript on the front end; Supabase for PostgreSQL, authentication and edge functions. Accounts support passkeys and two-factor authentication, subscriptions run through Stripe, and the app installs as a PWA. An admin area manages templates, field options, conditional rules and code suggestions. An experimental assistant (beta) can draft a template for codes that do not have one yet; drafts stay unsaved until a user explicitly saves them.',
          nl: 'React en TypeScript aan de voorkant; Supabase voor PostgreSQL, authenticatie en edge functions. Accounts ondersteunen passkeys en tweestapsverificatie, abonnementen lopen via Stripe en de app is als PWA te installeren. Een beheeromgeving regelt sjablonen, veldopties, conditionele regels en codesuggesties. Een experimentele assistent (bèta) kan een sjabloon voorstellen voor codes die er nog geen hebben; voorstellen worden pas opgeslagen als een gebruiker dat expliciet doet.',
        },
      },
    ],
  },
  {
    id: 'tod-calculator',
    title: 'TOD Calculator',
    kicker: { en: 'Irregular-hours allowance', nl: 'Toeslagen onregelmatige diensten' },
    summary: {
      en: 'Enter an hourly or monthly wage and see the effective hourly rate for every irregular-hours band, from early mornings to Sundays and holidays.',
      nl: 'Vul een uur- of maandloon in en zie direct het uurloon per toeslagblok, van vroege ochtenden tot zon- en feestdagen.',
    },
    year: '2025',
    role: { en: 'Design & development', nl: 'Ontwerp & ontwikkeling' },
    technologies: ['React', 'TypeScript'],
    links: [{ label: { en: 'Open the tool', nl: 'Open de tool' }, href: '/tools/tod', kind: 'internal' }],
    visual: 'tod',
  },
  {
    id: 'wage-calculator',
    title: 'Shift Wage Calculator',
    kicker: { en: 'Pay from raw shift times', nl: 'Loon uit ruwe diensttijden' },
    summary: {
      en: 'Paste a list of shift times and get the expected pay per shift and in total. Built for my own shifts while working as a delivery driver.',
      nl: 'Plak een lijst met diensttijden en zie het verwachte loon per dienst en in totaal. Gemaakt voor mijn eigen diensten toen ik als bezorger werkte.',
    },
    year: '2025',
    role: { en: 'Design & development', nl: 'Ontwerp & ontwikkeling' },
    technologies: ['React', 'TypeScript', 'Parsing'],
    links: [{ label: { en: 'Open the tool', nl: 'Open de tool' }, href: '/tools/calculator', kind: 'internal' }],
    visual: 'wage',
  },
  {
    id: 'portfolio',
    title: 'This site',
    kicker: { en: 'Open-source portfolio', nl: 'Open-source portfolio' },
    summary: {
      en: 'A morphing WebGL sculpture choreographed by scroll, with real HTML content underneath — fully usable without WebGL or motion.',
      nl: 'Een vervormend WebGL-object dat met het scrollen meebeweegt, met echte HTML-inhoud eronder — volledig bruikbaar zonder WebGL of animatie.',
    },
    year: '2026',
    role: { en: 'Design & development', nl: 'Ontwerp & ontwikkeling' },
    technologies: ['React', 'TypeScript', 'Three.js', 'Vite'],
    links: [
      { label: { en: 'View the source', nl: 'Bekijk de broncode' }, href: PROFILE.siteRepository, kind: 'external' },
    ],
    visual: 'site',
  },
];
