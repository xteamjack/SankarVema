<script setup lang="ts">
interface Capability {
  title: string
  tagline?: string
  body?: string
  link?: string
  cta?: string
}

const props = defineProps<{
  role?: string
  headline?: string
  intro?: string
  metrics?: { value: string; label: string }[]
  capabilities?: Capability[]
  contact?: Record<string, string>
}>()

const slideCount = 2
const active = ref(0)
const paused = ref(false)
const reduced = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function go(i: number) {
  active.value = (i + slideCount) % slideCount
}
function next() {
  go(active.value + 1)
}
function prev() {
  go(active.value - 1)
}

function start() {
  if (reduced.value) return
  stop()
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 7000)
}
function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  start()
})
onUnmounted(stop)

const metrics = computed(() => props.metrics ?? [])
const capabilities = computed(() => props.capabilities ?? [])
</script>

<template>
  <div
    class="relative"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <!-- Stacked slides (grid keeps the tallest slide's height) -->
    <div class="grid">
      <!-- Slide 1 — the pitch -->
      <div
        class="col-start-1 row-start-1 transition-all duration-700 ease-out"
        :class="active === 0 ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'"
        :aria-hidden="active !== 0"
      >
        <div class="max-w-3xl">
          <p class="eyebrow mb-5">{{ role }}</p>
          <h1
            class="font-[family-name:var(--font-display)] text-[2.6rem] leading-[1.03] tracking-[-0.03em] text-[var(--color-fg)] sm:text-6xl lg:text-[4.3rem]"
            v-html="headline"
          />
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]" v-html="intro" />

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink to="/contact" class="btn btn-primary">
              Book an advisory call
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </NuxtLink>
            <NuxtLink to="/work" class="btn btn-ghost">See the work</NuxtLink>
            <SocialLinks v-if="contact" :contact="contact" class="ml-1" />
          </div>

          <div v-if="metrics.length" class="glass mt-9 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
            <div v-for="m in metrics" :key="m.label" class="p-5">
              <div class="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--color-accent)]" v-html="m.value" />
              <div class="mt-1 text-xs leading-snug text-[var(--color-fg-muted)]" v-html="m.label" />
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2 — how I help -->
      <div
        class="col-start-1 row-start-1 transition-all duration-700 ease-out"
        :class="active === 1 ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'"
        :aria-hidden="active !== 1"
      >
        <p class="eyebrow mb-3">How I help</p>
        <h2 class="max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight text-[var(--color-fg)] sm:text-5xl">
          Three ways I work with leaders betting on AI.
        </h2>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <NuxtLink
            v-for="(c, i) in capabilities"
            :key="c.title"
            :to="c.link || '/advisory'"
            class="card group flex flex-col p-5"
          >
            <div class="flex items-center gap-2.5">
              <span class="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-hair-strong)] bg-[var(--color-ink-800)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="font-[family-name:var(--font-display)] text-lg text-[var(--color-fg)]">{{ c.title }}</h3>
            </div>
            <p v-if="c.tagline" class="mt-3 text-sm font-medium text-[var(--color-accent-soft)]">{{ c.tagline }}</p>
            <p v-if="c.body" class="mt-1.5 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]" v-html="c.body" />
            <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)]">
              {{ c.cta || 'Learn more' }}
              <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </NuxtLink>
        </div>

        <NuxtLink to="/contact" class="btn btn-primary mt-7 w-fit">
          Book an advisory call
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-9 flex items-center gap-4">
      <button
        type="button"
        class="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-hair)] text-[var(--color-fg-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        aria-label="Previous slide"
        @click="prev"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      <div class="flex items-center gap-2">
        <button
          v-for="i in slideCount"
          :key="i"
          type="button"
          class="h-2.5 rounded-full transition-all duration-300"
          :class="active === i - 1 ? 'w-7 bg-[var(--color-accent)]' : 'w-2.5 bg-[var(--color-hair-strong)] hover:bg-[var(--color-fg-muted)]'"
          :aria-label="`Go to slide ${i}`"
          :aria-current="active === i - 1 ? 'true' : undefined"
          @click="go(i - 1)"
        />
      </div>

      <button
        type="button"
        class="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-hair)] text-[var(--color-fg-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        aria-label="Next slide"
        @click="next"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </div>
  </div>
</template>
