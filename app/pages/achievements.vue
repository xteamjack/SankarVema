<script setup lang="ts">
const { data: doc } = await useAsyncData('achievements', () =>
  queryCollection('achievements').first(),
)
const intro = computed(() => (doc.value as any)?.intro as string | undefined)
const items = computed<any[]>(() => (doc.value as any)?.items ?? [])

useSeoMeta({
  title: 'Achievements',
  description:
    'Awards and recognition across three decades, from national honours to Distinguished Engineer at DXC and the trust of Fortune 500 leadership.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Awards & Recognition"
      title="Recognized where it counts."
      :subtitle="intro"
    >
      <template #meta>
        <NuxtLink to="/contact" class="btn btn-primary mt-8 !py-2 !text-sm rise" style="animation-delay: 160ms">
          Book an advisory call
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </template>
    </PageHero>

    <div class="wrap py-16">
      <div class="grid gap-5 md:grid-cols-2">
        <div v-for="a in items" :key="a.title" class="card flex flex-col p-6">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-hair-strong)] bg-[var(--color-ink-800)] text-[var(--color-accent)]">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5" /><path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5" /></svg>
            </span>
            <div>
              <div class="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">{{ a.year }}</div>
              <h2 class="font-[family-name:var(--font-display)] text-lg leading-snug tracking-tight text-[var(--color-fg)]">{{ a.title }}</h2>
            </div>
          </div>
          <div v-if="a.org" class="mt-3 text-sm font-medium text-[var(--color-fg)]">{{ a.org }}</div>
          <p v-if="a.note" class="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]" v-html="a.note" />
        </div>
      </div>

      <div class="mt-14 flex flex-wrap gap-3 border-t border-[var(--color-hair)] pt-10">
        <NuxtLink to="/work" class="btn btn-ghost">See the work behind the awards</NuxtLink>
        <NuxtLink to="/contact" class="btn btn-primary">Engage me</NuxtLink>
      </div>
    </div>
  </div>
</template>
