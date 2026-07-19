<script setup lang="ts">
import { defaultPurpose, type ContactPurpose, type ContactField } from '~/data/contactPurposes'

const props = withDefaults(
  defineProps<{
    purpose?: ContactPurpose
    /** Extra top-level fields merged into the POST body (e.g. caseStudy). */
    extra?: Record<string, string>
  }>(),
  { purpose: () => defaultPurpose, extra: () => ({}) },
)

const purpose = computed(() => props.purpose ?? defaultPurpose)

// Core keys the CRM already understands; everything else on a purpose is an
// audience-specific extra, sent alongside so richer CRMs can store it.
const CORE = new Set(['name', 'email', 'company', 'interest', 'message', 'website'])
// When one of these is present it stands in for the CRM's generic `interest`
// categorisation; otherwise we fall back to the purpose label.
const PRIMARY = ['interest', 'partnershipType', 'track', 'role']

const submitted = ref(false)
const sending = ref(false)
const errorMsg = ref('')
const errors = reactive<Record<string, string>>({})
const submittedName = ref('')

// The site is static (GitHub Pages), so the form POSTs cross-origin to the CRM's
// public contact-query intake. useCrm() resolves the CRM base from
// NUXT_PUBLIC_CRM_URL (baked into the Pages build).
const crm = useCrm()
const endpoint = computed(() => `${crm.url}/api/public/queries`)

const inputClass =
  'w-full rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]'
const optionClass = 'bg-[var(--color-ink-850)] text-[var(--color-fg)]'

// Honeypot `website` is always present; real users never fill it.
function blankForm(p: ContactPurpose): Record<string, string> {
  const model: Record<string, string> = { website: '' }
  for (const f of p.fields) model[f.key] = ''
  return model
}

const form = reactive<Record<string, string>>(blankForm(purpose.value))

// Switching intent rebuilds the model but preserves overlapping values so a
// half-typed message survives the switch.
watch(
  () => purpose.value.key,
  () => {
    const carried = { ...form }
    const next = blankForm(purpose.value)
    for (const k of Object.keys(next)) {
      if (k in carried) next[k] = carried[k]!
    }
    for (const k of Object.keys(form)) delete form[k]
    Object.assign(form, next)
    Object.keys(errors).forEach((k) => delete errors[k])
    errorMsg.value = ''
    submitted.value = false
  },
)

function requiredMessage(field: ContactField): string {
  if (field.key === 'name') return 'Please tell me your name.'
  if (field.key === 'message') return 'A line or two about your goal, please.'
  if (field.type === 'select') return `Please choose your ${field.label.toLowerCase()}.`
  return `Please add your ${field.label.toLowerCase()}.`
}

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  let ok = true
  for (const field of purpose.value.fields) {
    const val = (form[field.key] ?? '').trim()
    if (field.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errors[field.key] = 'A valid email helps me reply.'
        ok = false
      }
      continue
    }
    if (field.key === 'message' && field.required && val.length <= 4) {
      errors[field.key] = 'A line or two about your goal, please.'
      ok = false
      continue
    }
    if (field.required && !val) {
      errors[field.key] = requiredMessage(field)
      ok = false
    }
  }
  return ok
}

async function onSubmit() {
  if (sending.value) return
  if (!crm.configured) {
    errorMsg.value = 'The message form is not wired up in this environment. Please email me directly.'
    return
  }
  if (!validate()) return
  sending.value = true
  errorMsg.value = ''

  // Standard fields the CRM handles, plus a `purpose` tag, any audience-specific
  // extras, and the caller-supplied extras (e.g. caseStudy).
  const extras: Record<string, string> = {}
  for (const field of purpose.value.fields) {
    if (!CORE.has(field.key)) extras[field.key] = (form[field.key] ?? '').trim()
  }
  const interest = PRIMARY.map((k) => form[k]).find((v) => v && v.trim()) ?? purpose.value.label

  try {
    await $fetch(endpoint.value, {
      method: 'POST',
      body: {
        purpose: purpose.value.key,
        name: (form.name ?? '').trim(),
        email: (form.email ?? '').trim(),
        company: (form.company ?? '').trim(),
        interest: (interest ?? '').trim(),
        message: (form.message ?? '').trim(),
        // Honeypot: real users never fill this hidden field.
        website: form.website,
        ...extras,
        ...props.extra,
      },
    })
    submittedName.value = (form.name ?? '').split(' ')[0] || 'there'
    submitted.value = true
  } catch (e: any) {
    const code = e?.statusCode ?? e?.response?.status
    errorMsg.value =
      code === 429
        ? 'That is a few too many attempts. Please give it a little while and try again.'
        : 'Something went wrong sending your message. Please try again in a moment, or email me directly.'
  } finally {
    sending.value = false
  }
}

function reset() {
  Object.keys(form).forEach((k) => delete form[k])
  Object.assign(form, blankForm(purpose.value))
  Object.keys(errors).forEach((k) => delete errors[k])
  errorMsg.value = ''
  submitted.value = false
}
</script>

<template>
  <!-- Success -->
  <div v-if="submitted" class="card p-8">
    <div class="flex items-center gap-3">
      <span class="grid h-9 w-9 place-items-center rounded-full bg-[color:color-mix(in_oklab,var(--color-accent)_18%,transparent)] text-[var(--color-accent)]">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      </span>
      <h2 class="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-fg)]">Thanks, {{ submittedName }}.</h2>
    </div>
    <p class="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
      Your message is with me. If we are a fit, the first conversation is a free 30-minute call.
      I will reply to <span class="text-[var(--color-fg)]">{{ form.email }}</span> within a few days.
    </p>
    <button type="button" class="btn btn-ghost mt-6" @click="reset">Send another message</button>
  </div>

  <!-- Form -->
  <form v-else :key="purpose.key" novalidate @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <label
        v-for="field in purpose.fields"
        :key="field.key"
        class="block"
        :class="field.half ? '' : 'sm:col-span-2'"
      >
        <span class="mb-1.5 block text-sm text-[var(--color-fg-muted)]">
          {{ field.label }}
          <span v-if="field.optional" class="text-[var(--color-fg-faint)]">(optional)</span>
        </span>

        <textarea
          v-if="field.type === 'textarea'"
          v-model="form[field.key]"
          :rows="field.rows ?? 4"
          :placeholder="field.placeholder"
          class="w-full resize-y rounded-lg border border-[var(--color-hair)] bg-[var(--color-ink-850)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-accent)]"
        />
        <select
          v-else-if="field.type === 'select'"
          v-model="form[field.key]"
          :class="[inputClass, optionClass]"
        >
          <option :class="optionClass" value="">{{ field.placeholder ?? 'Select…' }}</option>
          <option v-for="opt in field.options" :key="opt" :class="optionClass" :value="opt">{{ opt }}</option>
        </select>
        <input
          v-else
          v-model="form[field.key]"
          :type="field.type"
          :placeholder="field.placeholder"
          :class="inputClass"
        />

        <span v-if="errors[field.key]" class="mt-1 block text-xs text-[color:color-mix(in_oklab,red_55%,var(--color-fg))]">{{ errors[field.key] }}</span>
      </label>
    </div>

    <!-- Honeypot: hidden from users; bots that fill it are dropped server-side. -->
    <div class="absolute -left-[9999px]" aria-hidden="true">
      <label>Website (leave blank)
        <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
      </label>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <button type="submit" class="btn btn-primary" :disabled="sending || !crm.configured">
        <span>{{ sending ? (purpose.sendingLabel ?? 'Sending…') : purpose.submitLabel }}</span>
        <svg v-if="!sending" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
      <p class="text-sm text-[var(--color-fg-faint)]">No spam. No sales sequence. A real reply.</p>
    </div>

    <!-- Local-dev only: crmUrl is empty when NUXT_PUBLIC_CRM_URL is unset. The
         deployed build always has it set, so this note never shows in production. -->
    <p v-if="!crm.configured" class="mt-3 text-xs leading-relaxed text-[var(--color-fg-faint)]">
      Sending is disabled in this local build because no CRM endpoint is configured. Run the site with
      <code class="text-[var(--color-fg-muted)]">NUXT_PUBLIC_CRM_URL</code> pointed at a running CRM to enable it. The deployed site is wired automatically.
    </p>
    <p v-if="errorMsg" class="mt-3 text-sm text-[color:color-mix(in_oklab,red_55%,var(--color-fg))]" role="alert">{{ errorMsg }}</p>
  </form>
</template>
