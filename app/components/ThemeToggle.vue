<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-hair)] text-[var(--color-fg-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      :title="isDark ? 'Light mode' : 'Dark mode'"
      @click="toggle"
    >
      <!-- Sun (shown in dark mode → click for light) -->
      <svg v-if="isDark" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
      <!-- Moon (shown in light mode → click for dark) -->
      <svg v-else class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></svg>
    </button>
    <template #fallback>
      <span class="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-hair)]" />
    </template>
  </ClientOnly>
</template>
