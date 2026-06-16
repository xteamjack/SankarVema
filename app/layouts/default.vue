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

    <!-- Profile backdrop: your photo, faint, lower-left, feathered on all edges — shared across every page -->
    <div
      class="pointer-events-none fixed bottom-0 left-0 -z-10 h-[88vh] w-[42vw] max-w-[560px] overflow-hidden opacity-30"
      aria-hidden="true"
      style="
        -webkit-mask-image: radial-gradient(105% 105% at 30% 80%, #000 28%, transparent 74%);
        mask-image: radial-gradient(105% 105% at 30% 80%, #000 28%, transparent 74%);
      "
    >
      <img
        src="/profilePic.jpg"
        alt=""
        class="h-full w-full -scale-x-100 object-cover object-center"
      />
    </div>
    <AppHeader />
    <!-- Home owns the full viewport (carousel handles header spacing itself) -->
    <main :class="isHome ? '' : 'pt-[var(--header-h)]'">
      <slot />
    </main>
    <AppFooter v-if="!isHome" />
  </div>
</template>
