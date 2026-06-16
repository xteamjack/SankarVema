<script setup lang="ts">
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 2 })

const { data: items } = await useAsyncData('recent-writing', () =>
  queryCollection('writing').order('date', 'DESC').all(),
)
const shown = computed(() => (items.value ?? []).slice(0, props.limit))
</script>

<template>
  <div class="not-prose my-8">
    <div class="grid gap-5 md:grid-cols-2">
      <PostCard v-for="item in shown" :key="item.path" :item="item" />
    </div>
    <NuxtLink to="/writing" class="link-underline mt-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
      All writing
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </NuxtLink>
  </div>
</template>
