<script setup lang="ts">
const route = useRoute()
const path = `/work/${route.params.slug}`

const { data: doc } = await useAsyncData(`work-${route.params.slug}`, () =>
  queryCollection('work').path(path).first(),
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
}

const d = computed<any>(() => doc.value as any)
const stack = computed<string[]>(() => d.value?.stack ?? [])

useSeoMeta({
  title: () => stripHtml(d.value?.title) || 'Work',
  description: () => stripHtml(d.value?.hero) || undefined,
})

function stripHtml(s?: string) {
  return (s ?? '').replace(/<[^>]*>/g, '')
}
</script>

<template>
  <article>
    <PageHero eyebrow="Case Study" :title="d?.title">
      <template #meta>
        <p v-if="d?.hero" class="rise mt-6 max-w-2xl text-lg text-[var(--color-fg-muted)]" style="animation-delay: 120ms" v-html="d.hero" />

        <dl class="rise mt-8 flex flex-wrap gap-x-10 gap-y-4 text-sm" style="animation-delay: 160ms">
          <div v-if="d?.role">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Role</dt>
            <dd class="mt-1 text-[var(--color-fg)]">{{ d.role }}</dd>
          </div>
          <div v-if="d?.context">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Context</dt>
            <dd class="mt-1 text-[var(--color-fg)]">{{ d.context }}</dd>
          </div>
          <div v-if="d?.scale">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Scale</dt>
            <dd class="mt-1 text-[var(--color-fg)]">{{ d.scale }}</dd>
          </div>
          <div v-if="d?.year">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Year</dt>
            <dd class="mt-1 text-[var(--color-fg)]">{{ d.year }}</dd>
          </div>
          <div v-if="d?.status">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Status</dt>
            <dd class="mt-1 inline-flex items-center gap-1.5 text-[var(--color-accent)]">
              <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />{{ d.status }}
            </dd>
          </div>
          <div v-if="d?.impact">
            <dt class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">Impact</dt>
            <dd class="mt-1 text-[var(--color-fg)]">{{ d.impact }}</dd>
          </div>
        </dl>

        <div v-if="stack.length" class="rise mt-6 flex flex-wrap gap-1.5" style="animation-delay: 200ms">
          <span v-for="s in stack" :key="s" class="tag">{{ s }}</span>
        </div>
      </template>
    </PageHero>

    <div class="wrap py-16">
      <div class="prose-editorial">
        <ContentRenderer :value="doc" />
      </div>

      <!-- Talk-to-me CTA: carries the case study slug so the enquiry lands with context -->
      <div class="card relative mt-14 overflow-hidden p-8 sm:p-10">
        <div
          class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60"
          style="background: radial-gradient(circle, color-mix(in oklab, var(--color-accent) 26%, transparent), transparent 70%);"
          aria-hidden="true"
        />
        <h2 class="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)] sm:text-3xl">
          Have a similar challenge?
        </h2>
        <p class="mt-3 max-w-xl text-[var(--color-fg-muted)]">
          If this maps to something you're wrestling with, let's talk it through.
        </p>
        <NuxtLink :to="`/contact?ref=${route.params.slug}`" class="btn btn-primary mt-6">
          Let's discuss
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>

      <div class="mt-14 border-t border-[var(--color-hair)] pt-8">
        <NuxtLink to="/work" class="link-underline inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          All work
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
