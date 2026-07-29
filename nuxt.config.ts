// https://nuxt.com/docs/api/configuration/nuxt-config

// Dual-mode, mirroring the zettamine site. The GitHub Pages deploy workflow sets
// NUXT_GITHUB_PAGES=true and runs `pnpm generate` → a fully STATIC build served
// under the project sub-path /SankarVema/. Unset (the default) → node-server SSR,
// which is what the Azure fleet runs (served under /sankarvema/ on the guildtrek
// gateway); SSR is required so the chat server routes work and useRequestURL()
// resolves the CRM host from the live request. The deploy injects
// NUXT_APP_BASE_URL at runtime; locally, unset → '/'.
const isPagesBuild = process.env.NUXT_GITHUB_PAGES === 'true'
const appBaseURL = process.env.NUXT_APP_BASE_URL || (isPagesBuild ? '/SankarVema/' : '/')

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

  // NOTE: @nuxt/fonts was removed in favour of a Google Fonts <link> below. It
  // pins esbuild ^0.25.4 while vite/nuxt pull esbuild 0.28.1, and npm's flat
  // install + `npm rebuild` in the container Dockerfile can't reconcile two
  // esbuild versions against one native binary (the fleet's standalone sites,
  // zettamine/gt, load fonts the same way for the same reason). Same fonts.
  modules: ['@nuxt/content', '@nuxtjs/color-mode', '@nuxt/icon'],

  // SVG mode + the lucide collection are bundled (offline) so the chat widget's
  // icons render in the container without an Iconify API round-trip.
  icon: {
    mode: 'svg',
    class: 'inline-block',
  },

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

  // baseURL: '/SankarVema/' for the GitHub project page, '/sankarvema/' on the
  // Azure gateway (injected via NUXT_APP_BASE_URL), '/' locally. A project repo is
  // served under a sub-path, so this must match — otherwise every /_nuxt/* asset
  // 404s and the page is blank.
  app: {
    baseURL: appBaseURL,
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
      // Fonts via Google Fonts CDN (replaces @nuxt/fonts). Same families the
      // theme in assets/css/main.css references: Fraunces (display), Inter
      // (sans), JetBrains Mono (mono). Absolute URLs, so unaffected by baseURL.
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
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

  // GitHub Pages (NUXT_GITHUB_PAGES=true): fully static prerender of the site.
  // Otherwise (Azure/local): node-server SSR (nitro: {}), so the /api/chat routes
  // run and useRequestURL() resolves the CRM host from the live request. `nuxt
  // generate` in the Pages workflow already selects the prerender preset; the
  // explicit route seed + crawlLinks ensures every content page is emitted.
  nitro: isPagesBuild
    ? {
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
            '/intro',
            '/404.html',
          ],
          failOnError: false,
        },
      }
    : {},
})
