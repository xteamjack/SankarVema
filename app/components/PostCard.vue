<script setup lang="ts">
const props = defineProps<{ item: any }>()

const dateLabel = computed(() => {
  const d = props.item?.date
  if (!d) return null
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
})
</script>

<template>
  <NuxtLink :to="item.path" class="card group flex flex-col p-6">
    <div class="mb-3 flex items-center gap-3 text-xs text-[var(--color-fg-faint)]">
      <time v-if="dateLabel" class="font-[family-name:var(--font-mono)]">{{ dateLabel }}</time>
      <span
        v-if="item.status"
        class="font-[family-name:var(--font-mono)] uppercase tracking-wider text-[var(--color-warm)]"
      >{{ item.status }}</span>
    </div>

    <h3
      class="font-[family-name:var(--font-display)] text-xl leading-snug tracking-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent-soft)]"
      v-html="item.title"
    />
    <p v-if="item.excerpt" class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]" v-html="item.excerpt" />

    <div v-if="item.tags?.length" class="mt-5 flex flex-wrap gap-1.5">
      <span v-for="t in item.tags" :key="t" class="tag">#{{ t }}</span>
    </div>
  </NuxtLink>
</template>
