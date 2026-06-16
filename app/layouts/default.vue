<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="relative min-h-dvh">
    <!-- Ambient accent glow, fixed to the top of the viewport -->
    <div
      class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh]"
      aria-hidden="true"
      style="background: radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--color-accent) var(--glow), transparent), transparent 70%);"
    />
    <AppHeader />
    <!-- Home owns the full viewport (carousel handles header spacing itself) -->
    <main :class="isHome ? '' : 'pt-[var(--header-h)]'">
      <slot />
    </main>
    <AppFooter v-if="!isHome" />
  </div>
</template>
