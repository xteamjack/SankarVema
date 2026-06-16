# Sankar Vema — Personal Portfolio

A statically-generated personal portfolio built with **Nuxt** + **Nuxt Content**,
designed for hosting on **GitHub Pages**. All page copy lives as Markdown/YAML in
[`app/content/`](app/content/) — edit the content, not the components.

## Stack

- [Nuxt 4](https://nuxt.com) (static site generation via `nuxt generate`)
- [Nuxt Content v3](https://content.nuxt.com) — Markdown/MDC + YAML content collections
- [Tailwind CSS v4](https://tailwindcss.com) (via the `@tailwindcss/vite` plugin)
- [@nuxt/fonts](https://github.com/nuxt/fonts) — self-hosted Google fonts (Fraunces, Inter, JetBrains Mono)

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build (static)

```bash
npm run generate     # outputs to .output/public
npm run preview      # serve the generated site locally
```

## Content model

Everything renders from `app/content/`:

| Path                         | Collection | Renders on            |
| ---------------------------- | ---------- | --------------------- |
| `home/hero.md`               | `home`     | `/` (home)            |
| `about/principles.md`        | `about`    | `/about`              |
| `about/timeline.yml`         | `timeline` | `/about` (career rail)|
| `advisory.md`                | `pages`    | `/advisory`           |
| `work/*.md`                  | `work`     | `/work`, `/work/:slug`|
| `writing/*.md`               | `writing`  | `/writing`, `/writing/:slug` |

Collections + front-matter schemas are defined in [`content.config.ts`](content.config.ts).

### Custom MDC components (usable inside Markdown)

- `::lens-cards` — the three-up "What I do" cards (takes a `cards:` prop block)
- `::recent-work` — auto-lists the latest case studies
- `::recent-writing` — auto-lists the latest essays

### Drafts

Work/writing front-matter supports `draft: true` and `status:`. Today the renderer
shows all entries (the seeded content is placeholder). To hide drafts from the
public site, add a `.where('draft', '<>', true)` filter to the relevant
`queryCollection(...)` calls in the index/listing pages.

## Deploying to GitHub Pages

This is configured for a **user site** served at the domain root
(`https://<user>.github.io/`), so `app.baseURL` is `/`.

1. Create a repo named **`<your-username>.github.io`** and push this project to it.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs
   `npm run generate` and publishes `.output/public`.

> **Project repo instead of a user site?** If you host at
> `https://<user>.github.io/<repo>/`, set the base URL to `/<repo>/`:
> change `app.baseURL` in [`nuxt.config.ts`](nuxt.config.ts) and the
> `NUXT_APP_BASE_URL` env in the deploy workflow.

`public/.nojekyll` is included so GitHub Pages serves Nuxt's `_nuxt/` assets
directory correctly.
