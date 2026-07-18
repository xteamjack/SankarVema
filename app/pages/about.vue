<script setup lang="ts">
const { data: doc } = await useAsyncData('about', () =>
  queryCollection('about').path('/about/principles').first(),
)
const { data: timeline } = await useAsyncData('timeline', () =>
  queryCollection('timeline').first(),
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'About content not found', fatal: true })
}

const entries = computed<any[]>(() => (timeline.value as any)?.entries ?? [])

useSeoMeta({
  title: () => (doc.value?.title as string) ?? 'About',
  description:
    'From a single contributor in 1998 to AI builder and architect today, and how I think about technology, leadership and AI.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="About"
      :title="(doc as any)?.title"
      :subtitle="(doc as any)?.subtitle"
    />

    <div class="wrap grid gap-16 py-16 lg:grid-cols-[1fr_18rem]">
      <article class="prose-editorial">
        <ContentRenderer :value="doc" />
      </article>

      <!-- Career timeline rail -->
      <aside v-if="entries.length" class="lg:sticky lg:top-24 lg:self-start">
        <p class="eyebrow mb-6">Trajectory</p>
        <ol class="relative border-l border-[var(--color-hair)]">
          <li v-for="e in entries" :key="`${e.year}-${e.company}`" class="relative mb-7 pl-6">
            <span class="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-ink-900)]" />
            <div class="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">{{ e.year }}</div>
            <div class="mt-0.5 text-sm font-medium text-[var(--color-fg)]">{{ e.role }}</div>
            <div class="text-sm text-[var(--color-fg-muted)]">{{ e.company }}</div>
          </li>
        </ol>
      </aside>
    </div>
  </div>
</template>
