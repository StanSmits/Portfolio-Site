import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../content/types';
import { useLang } from '../../i18n/useLang';
import { ProjectLinkButton } from './ProjectLinkButton';

export interface ProjectDialogHandle {
  open: (opener?: HTMLElement | null) => void;
}

/** Case-study dialog built on the native <dialog> element (focus containment and Escape for free). */
export const ProjectDialog = forwardRef<ProjectDialogHandle, { project: Project }>(function ProjectDialog(
  { project },
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const { t } = useTranslation();
  const { pick } = useLang();
  const titleId = `${project.id}-dialog-title`;

  useImperativeHandle(ref, () => ({
    open: (opener) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      openerRef.current = opener ?? (document.activeElement as HTMLElement | null);
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    },
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = '';
      openerRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby={titleId}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself, outside its content) closes it.
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      <div className="relative">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line/10 bg-bg-elevated/95 px-6 py-3 sm:px-10">
          <span className="label">{t('work.featured')}</span>
          <form method="dialog">
            <button type="submit" className="icon-btn -mr-2" aria-label={t('work.close')}>
              <X className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            </button>
          </form>
        </div>
        <div className="px-6 pb-10 pt-8 sm:px-10">
          <h2 id={titleId} className="h2 !text-[clamp(2.25rem,6vw,4rem)]">
            {project.title}
          </h2>
          <p className="lead mt-4 max-w-[52ch]">{pick(project.summary)}</p>

          <dl className="mt-8 grid gap-6 border-y border-line/10 py-6 sm:grid-cols-3">
            <div>
              <dt className="label">{t('work.role')}</dt>
              <dd className="mt-1 text-sm">{pick(project.role)}</dd>
            </div>
            <div>
              <dt className="label">{t('work.year')}</dt>
              <dd className="mt-1 text-sm">{project.year}</dd>
            </div>
            <div>
              <dt className="label">{t('work.stack')}</dt>
              <dd className="mt-1 text-sm">{project.technologies.join(', ')}</dd>
            </div>
          </dl>

          <div className="mt-10 space-y-9">
            {project.details?.map((section, index) => (
              <section key={index} className="grid gap-3 sm:grid-cols-12">
                <h3 className="font-display text-lg font-semibold tracking-tight sm:col-span-4">
                  <span className="label mr-3 inline-block w-6">0{index + 1}</span>
                  {pick(section.heading)}
                </h3>
                <p className="text-muted sm:col-span-8">{pick(section.body)}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <ProjectLinkButton key={link.href} link={link} className="btn btn-primary" />
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
});
