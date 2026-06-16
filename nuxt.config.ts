// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-06-15',

  // Opt into the Nuxt 4 directory structure: `app/` becomes the source dir,
  // which is where this project's pages, components and content already live.
  future: { compatibilityVersion: 4 },

  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/fonts', '@nuxtjs/color-mode'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
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

  // Served from the root of a GitHub user site (https://sankarvema.github.io/).
  app: {
    baseURL: '/',
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
        { name: 'theme-color', content: '#0a0a0b' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Sankar Vema' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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
