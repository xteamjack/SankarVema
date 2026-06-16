<script setup lang="ts">
const { data: doc } = await useAsyncData('contributions', () =>
  queryCollection('contributions').first(),
)
const intro = computed(() => (doc.value as any)?.intro as string | undefined)
const items = computed<any[]>(() => (doc.value as any)?.items ?? [])

useSeoMeta({
  title: 'Contributions',
  description:
    'Open-source and community contributions — from Razor & Hanlon (core to Puppet provisioning) and early Android SDK work to modern AI ecosystem contributions.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Open Source & Community"
      title="Open source over patents."
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
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <component
          :is="c.link ? 'a' : 'div'"
          v-for="c in items"
          :key="c.title"
          :href="c.link || undefined"
          :target="c.link && c.link.startsWith('http') ? '_blank' : undefined"
          rel="noopener"
          class="card flex flex-col p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-[family-name:var(--font-display)] text-lg leading-snug tracking-tight text-[var(--color-fg)]">{{ c.title }}</h2>
            <span v-if="c.era" class="tag shrink-0">{{ c.era }}</span>
          </div>
          <div v-if="c.role" class="mt-1 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-[var(--color-accent)]">{{ c.role }}</div>
          <p v-if="c.note" class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]" v-html="c.note" />
          <span v-if="c.link" class="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-fg)]">
            View
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </component>
      </div>

      <div class="mt-14 flex flex-wrap gap-3 border-t border-[var(--color-hair)] pt-10">
        <NuxtLink to="/writing" class="btn btn-ghost">Read my writing</NuxtLink>
        <NuxtLink to="/contact" class="btn btn-primary">Work with me</NuxtLink>
      </div>
    </div>
  </div>
</template>
