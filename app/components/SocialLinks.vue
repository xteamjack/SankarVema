<script setup lang="ts">
import type { ProfileContact } from '~/composables/useProfile'

const props = defineProps<{ contact: ProfileContact }>()

const items = computed(() => {
  const c = props.contact ?? {}
  return [
    c.email && { label: 'Email', href: `mailto:${c.email}`, icon: 'mail' },
    c.linkedin && { label: 'LinkedIn', href: c.linkedin, icon: 'linkedin' },
    c.github && { label: 'GitHub', href: c.github, icon: 'github' },
    c.twitter && { label: 'Twitter / X', href: c.twitter, icon: 'twitter' },
    c.blog && { label: 'Blog', href: c.blog, icon: 'blog' },
  ].filter(Boolean) as { label: string; href: string; icon: string }[]
})
</script>

<template>
  <ul class="flex flex-wrap items-center gap-2">
    <li v-for="it in items" :key="it.label">
      <a
        :href="it.href"
        :target="it.icon === 'mail' ? undefined : '_blank'"
        rel="noopener"
        class="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-hair)] text-[var(--color-fg-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        :aria-label="it.label"
        :title="it.label"
      >
        <!-- mail -->
        <svg v-if="it.icon === 'mail'" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
        <!-- linkedin -->
        <svg v-else-if="it.icon === 'linkedin'" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21H9V9Z" /></svg>
        <!-- github -->
        <svg v-else-if="it.icon === 'github'" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" /></svg>
        <!-- twitter / x -->
        <svg v-else-if="it.icon === 'twitter'" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.3l-7.2 8.26L23 22h-6.6l-5.18-6.78L5.3 22H2l7.7-8.83L1.5 2h6.77l4.68 6.2L18.2 2Zm-1.16 18h1.83L7.04 3.9H5.07L17.04 20Z" /></svg>
        <!-- blog -->
        <svg v-else class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4Z" /><path d="M8 9h7M8 13h7M8 17h4" /></svg>
      </a>
    </li>
  </ul>
</template>
