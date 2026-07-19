// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-15',

  // Opt into the Nuxt 4 directory structure: `app/` becomes the source dir,
  // which is where this project's pages, components and content already live.
  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },

  // CRM base URL for the ask/contact form. Baked at build time from
  // NUXT_PUBLIC_CRM_URL (set in the deploy workflow), e.g. https://digihire.ai/crm.
  // Empty in local dev unless the env var is set.
  // TODO (deferred): resolve this from the config server's `apps.crm` entry
  // instead of a hardcoded env, to match how digihire apps resolve URLs.
  runtimeConfig: {
    public: {
      crmUrl: process.env.NUXT_PUBLIC_CRM_URL || '',
    },
  },

  modules: ['@nuxt/content', '@nuxt/fonts', '@nuxtjs/color-mode'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '', // adds `dark` / `light` class on <html>
    storageKey: 'sv-color-mode',
  },

  css: ['~/assets/css/main.css'],

  // Tailwind CSS v4 via PostCSS (avoids the @tailwindcss/vite plugin being
  // evaluated by jiti when the config is loaded).
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // Served from a GitHub project page (https://xteamjack.github.io/SankarVema/).
  // A project repo is served under the repo-name sub-path, so baseURL must match
  // the repo name — otherwise every /_nuxt/* asset 404s and the page is blank.
  app: {
    baseURL: '/SankarVema/',
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: (title?: string) =>
        title ? `${title} · Sankar Vema` : 'Sankar Vema · AI Builder & Architect',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Sankar Vema — AI Builder & Architect of Agentic Systems. Twenty-plus years building, leading and scaling technology; now focused on agentic architectures, model design and AI product development.',
        },
        { name: 'theme-color', content: '#f5f4f1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Sankar Vema' },
      ],
      // NB: the favicon <link> is set in app.vue, not here — a static href in
      // this config is emitted verbatim and is NOT prefixed with app.baseURL,
      // so on the GitHub Pages project sub-path it would 404. app.vue builds
      // the href from the runtime baseURL instead.
    },
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
      },
    },
  },

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },

  // Static generation for GitHub Pages.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/assignments',
        '/journey',
        '/achievements',
        '/contributions',
        '/advisory',
        '/work',
        '/writing',
        '/contact',
        '/404.html',
      ],
      failOnError: false,
    },
  },

  routeRules: {
    '/**': { prerender: true },
  },
})
