// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

import auth from 'auth-astro';

import tailwind from '@astrojs/tailwind';

import db from '@astrojs/db';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [auth(), tailwind(), db(), react()],
  output : "server",
});