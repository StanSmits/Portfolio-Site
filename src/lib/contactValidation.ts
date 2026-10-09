/**
 * Contact form validation shared by the browser and the serverless handler,
 * so both sides enforce exactly the same rules. Keep this file dependency-free.
 */

export const CONTACT_LIMITS = {
  name: { max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

export type ContactField = 'name' | 'email' | 'message';
export type ContactErrorCode = 'required' | 'emailInvalid' | 'messageShort' | 'tooLong';

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

// Pragmatic address check: one @, no spaces, a dot in the domain.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, collapse control characters and normalise line endings. */
export function normaliseContactInput(raw: Partial<Record<ContactField, unknown>>): ContactInput {
  const clean = (value: unknown, multiline: boolean) => {
    if (typeof value !== 'string') return '';
    const text = value.replace(/\r\n?/g, '\n');
    // Strip control characters except newline (and tab in multiline text).
    const stripped = multiline
      ? // eslint-disable-next-line no-control-regex
        text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      : // eslint-disable-next-line no-control-regex
        text.replace(/[\u0000-\u001F\u007F]/g, ' ');
    return stripped.trim();
  };
  return {
    name: clean(raw.name, false),
    email: clean(raw.email, false).toLowerCase(),
    message: clean(raw.message, true),
  };
}

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  if (!input.name) errors.name = 'required';
  else if (input.name.length > CONTACT_LIMITS.name.max) errors.name = 'tooLong';

  if (!input.email) errors.email = 'required';
  else if (input.email.length > CONTACT_LIMITS.email.max) errors.email = 'tooLong';
  else if (!EMAIL_PATTERN.test(input.email)) errors.email = 'emailInvalid';

  if (!input.message) errors.message = 'required';
  else if (input.message.length < CONTACT_LIMITS.message.min) errors.message = 'messageShort';
  else if (input.message.length > CONTACT_LIMITS.message.max) errors.message = 'tooLong';

  return errors;
}
