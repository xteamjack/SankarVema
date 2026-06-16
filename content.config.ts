import { fileURLToPath } from 'node:url'
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// The content lives in `app/content` (alongside the rest of the Nuxt 4 srcDir),
// so every collection reads from there explicitly.
const cwd = fileURLToPath(new URL('./app/content', import.meta.url))

const contact = z
  .object({
    email: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    blog: z.string().optional(),
    twitter: z.string().optional(),
  })
  .optional()

export default defineContentConfig({
  collections: {
    // Home hero (home/hero.md)
    home: defineCollection({
      type: 'page',
      source: { include: 'home/**', cwd },
      schema: z.object({
        role: z.string().optional(),
        tagline: z.string().optional(),
        location: z.string().optional(),
        contact,
        headline: z.string().optional(),
        intro: z.string().optional(),
        metrics: z
          .array(z.object({ value: z.string(), label: z.string() }))
          .optional(),
        capabilities: z
          .array(
            z.object({
              title: z.string(),
              tagline: z.string().optional(),
              body: z.string().optional(),
              link: z.string().optional(),
              cta: z.string().optional(),
            }),
          )
          .optional(),
      }),
    }),

    // Awards & recognition (achievements.yml)
    achievements: defineCollection({
      type: 'data',
      source: { include: 'achievements.yml', cwd },
      schema: z.object({
        intro: z.string().optional(),
        items: z.array(
          z.object({
            year: z.union([z.number(), z.string()]).optional(),
            title: z.string(),
            org: z.string().optional(),
            note: z.string().optional(),
          }),
        ),
      }),
    }),

    // Open-source & community contributions (contributions.yml)
    contributions: defineCollection({
      type: 'data',
      source: { include: 'contributions.yml', cwd },
      schema: z.object({
        intro: z.string().optional(),
        items: z.array(
          z.object({
            title: z.string(),
            role: z.string().optional(),
            era: z.string().optional(),
            note: z.string().optional(),
            link: z.string().optional(),
          }),
        ),
      }),
    }),

    // Long-form standalone pages at the content root (advisory.md, …)
    pages: defineCollection({
      type: 'page',
      source: { include: '*.md', cwd },
      schema: z.object({
        subtitle: z.string().optional(),
      }),
    }),

    // About page narrative (about/principles.md)
    about: defineCollection({
      type: 'page',
      source: { include: 'about/*.md', cwd },
      schema: z.object({
        subtitle: z.string().optional(),
      }),
    }),

    // Career timeline (about/timeline.yml)
    timeline: defineCollection({
      type: 'data',
      source: { include: 'about/timeline.yml', cwd },
      schema: z.object({
        entries: z.array(
          z.object({
            year: z.union([z.number(), z.string()]),
            role: z.string(),
            company: z.string(),
            note: z.string().optional(),
          }),
        ),
      }),
    }),

    // Case studies (work/*.md)
    work: defineCollection({
      type: 'page',
      source: { include: 'work/**', cwd },
      schema: z.object({
        slug: z.string().optional(),
        role: z.string().optional(),
        year: z.union([z.number(), z.string()]).optional(),
        status: z.string().optional(),
        stack: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        hero: z.string().optional(),
        draft: z.boolean().optional(),
      }),
    }),

    // Essays / writing (writing/*.md)
    writing: defineCollection({
      type: 'page',
      source: { include: 'writing/**', cwd },
      schema: z.object({
        slug: z.string().optional(),
        date: z.union([z.string(), z.date()]).optional(),
        tags: z.array(z.string()).optional(),
        excerpt: z.string().optional(),
        status: z.string().optional(),
        draft: z.boolean().optional(),
      }),
    }),
  },
})
