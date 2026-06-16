<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <header class="relative overflow-hidden border-b border-[var(--color-hair)]">
    <div class="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
    <div class="wrap pt-16 pb-12 md:pt-24 md:pb-16">
      <p v-if="eyebrow" class="eyebrow rise">{{ eyebrow }}</p>
      <h1
        class="rise mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-6xl"
        style="animation-delay: 60ms"
        v-html="title"
      />
      <p
        v-if="subtitle"
        class="rise mt-5 max-w-2xl text-lg text-[var(--color-fg-muted)]"
        style="animation-delay: 120ms"
        v-html="subtitle"
      />
      <slot name="meta" />
    </div>
  </header>
</template>
