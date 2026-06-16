<script setup lang="ts">
const { data: doc } = await useAsyncData('advisory', () =>
  queryCollection('pages').path('/advisory').first(),
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Advisory content not found', fatal: true })
}

useSeoMeta({
  title: () => (doc.value?.title as string) ?? 'Advisory',
  description:
    'Where I am useful, how I work, and who I work with — enterprise architecture engagements and a selective founder mentorship cohort.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Advisory & Mentorship"
      :title="(doc as any)?.title"
      :subtitle="(doc as any)?.subtitle"
    />

    <div class="wrap py-16">
      <article class="prose-editorial">
        <ContentRenderer :value="doc" />
      </article>

      <div class="mt-14 flex flex-wrap gap-3 border-t border-[var(--color-hair)] pt-10">
        <NuxtLink to="/contact" class="btn btn-primary">
          Start a conversation
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </NuxtLink>
        <NuxtLink to="/work" class="btn btn-ghost">See what I've shipped</NuxtLink>
      </div>
    </div>
  </div>
</template>
