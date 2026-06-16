<script setup lang="ts">
defineProps<{
  id: string
  index?: string
  eyebrow?: string
}>()
</script>

<template>
  <section
    :id="id"
    class="snap-panel relative flex min-h-[100svh] scroll-mt-[var(--header-h)] flex-col"
  >
    <div class="wrap flex flex-1 flex-col justify-center pt-[calc(var(--header-h)+1.5rem)] pb-16">
      <div v-if="eyebrow || index" class="mb-5 flex items-center gap-3">
        <span v-if="index" class="font-[family-name:var(--font-mono)] text-xs text-[var(--color-fg-faint)]">{{ index }}</span>
        <span v-if="index" class="h-px w-8 bg-[var(--color-hair-strong)]" />
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      </div>
      <slot />
    </div>
  </section>
</template>
