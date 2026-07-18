<script setup lang="ts">
const { data: doc } = await useAsyncData('assignments', () =>
  queryCollection('assignments').first(),
)
const intro = computed(() => (doc.value as any)?.intro as string | undefined)
const segments = computed<any[]>(() => (doc.value as any)?.segments ?? [])
const customers = computed<any[]>(() => (doc.value as any)?.customers ?? [])

useSeoMeta({
  title: 'Assignments',
  description:
    'Industries and customers across advisory, delivery and practice design, spanning Government of India, Nestlé, Philips, AT&T, Zurich, Mastercard, John Deere, Caterpillar, Airbus, Hyundai, KONE and Tata JLR.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Industries & Customers"
      title="Who I've delivered for."
      :subtitle="intro"
    >
      <template #meta>
        <NuxtLink to="/contact" class="btn btn-primary mt-8 !py-2 !text-sm rise" style="animation-delay: 160ms">
          Book an advisory call
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
      </template>
    </PageHero>

    <div class="wrap py-16">
      <!-- Customer logo carousel -->
      <section>
        <h2 class="eyebrow mb-6">Selected customers</h2>
        <LogoMarquee :customers="customers" :speed="44" />
        <LogoMarquee :customers="[...customers].reverse()" :speed="52" reverse class="mt-4" />
      </section>

      <!-- Segments -->
      <section class="mt-16">
        <h2 class="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)]">
          How the work breaks down
        </h2>
        <div class="mt-8 grid gap-5 md:grid-cols-2">
          <div v-for="(s, i) in segments" :key="s.title" class="card flex flex-col p-6">
            <div class="flex items-center gap-3">
              <span class="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-hair-strong)] bg-[var(--color-ink-800)] font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-fg)]">{{ s.title }}</h3>
            </div>
            <p v-if="s.summary" class="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{{ s.summary }}</p>
            <ul v-if="s.highlights?.length" class="mt-4 flex flex-col gap-2">
              <li v-for="h in s.highlights" :key="h" class="flex items-start gap-2.5 text-sm text-[var(--color-fg-muted)]">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-deep)]" />
                <span>{{ h }}</span>
              </li>
            </ul>
          </div>
        </div>
        <p class="mt-6 text-sm text-[var(--color-fg-faint)]">More detail on individual engagements coming soon.</p>
      </section>

      <div class="mt-14 flex flex-wrap gap-3 border-t border-[var(--color-hair)] pt-10">
        <NuxtLink to="/work" class="btn btn-ghost">See the work in detail</NuxtLink>
        <NuxtLink to="/contact" class="btn btn-primary">Engage me</NuxtLink>
      </div>
    </div>
  </div>
</template>
