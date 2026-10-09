import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PROFILE } from '../../content/profile';
import { useLang } from '../../i18n/useLang';
import {
  CONTACT_LIMITS,
  normaliseContactInput,
  validateContact,
  type ContactErrors,
  type ContactField,
} from '../../lib/contactValidation';

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; reason: 'failed' | 'notConfigured' | 'rateLimited' };

const FIELDS: ContactField[] = ['name', 'email', 'message'];
const ENDPOINT = '/api/contact';

export function ContactForm() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const id = useId();
  const [values, setValues] = useState({ name: '', email: '', message: '', company: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });
  const startedAt = useRef(Date.now());
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };
  const successRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.kind === 'success') successRef.current?.focus();
    if (state.kind === 'error') statusRef.current?.focus();
  }, [state.kind]);

  const fieldId = (field: string) => `${id}-${field}`;
  const errorId = (field: string) => `${id}-${field}-error`;

  const update = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as it becomes valid again.
    if (field !== 'company' && errors[field]) {
      const next = validateContact(normaliseContactInput({ ...values, [field]: value }));
      setErrors((current) => ({ ...current, [field]: next[field] }));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === 'submitting') return;
    const input = normaliseContactInput(values);
    const found = validateContact(input);
    setErrors(found);
    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setState({ kind: 'submitting' });
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...input,
          company: values.company,
          elapsedMs: Date.now() - startedAt.current,
          lang,
        }),
      });
      if (response.ok) {
        const body = (await response.json().catch(() => null)) as { ok?: boolean } | null;
        if (body?.ok) {
          setState({ kind: 'success' });
          setValues({ name: '', email: '', message: '', company: '' });
          return;
        }
        setState({ kind: 'error', reason: 'failed' });
        return;
      }
      if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as { errors?: ContactErrors } | null;
        if (body?.errors && Object.keys(body.errors).length) {
          setErrors(body.errors);
          setState({ kind: 'idle' });
          const first = FIELDS.find((field) => body.errors?.[field]);
          if (first) refs[first].current?.focus();
          return;
        }
      }
      if (response.status === 429) return setState({ kind: 'error', reason: 'rateLimited' });
      if (response.status === 503) return setState({ kind: 'error', reason: 'notConfigured' });
      setState({ kind: 'error', reason: 'failed' });
    } catch {
      setState({ kind: 'error', reason: 'failed' });
    }
  };

  if (state.kind === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="panel flex min-h-[24rem] flex-col justify-center p-8 outline-none sm:p-10"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-bg" aria-hidden="true">
          <Check className="h-5 w-5" />
        </span>
        <h3 className="h3 mt-6">{t('contact.form.successTitle')}</h3>
        <p className="mt-3 text-muted">{t('contact.form.successBody')}</p>
        <button
          type="button"
          className="btn btn-ghost mt-8 self-start"
          onClick={() => {
            startedAt.current = Date.now();
            setState({ kind: 'idle' });
          }}
        >
          {t('contact.form.another')}
        </button>
      </div>
    );
  }

  const submitting = state.kind === 'submitting';
  const hasErrors = FIELDS.some((field) => errors[field]);
  const messageLength = values.message.length;

  return (
    <form noValidate onSubmit={onSubmit} className="panel p-6 sm:p-10" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="font-display text-xl font-semibold tracking-tight">
        {t('contact.form.title')}
      </h3>

      {hasErrors && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {t('contact.form.errorSummary')}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {(['name', 'email'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={fieldId(field)} className="mb-2 block text-sm font-medium">
              {t(`contact.form.${field}`)}
            </label>
            <input
              ref={refs[field]}
              id={fieldId(field)}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              inputMode={field === 'email' ? 'email' : undefined}
              autoComplete={field === 'email' ? 'email' : 'name'}
              autoCapitalize={field === 'email' ? 'none' : 'words'}
              spellCheck={field !== 'email'}
              maxLength={CONTACT_LIMITS[field].max}
              required
              aria-invalid={errors[field] ? true : undefined}
              aria-describedby={errors[field] ? errorId(field) : undefined}
              value={values[field]}
              onChange={(event) => update(field, event.target.value)}
              className="field"
              disabled={submitting}
            />
            {errors[field] && (
              <p id={errorId(field)} className="mt-2 text-sm text-danger">
                {t(`contact.form.${errors[field]}`)}
              </p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor={fieldId('message')} className="block text-sm font-medium">
              {t('contact.form.message')}
            </label>
            <span className="font-mono text-xs text-subtle" aria-hidden="true">
              {messageLength}/{CONTACT_LIMITS.message.max}
            </span>
          </div>
          <textarea
            ref={refs.message}
            id={fieldId('message')}
            name="message"
            rows={6}
            maxLength={CONTACT_LIMITS.message.max}
            required
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? errorId('message') : undefined}
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            className="field min-h-[9rem] resize-y"
            disabled={submitting}
          />
          {errors.message && (
            <p id={errorId('message')} className="mt-2 text-sm text-danger">
              {t(`contact.form.${errors.message}`)}
            </p>
          )}
        </div>

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={fieldId('company')}>Company</label>
          <input
            id={fieldId('company')}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => update('company', event.target.value)}
          />
        </div>
      </div>

      {state.kind === 'error' && (
        <p ref={statusRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm outline-none">
          {t(`contact.form.${state.reason}`)}{' '}
          <a className="font-semibold underline underline-offset-4" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">{t('contact.form.privacy')}</p>
        <button type="submit" className="btn btn-primary shrink-0" disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('contact.form.sending')}
            </>
          ) : (
            <>
              {t('contact.form.send')}
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? t('contact.form.sending') : ''}
      </p>
    </form>
  );
}
