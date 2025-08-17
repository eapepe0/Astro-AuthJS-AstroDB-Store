// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import auth from 'auth-astro';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [auth(), tailwind()],
  output : "server"
});