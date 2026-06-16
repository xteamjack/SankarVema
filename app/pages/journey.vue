<script setup lang="ts">
const { data: timeline } = await useAsyncData('journey-timeline', () =>
  queryCollection('timeline').first(),
)
const entries = computed<any[]>(() => {
  const list = (timeline.value as any)?.entries ?? []
  return [...list].reverse() // most recent first
})

useSeoMeta({
  title: 'My Journey',
  description:
    'Three decades from single contributor to AI architect — the full trajectory across enterprise scale, government digital transformation, and shipped AI products.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="My Journey"
      title="From contributor to architect — the long version."
      subtitle="Twenty-plus years across enterprise scale, government transformation, and now AI. The leadership years are ballast; the building is the identity."
    >
      <template #meta>
        <div class="rise mt-8 flex flex-wrap gap-3" style="animation-delay: 160ms">
          <NuxtLink to="/about" class="btn btn-ghost !py-2 !text-sm">How I think</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-primary !py-2 !text-sm">Book an advisory call</NuxtLink>
        </div>
      </template>
    </PageHero>

    <div class="wrap py-16">
      <ol class="relative mx-auto max-w-3xl border-l border-[var(--color-hair)]">
        <li v-for="(e, i) in entries" :key="`${e.year}-${e.company}`" class="relative mb-10 pl-8">
          <span class="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-ink-900)]" />
          <div class="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">{{ e.year }}</div>
          <h2 class="mt-1 font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-fg)]">
            {{ e.role }}
          </h2>
          <div class="text-[var(--color-fg-muted)]">{{ e.company }}</div>
          <p v-if="e.note" class="mt-2 max-w-2xl leading-relaxed text-[var(--color-fg-muted)]" v-html="e.note" />
        </li>
      </ol>

      <div class="mx-auto mt-12 max-w-3xl border-t border-[var(--color-hair)] pt-10">
        <p class="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)]">
          The next chapter is advisory.
        </p>
        <p class="mt-3 max-w-xl text-[var(--color-fg-muted)]">
          I now spend my time helping leadership teams build AI that ships — and mentoring the founders building on top of it.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn btn-primary">
            Start a conversation
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </NuxtLink>
          <NuxtLink to="/work" class="btn btn-ghost">See what I've shipped</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
