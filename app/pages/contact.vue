<script setup lang="ts">
const { data: profile } = await useProfile()
const email = computed(() => profile.value?.contact?.email ?? 'sankar.vema@gmail.com')

const intents = [
  { id: 'advisory', label: 'Enterprise advisory', blurb: 'Architecture review or fractional Chief AI Architect.' },
  { id: 'mentorship', label: 'Founder mentorship', blurb: 'Early-stage, AI-native product. Applying to the cohort.' },
  { id: 'diligence', label: 'Technical due diligence', blurb: 'A second opinion on an AI-heavy investment.' },
  { id: 'speaking', label: 'Speaking / writing', blurb: 'A talk, podcast, or commissioned essay.' },
  { id: 'other', label: 'Something else', blurb: 'Anything that doesn’t fit the boxes above.' },
]

const selected = ref('advisory')
const name = ref('')
const org = ref('')
const message = ref('')

const mailto = computed(() => {
  const intent = intents.find(i => i.id === selected.value)?.label ?? 'Inquiry'
  const subject = `[${intent}] from ${name.value || 'your site'}`
  const bodyLines = [
    name.value && `Name: ${name.value}`,
    org.value && `Organization: ${org.value}`,
    `Intent: ${intent}`,
    '',
    message.value || '',
  ].filter(v => v !== false && v !== undefined)
  const body = bodyLines.join('\n')
  return `mailto:${email.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})

useSeoMeta({
  title: 'Contact',
  description: 'Start a conversation about enterprise advisory, founder mentorship, due diligence, or speaking.',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Contact"
      title="Start a conversation."
      subtitle="I read everything that comes in and respond within a few days. Pick the intent that fits, it helps me reply usefully."
    />

    <div class="wrap grid gap-12 py-16 lg:grid-cols-[1fr_20rem]">
      <!-- Composer -->
      <div>
        <fieldset>
          <legend class="eyebrow mb-4">What's this about?</legend>
          <div class="grid gap-3 sm:grid-cols-2">
            <label
              v-for="it in intents"
              :key="it.id"
              class="card cursor-pointer p-4"
              :class="selected === it.id ? '!border-[var(--color-accent)]' : ''"
            >
              <input v-model="selected" type="radio" name="intent" :value="it.id" class="sr-only" />
              <div class="flex items-start gap-3">
                <span
                  class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border"
                  :class="selected === it.id ? 'border-[var(--color-accent)]' : 'border-[var(--color-hair-strong)]'"
                >
                  <span v-if="selected === it.id" class="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
                <span>
                  <span class="block text-sm font-medium text-[var(--color-fg)]">{{ it.label }}</span>
                  <span class="mt-0.5 block text-xs text-[var(--color-fg-muted)]">{{ it.blurb }}</span>
                </span>
              </div>
            </label>
          </div>
        </fieldset>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1.5 block text-sm text-[var(--color-fg-muted)]">Your name</span>
            <input
              v-model="name"
              type="text"
              placeholder="Jane Doe"
              class="w-full rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </label>
          <label class="block">
            <span class="mb-1.5 block text-sm text-[var(--color-fg-muted)]">Organization <span class="text-[var(--color-fg-faint)]">(optional)</span></span>
            <input
              v-model="org"
              type="text"
              placeholder="Acme Inc."
              class="w-full rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </label>
        </div>

        <label class="mt-4 block">
          <span class="mb-1.5 block text-sm text-[var(--color-fg-muted)]">A few lines on what you're working on</span>
          <textarea
            v-model="message"
            rows="5"
            placeholder="What you're building, where you're stuck, what good would look like…"
            class="w-full resize-y rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]"
          />
        </label>

        <a :href="mailto" class="btn btn-primary mt-6">
          Compose email
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
        <p class="mt-3 text-xs text-[var(--color-fg-faint)]">
          This opens your mail app pre-filled. Prefer to write directly? Email
          <a :href="`mailto:${email}`" class="text-[var(--color-accent)]">{{ email }}</a>.
        </p>
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
