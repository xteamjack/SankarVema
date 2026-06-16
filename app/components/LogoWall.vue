<script setup lang="ts">
defineProps<{
  customers: { name: string; sector?: string }[]
  showSector?: boolean
}>()
</script>

<template>
  <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    <li
      v-for="c in customers"
      :key="c.name"
      class="group glass flex flex-col items-center justify-center gap-1 px-4 py-5 text-center transition-colors"
    >
      <span class="font-[family-name:var(--font-display)] text-base font-medium tracking-tight text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-fg)] sm:text-lg">
        {{ c.name }}
      </span>
      <span
        v-if="showSector && c.sector"
        class="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--color-fg-faint)] transition-colors group-hover:text-[var(--color-accent)]"
      >
        {{ c.sector }}
      </span>
    </li>
  </ul>
</template>
