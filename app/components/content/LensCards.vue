<script setup lang="ts">
import { NuxtLink } from '#components'

interface LensCard {
  title: string
  tagline?: string
  body?: string
  link?: string
  cta?: string
}
const props = defineProps<{ cards?: LensCard[] }>()
const cards = computed(() => props.cards ?? [])
</script>

<template>
  <div class="not-prose my-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <component
      :is="card.link ? NuxtLink : 'div'"
      v-for="(card, i) in cards"
      :key="card.title"
      :to="card.link"
      class="card group flex flex-col p-6"
      :style="{ animationDelay: `${i * 90}ms` }"
    >
      <div class="mb-4 flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-hair-strong)] bg-[var(--color-ink-800)] text-sm font-[family-name:var(--font-mono)] text-[var(--color-accent)]">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <h3 class="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-fg)]">
          {{ card.title }}
        </h3>
      </div>

      <p v-if="card.tagline" class="mb-3 text-sm font-medium text-[var(--color-accent-soft)]">
        {{ card.tagline }}
      </p>
      <p v-if="card.body" class="flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {{ card.body }}
      </p>

      <span
        v-if="card.cta"
        class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]"
      >
        {{ card.cta }}
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </component>
  </div>
</template>
