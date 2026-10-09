import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Serves the serverless contact handler (api/contact.ts) from the dev and preview servers,
 * so the form can be exercised locally. Set CONTACT_DRY_RUN=1 in .env.local to validate
 * without sending email; otherwise RESEND_API_KEY and CONTACT_FROM_EMAIL are required.
 */
function contactApi(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '');
  const handle = async (
    load: () => Promise<typeof import('./api/contact')>,
    req: IncomingMessage,
    res: ServerResponse
  ) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(key, value);
    }
    const request = new Request(`http://${req.headers.host ?? 'localhost'}${req.url}`, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
    });
    const { handleContactRequest } = await load();
    const response = await handleContactRequest(request, { env, dryRun: env.CONTACT_DRY_RUN === '1' });
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };

  return {
    name: 'contact-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/contact', (req, res) => {
        void handle(() => server.ssrLoadModule('/api/contact.ts') as Promise<typeof import('./api/contact')>, req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), contactApi(mode)],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
}));
