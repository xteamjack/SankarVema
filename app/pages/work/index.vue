<script setup lang="ts">
const { data: items } = await useAsyncData('work-index', () =>
  queryCollection('work').order('year', 'DESC').all(),
)
const { data: domainDoc } = await useAsyncData('work-domains', () =>
  queryCollection('domains').first(),
)

const domains = computed<any[]>(() =>
  [...((domainDoc.value as any)?.items ?? [])].sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99),
  ),
)

// Group case studies under their domain, preserving the year-DESC order within
// each group. Studies without a known domain fall into an "Other" bucket.
const grouped = computed(() => {
  const all = (items.value ?? []) as any[]
  return domains.value
    .map((d) => ({ ...d, studies: all.filter((it) => it.domain === d.key) }))
    .filter((d) => d.studies.length)
})

const ungrouped = computed(() => {
  const known = new Set(domains.value.map((d) => d.key))
  return ((items.value ?? []) as any[]).filter(
    (it) => !it.domain || !known.has(it.domain),
  )
})

useSeoMeta({
  title: 'Work',
  description:
    'A multi-domain body of work spanning language and silicon, agentic AI products, industrial computer vision, autonomous systems, cognitive ERP and nation-scale public-sector platforms.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Selected Work"
      title="Systems I architected and shipped."
      subtitle="Not a single track. Programs across language and silicon, agentic AI products, industrial vision, autonomous systems, the enterprise core and nation-scale infrastructure. Grouped by domain below, deepest first."
    />

    <div class="wrap py-16">
      <template v-if="grouped.length">
        <section
          v-for="(d, di) in grouped"
          :key="d.key"
          :class="di > 0 ? 'mt-20' : ''"
        >
          <div class="flex items-baseline gap-3">
            <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">{{ String(d.order ?? di + 1).padStart(2, '0') }}</span>
            <h2 class="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)]">{{ d.title }}</h2>
          </div>
          <p v-if="d.thesis" class="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-muted)]">{{ d.thesis }}</p>

          <div class="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WorkCard v-for="item in d.studies" :key="item.path" :item="item" />
          </div>
        </section>

        <section v-if="ungrouped.length" class="mt-20">
          <h2 class="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-fg)]">More work</h2>
          <div class="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WorkCard v-for="item in ungrouped" :key="item.path" :item="item" />
          </div>
        </section>
      </template>

      <p v-else class="text-[var(--color-fg-muted)]">No case studies published yet.</p>
    </div>
  </div>
</template>
