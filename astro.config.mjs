// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import auth from 'auth-astro';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [auth(), tailwind(), db()],
  output : "server"
});