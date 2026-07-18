<script setup lang="ts">
const { data: items } = await useAsyncData('writing-index', () =>
  queryCollection('writing').order('date', 'DESC').all(),
)

const visible = computed(() => (items.value ?? []).filter((i: any) => !i.draft))

useSeoMeta({
  title: 'Writing',
  description:
    'Essays on agentic architecture, enterprise AI adoption, and what shipping AI systems actually looks like.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Writing"
      title="Notes on building AI that ships."
      subtitle="Opinionated, practical writing on agentic systems and enterprise AI, the parts that survive contact with production."
    />

    <div class="wrap py-16">
      <div v-if="visible.length" class="grid gap-6 md:grid-cols-2">
        <PostCard v-for="item in visible" :key="item.path" :item="item" />
      </div>
      <p v-else class="text-[var(--color-fg-muted)]">No essays published yet.</p>
    </div>
  </div>
</template>
