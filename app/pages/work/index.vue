<script setup lang="ts">
const { data: items } = await useAsyncData('work-index', () =>
  queryCollection('work').order('year', 'DESC').all(),
)

useSeoMeta({
  title: 'Work',
  description:
    'Selected case studies, shipped AI systems: real-time audio-video human-interaction agents, an end-to-end AI recruitment platform, and an enterprise digital twin.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Selected Work"
      title="Systems I designed and shipped."
      subtitle="Case studies from the last few years of building AI products: the architecture, the decisions, and what each one traded."
    />

    <div class="wrap py-16">
      <div v-if="items?.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WorkCard v-for="item in items" :key="item.path" :item="item" />
      </div>
      <p v-else class="text-[var(--color-fg-muted)]">No case studies published yet.</p>
    </div>
  </div>
</template>
