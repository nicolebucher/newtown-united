import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://newtownunited.de',
  trailingSlash: 'ignore',
  // Alle Seiten werden statisch gebaut, nur der Editor unter /keystatic läuft auf dem Server.
  adapter: vercel(),
  devToolbar: { enabled: false },
  integrations: [react(), markdoc(), keystatic()],
});
