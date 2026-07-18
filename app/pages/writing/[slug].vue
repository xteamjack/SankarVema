<script setup lang="ts">
const route = useRoute()
const path = `/writing/${route.params.slug}`

const { data: doc } = await useAsyncData(`writing-${route.params.slug}`, () =>
  queryCollection('writing').path(path).first(),
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Essay not found', fatal: true })
}

const d = computed<any>(() => doc.value as any)

const dateLabel = computed(() => {
  if (!d.value?.date) return null
  const date = new Date(d.value.date)
  if (Number.isNaN(date.getTime())) return String(d.value.date)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

useSeoMeta({
  title: () => stripHtml(d.value?.title) || 'Writing',
  description: () => stripHtml(d.value?.excerpt) || undefined,
})

function stripHtml(s?: string) {
  return (s ?? '').replace(/&mdash;/g, ', ').replace(/<[^>]*>/g, '')
}
</script>

<template>
  <article>
    <PageHero eyebrow="Essay" :title="d?.title">
      <template #meta>
        <div class="rise mt-6 flex flex-wrap items-center gap-4 text-sm" style="animation-delay: 120ms">
          <time v-if="dateLabel" class="font-[family-name:var(--font-mono)] text-[var(--color-fg-muted)]">{{ dateLabel }}</time>
          <span v-if="d?.status" class="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-warm)]">{{ d.status }}</span>
          <div v-if="d?.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="t in d.tags" :key="t" class="tag">#{{ t }}</span>
          </div>
        </div>
        <p v-if="d?.excerpt" class="rise mt-5 max-w-2xl text-lg text-[var(--color-fg-muted)]" style="animation-delay: 160ms" v-html="d.excerpt" />
      </template>
    </PageHero>

    <div class="wrap py-16">
      <div class="prose-editorial">
        <ContentRenderer :value="doc" />
      </div>

      <div class="mt-14 border-t border-[var(--color-hair)] pt-8">
        <NuxtLink to="/writing" class="link-underline inline-flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          All writing
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
