/**
 * Cloudflare Pages Function for POST /api/contact.
 * Configure RESEND_API_KEY, CONTACT_FROM_EMAIL (and optionally CONTACT_TO_EMAIL,
 * CONTACT_ALLOWED_ORIGINS) as environment variables/secrets on the Pages project.
 */
import { handleContactRequest, type ContactEnv } from '../../server/contact.ts';

interface PagesContext {
  request: Request;
  env: ContactEnv;
}

export const onRequest = (context: PagesContext): Promise<Response> =>
  handleContactRequest(context.request, { env: context.env });
