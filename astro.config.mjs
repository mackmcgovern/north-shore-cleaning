import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

import netlify from '@astrojs/netlify'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://subtle-chaja-1061b2.netlify.app/',
  integrations: [tailwind(), sitemap()],
  adapter: netlify(),
})
