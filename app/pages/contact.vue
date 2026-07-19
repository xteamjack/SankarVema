<script setup lang="ts">
import { contactPurposes, resolvePurpose } from '~/data/contactPurposes'

const { data: profile } = await useProfile()
const email = computed(() => profile.value?.contact?.email ?? 'sankar.vema@gmail.com')

const route = useRoute()
const purposeIds = contactPurposes.map((p) => p.key)

// Selected intent. Preselect from ?intent=, else the first purpose. This page is
// prerendered without a query string, so `route.query` is empty on a hard load;
// window.location on mount is the reliable source for direct links.
const selected = ref(
  typeof route.query.intent === 'string' && purposeIds.includes(route.query.intent)
    ? (route.query.intent as string)
    : contactPurposes[0]!.key,
)
const selectedPurpose = computed(() => resolvePurpose(selected.value))

// The case study this enquiry launched from (?ref=<slug>), if any.
const refSlug = ref(typeof route.query.ref === 'string' ? (route.query.ref as string) : '')
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const r = params.get('ref')
  if (r) refSlug.value = r
  const it = params.get('intent')
  if (it && purposeIds.includes(it)) selected.value = it
})

function humanize(slug: string) {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).trim()
}
const { data: refWork } = await useAsyncData(
  'contact-ref-work',
  () =>
    refSlug.value
      ? queryCollection('work').path(`/work/${refSlug.value}`).first()
      : Promise.resolve(null),
  { watch: [refSlug] },
)
const refTitle = computed(() => {
  const t = ((refWork.value as any)?.title ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()
  if (t) return t
  return refSlug.value ? humanize(refSlug.value) : ''
})

// Carry the originating case study to the CRM as a whitelisted extra field.
const formExtra = computed<Record<string, string>>(() =>
  refSlug.value ? { caseStudy: refTitle.value } : {},
)

useSeoMeta({
  title: 'Ask',
  description: 'Start a conversation about enterprise advisory, founder mentorship, due diligence, or speaking.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Ask"
      title="Start a conversation."
      subtitle="I read everything that comes in and respond within a few days. Pick the intent that fits, it helps me reply usefully."
    />

    <div class="wrap grid gap-12 py-16 lg:grid-cols-[1fr_20rem]">
      <!-- Composer -->
      <div>
        <p v-if="refSlug && refTitle" class="mb-6 rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-4 py-3 text-sm text-[var(--color-fg-muted)]">
          <span class="text-[var(--color-fg-faint)]">Re:</span>
          <span class="text-[var(--color-fg)]">{{ refTitle }}</span>
        </p>

        <fieldset class="mb-8">
          <legend class="eyebrow mb-4">What's this about?</legend>
          <div class="grid gap-3 sm:grid-cols-2">
            <label
              v-for="p in contactPurposes"
              :key="p.key"
              class="card cursor-pointer p-4"
              :class="selected === p.key ? '!border-[var(--color-accent)]' : ''"
            >
              <input v-model="selected" type="radio" name="intent" :value="p.key" class="sr-only" />
              <div class="flex items-start gap-3">
                <span
                  class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border"
                  :class="selected === p.key ? 'border-[var(--color-accent)]' : 'border-[var(--color-hair-strong)]'"
                >
                  <span v-if="selected === p.key" class="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span>
                  <span class="block text-sm font-medium text-[var(--color-fg)]">{{ p.label }}</span>
                  <span class="mt-0.5 block text-xs text-[var(--color-fg-muted)]">{{ p.blurb }}</span>
                </span>
              </div>
            </label>
          </div>
        </fieldset>

        <ContactForm :purpose="selectedPurpose" :extra="formExtra" />
      </div>

      <!-- Aside -->
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <div class="card p-6">
          <p class="eyebrow">Direct</p>
          <a :href="`mailto:${email}`" class="mt-3 block break-words text-sm text-[var(--color-fg)] hover:text-[var(--color-accent)]">{{ email }}</a>
          <div class="mt-6">
            <p class="eyebrow mb-3">Elsewhere</p>
            <SocialLinks v-if="profile" :contact="profile.contact" />
          </div>
          <p class="mt-6 border-t border-[var(--color-hair)] pt-4 text-xs leading-relaxed text-[var(--color-fg-muted)]">
            If we're a fit, the first conversation is a free 30-minute call. I won't sell; I'll diagnose.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
