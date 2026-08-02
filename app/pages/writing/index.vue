<script setup lang="ts">
const { data: items } = await useAsyncData('writing-index', () =>
  queryCollection('writing').order('date', 'DESC').all(),
)

// Only published essays are listed. Drafts (draft: true) stay hidden until they
// are flipped to draft: false.
const visible = computed(() => (items.value ?? []).filter((i: any) => !i.draft))

// Unique tags with counts, most-used first, then alphabetical.
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const it of visible.value as any[]) {
    for (const t of (it.tags ?? [])) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const selected = ref<string | null>(null)

const filtered = computed(() => {
  if (!selected.value) return visible.value as any[]
  return (visible.value as any[]).filter((i) => (i.tags ?? []).includes(selected.value))
})

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
      <!-- Filter bar: count on the left, tag filters at the top-right -->
      <div v-if="visible.length" class="mb-9 flex flex-col gap-4 border-b border-[var(--color-hair)] pb-6 sm:flex-row sm:items-center">
        <!-- Count indicator (left) -->
        <div class="flex shrink-0 items-baseline gap-1.5">
          <span class="font-[family-name:var(--font-display)] text-3xl leading-none text-[var(--color-fg)]">{{ filtered.length }}</span>
          <span class="text-sm text-[var(--color-fg-muted)]">{{ filtered.length === 1 ? 'essay' : 'essays' }}</span>
          <span v-if="selected" class="text-sm text-[var(--color-fg-faint)]">tagged “{{ selected }}”</span>
        </div>

        <!-- Tag filters (top) -->
        <div class="flex flex-wrap gap-2 sm:ml-auto sm:justify-end">
          <button
            type="button"
            class="tag cursor-pointer transition-colors"
            :class="!selected
              ? '!border-[color:color-mix(in_oklab,var(--color-accent)_45%,transparent)] !text-[var(--color-accent)]'
              : 'hover:!text-[var(--color-fg)]'"
            @click="selected = null"
          >All <span class="ml-1 opacity-60">{{ visible.length }}</span></button>
          <button
            v-for="t in tags"
            :key="t.name"
            type="button"
            class="tag cursor-pointer transition-colors"
            :class="selected === t.name
              ? '!border-[color:color-mix(in_oklab,var(--color-accent)_45%,transparent)] !text-[var(--color-accent)]'
              : 'hover:!text-[var(--color-fg)]'"
            @click="selected = selected === t.name ? null : t.name"
          >{{ t.name }} <span class="ml-1 opacity-60">{{ t.count }}</span></button>
        </div>
      </div>

      <!-- Grid -->
      <div v-if="filtered.length" class="grid gap-6 md:grid-cols-2">
        <PostCard v-for="item in filtered" :key="item.path" :item="item" />
      </div>
      <p v-else-if="visible.length" class="text-[var(--color-fg-muted)]">No essays under this tag yet.</p>
      <p v-else class="text-[var(--color-fg-muted)]">No essays published yet.</p>
    </div>
  </div>
</template>
