// packages
import { defineConfig } from 'astro/config';

const site = process.env.PORTFOLIO_SITE ?? 'https://jorius.github.io';
const base = process.env.PORTFOLIO_BASE ?? '/portfolio-web-app-ciruela';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
