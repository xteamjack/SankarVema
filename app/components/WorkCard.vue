<script setup lang="ts">
const props = defineProps<{ item: any }>()

const stack = computed<string[]>(() => props.item?.stack ?? [])
</script>

<template>
  <NuxtLink :to="item.path" class="card group flex flex-col overflow-hidden">
    <!-- Generative cover -->
    <div class="relative h-40 overflow-hidden border-b border-[var(--color-hair)]">
      <div
        class="absolute inset-0 grid-backdrop opacity-60 transition-transform duration-700 group-hover:scale-110"
      />
      <div
        class="absolute inset-0"
        style="background: radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 55%);"
      />
      <div class="absolute left-5 top-5 flex items-center gap-2">
        <span
          v-if="item.status"
          class="tag !border-[color:color-mix(in_oklab,var(--color-accent)_40%,transparent)] !text-[var(--color-accent)]"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />{{ item.status }}
        </span>
        <span v-if="item.year" class="tag">{{ item.year }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <h3
        class="font-[family-name:var(--font-display)] text-lg leading-snug tracking-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent-soft)]"
        v-html="item.title"
      />
      <p v-if="item.hero" class="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]" v-html="item.hero" />

      <div v-if="stack.length" class="mt-4 flex flex-wrap gap-1.5">
        <span v-for="s in stack.slice(0, 4)" :key="s" class="tag">{{ s }}</span>
        <span v-if="stack.length > 4" class="tag">+{{ stack.length - 4 }}</span>
      </div>

      <span
        class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]"
      >
        Read the case study
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </span>
    </div>
  </NuxtLink>
</template>
