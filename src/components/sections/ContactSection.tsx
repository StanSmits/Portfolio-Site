import { useRef } from 'react';
import { ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PROFILE } from '../../content/profile';
import { useReveal } from '../../hooks/useReveal';
import { ContactForm } from '../contact/ContactForm';
import { SceneAnchor } from '../scene/SceneAnchor';

export function ContactSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="section pb-[calc(var(--section-y)*0.75)]">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 flex flex-col lg:col-span-5">
          <div data-reveal>
            <p className="label flex items-center gap-3">
              <span className="font-mono tracking-normal text-ink">04</span>
              <span className="h-px w-8 bg-line/40" aria-hidden="true" />
              {t('contact.label')}
            </p>
            <h2 id="contact-title" className="h2 mt-6">
              {t('contact.title')}
            </h2>
            <p className="lead mt-6">{t('contact.intro')}</p>
          </div>

          <ul className="mt-10 space-y-3" data-reveal>
            <li>
              <a
                href={`mailto:${PROFILE.email}`}
                className="group flex min-h-[3rem] items-center gap-4 border-b border-line/15 py-3 text-lg font-medium sm:text-xl"
              >
                <Mail className="h-5 w-5 shrink-0 text-subtle" strokeWidth={1.6} aria-hidden="true" />
                <span className="sr-only">{t('contact.emailLabel')}: </span>
                <span className="link-line break-all">{PROFILE.email}</span>
              </a>
            </li>
            <li>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[3rem] items-center gap-4 border-b border-line/15 py-3 text-lg font-medium sm:text-xl"
              >
                <Linkedin className="h-5 w-5 shrink-0 text-subtle" strokeWidth={1.6} aria-hidden="true" />
                <span className="link-line">{t('contact.linkedinLabel')}</span>
                <span className="sr-only"> ({t('work.openExternal')})</span>
                <ArrowUpRight
                  className="ml-auto h-4 w-4 text-subtle transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>

          {/* Resting place of the calm form at the end of the journey. */}
          <SceneAnchor className="mt-10 hidden h-[32svh] lg:block" />
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7" data-reveal>
          <ContactForm />
          <p className="mt-4 text-sm text-muted">
            {t('contact.form.fallback')}{' '}
            <a href={`mailto:${PROFILE.email}`} className="font-medium text-ink underline underline-offset-4">
              {PROFILE.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
