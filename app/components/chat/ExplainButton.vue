<script setup lang="ts">
/**
 * "Explain this page" pill. Reads the page's visible main text and asks the
 * agent to summarise it aloud (and as text with buttons) in the chat window.
 * Rendered inside the ChatWidget's floating stack (above the launcher, below the
 * greeting teaser) so the two never overlap. Shows only when the panel is closed.
 */
const { explain, isStreaming, isOpen } = useChat()
const route = useRoute()

function pageText(): string {
  if (typeof document === 'undefined') return ''
  const main = document.querySelector('main') || document.body
  return (main?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 6000)
}

function onClick() {
  if (isStreaming.value) return
  explain(route.fullPath, pageText())
}
</script>

<template>
  <Transition name="explain-pill">
    <button
      v-if="!isOpen"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-ink-850/90 px-4 py-2.5 text-sm font-medium text-fg shadow-lg backdrop-blur-md transition hover:border-accent/70 hover:-translate-y-0.5 dark:text-fg"
      :disabled="isStreaming"
      aria-label="Explain this page"
      @click="onClick"
    >
      <span class="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-accent-deep text-on-accent">
        <Icon name="lucide:volume-2" class="size-3.5" />
      </span>
      Explain this page
    </button>
  </Transition>
</template>

<style scoped>
.explain-pill-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.explain-pill-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.explain-pill-enter-from,
.explain-pill-leave-to { opacity: 0; transform: translateY(8px) scale(0.96); }
</style>
