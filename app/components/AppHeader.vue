<script setup lang="ts">
const { data: profile } = await useProfile()

const links = [
  { label: 'Work', to: '/work' },
  { label: 'Assignments', to: '/assignments' },
  { label: 'Journey', to: '/journey' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Contributions', to: '/contributions' },
  { label: 'Writing', to: '/writing' },
  { label: 'Advisory', to: '/advisory' },
]

const open = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))

const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    :class="scrolled
      ? 'border-b border-[var(--color-hair)] bg-[var(--color-ink-900)]/80 backdrop-blur-xl'
      : 'border-b border-transparent bg-[var(--color-ink-900)]/40 backdrop-blur-md'"
  >
    <!-- Row 1: name + nav + controls -->
    <div class="wrap flex h-14 items-center justify-between">
      <NuxtLink to="/" class="group flex items-center gap-2.5" aria-label="Sankar Vema — home">
        <span
          class="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-hair-strong)] bg-[var(--color-ink-850)] font-[family-name:var(--font-display)] text-sm text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]"
        >SV</span>
        <span class="text-[15px] font-semibold tracking-tight">{{ profile?.name ?? 'Sankar Vema' }}</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 lg:flex">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="link-underline text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          active-class="!text-[var(--color-fg)]"
        >{{ l.label }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <NuxtLink to="/contact" class="btn btn-primary hidden !py-2 !text-sm sm:inline-flex">
          Book a call
        </NuxtLink>
        <button
          class="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-hair)] lg:hidden"
          :aria-expanded="open"
          aria-label="Toggle menu"
          @click="open = !open"
        >
          <span class="relative block h-3.5 w-5">
            <span class="absolute left-0 block h-0.5 w-5 bg-[var(--color-fg)] transition-all" :class="open ? 'top-1.5 rotate-45' : 'top-0'" />
            <span class="absolute left-0 top-1.5 block h-0.5 w-5 bg-[var(--color-fg)] transition-all" :class="open ? 'opacity-0' : 'opacity-100'" />
            <span class="absolute left-0 block h-0.5 w-5 bg-[var(--color-fg)] transition-all" :class="open ? 'top-1.5 -rotate-45' : 'top-3'" />
          </span>
        </button>
      </div>
    </div>

    <!-- Row 2: one-line profile tagline -->
    <div class="hidden border-t border-[var(--color-hair)] sm:block">
      <div class="wrap flex h-9 items-center gap-3">
        <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
        <p class="truncate text-[13px] text-[var(--color-fg-muted)]">
          <span class="text-[var(--color-fg)]">{{ profile?.role }}</span>
          <span v-if="profile?.tagline" class="text-[var(--color-fg-faint)]"> — {{ profile?.tagline }}</span>
        </p>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="open" class="border-t border-[var(--color-hair)] bg-[var(--color-ink-900)]/95 backdrop-blur-xl lg:hidden">
        <div class="wrap flex flex-col py-2">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="py-2.5 text-[var(--color-fg-muted)]"
            active-class="!text-[var(--color-accent)]"
          >{{ l.label }}</NuxtLink>
          <NuxtLink to="/contact" class="btn btn-primary mt-2 mb-2 w-fit !py-2 !text-sm">Book a call</NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>
