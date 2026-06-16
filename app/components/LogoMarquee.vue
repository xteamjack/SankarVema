<script setup lang="ts">
interface Customer {
  name: string
  sector?: string
  logo?: string
}

const props = withDefaults(
  defineProps<{ customers: Customer[]; speed?: number; reverse?: boolean }>(),
  { speed: 38, reverse: false },
)

// Track which logo images failed to load → fall back to the wordmark.
const failed = reactive<Record<string, boolean>>({})
function onError(name: string) {
  failed[name] = true
}

// Duplicate the set so the translateX(-50%) loop is seamless.
const loop = computed(() => [...props.customers, ...props.customers])
const duration = computed(() => `${props.speed}s`)
</script>

<template>
  <div
    class="logo-marquee group relative w-full overflow-hidden py-4"
    :style="{
      '--marquee-duration': duration,
      '-webkit-mask-image': 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
      'mask-image': 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
    }"
  >
    <div class="logo-track flex w-max items-stretch" :class="{ 'logo-track--reverse': reverse }">
      <div
        v-for="(c, i) in loop"
        :key="`${c.name}-${i}`"
        class="logo-cell flex shrink-0 flex-col items-center justify-center gap-3 px-9"
      >
        <!-- Logo (full colour) or wordmark fallback -->
        <div class="flex h-20 items-center justify-center">
          <img
            v-if="c.logo && !failed[c.name]"
            :src="c.logo"
            :alt="c.name"
            loading="lazy"
            class="h-16 w-auto max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            @error="onError(c.name)"
          />
          <span
            v-else
            class="whitespace-nowrap font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--color-fg)]"
          >{{ c.name }}</span>
        </div>
        <!-- Company name (shown under real logos) -->
        <span
          v-if="c.logo && !failed[c.name]"
          class="whitespace-nowrap text-sm font-medium text-[var(--color-fg-muted)]"
        >{{ c.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-track {
  animation: logo-scroll var(--marquee-duration, 38s) linear infinite;
}
.logo-track--reverse {
  animation-direction: reverse;
}
.logo-marquee:hover .logo-track {
  animation-play-state: paused;
}
@keyframes logo-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .logo-track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    gap: 0.5rem 0;
  }
}
</style>
