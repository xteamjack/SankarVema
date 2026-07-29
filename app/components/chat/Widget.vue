<script setup lang="ts">
/**
 * Site chat widget — floating launcher + conversational panel.
 * Streams answers from /api/chat and renders them as markdown (with in-site
 * links). Styled with the site's own tokens (accent / ink / fg, glass),
 * theme-aware via @nuxtjs/color-mode.
 */
import { renderMarkdown } from '~/composables/markdown'

const input = ref('')
const showTeaser = ref(false)
const bodyEl = ref<HTMLElement | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

// open/messages are shared (useState) so the "Explain this page" button can
// drive this same panel.
const { messages, isStreaming, send, isOpen: open } = useChat()
const { speak, stop, speaking, supported: audioSupported } = useSpeech()
const audioOn = ref(true)

// Auto-play the spoken summary when an "explain" message finishes streaming.
watch(isStreaming, (streaming, was) => {
  if (was && !streaming) {
    const last = messages.value[messages.value.length - 1]
    if (last && last.role === 'assistant' && last.speak && !last.spoke) {
      last.spoke = true
      if (audioOn.value) speak(displayText(last.content))
    }
  }
})

function replay(m: { content: string }) {
  audioOn.value = true
  speak(displayText(m.content))
}

function toggleAudio() {
  audioOn.value = !audioOn.value
  if (!audioOn.value) stop()
}

const starters = [
  { label: 'Who is Sankar?', icon: 'lucide:user' },
  { label: 'See the work', icon: 'lucide:layers' },
  { label: 'How he advises', icon: 'lucide:compass' },
  { label: 'Get in touch', icon: 'lucide:send' },
]

// The model ends each reply with a "[[SUGGESTIONS]] a | b | c" line. We strip it
// from the bubble and render the options as tap-to-continue buttons.
interface Suggestion { label: string; to?: string }

const SUGG_MARK = '[[SUGGESTIONS]]'
const DEFAULT_SUGGESTIONS: Suggestion[] = [{ label: 'Tell me more' }, { label: 'Talk to the team' }]

function displayText(content: string): string {
  const full = content.indexOf(SUGG_MARK)
  if (full >= 0) return content.slice(0, full).trimEnd()
  // Hide a partially-streamed marker (e.g. "[[SUGG") so it never flashes.
  const partial = content.match(/\n?\s*\[\[?[A-Z]*$/)
  return (partial ? content.slice(0, partial.index) : content).trimEnd()
}

function parseSuggestions(content: string): Suggestion[] {
  const full = content.indexOf(SUGG_MARK)
  if (full < 0) return []
  return content.slice(full + SUGG_MARK.length)
    .split('|')
    .map((raw): Suggestion => {
      const s = raw.trim()
      const arrow = s.indexOf('=>')
      if (arrow >= 0) {
        const to = s.slice(arrow + 2).trim()
        return { label: s.slice(0, arrow).trim(), to: to.startsWith('/') ? to : undefined }
      }
      return { label: s }
    })
    .filter(x => x.label)
    .slice(0, 4)
}

function onSuggestion(s: Suggestion) {
  if (s.to) navigateTo(s.to)
  else pick(s.label)
}

const isEmpty = computed(() => messages.value.length === 0)
const lastIsAssistant = computed(() =>
  messages.value.length > 0 && messages.value[messages.value.length - 1]!.role === 'assistant',
)
const suggestions = computed(() => {
  if (isStreaming.value || !lastIsAssistant.value) return []
  const parsed = parseSuggestions(messages.value[messages.value.length - 1]!.content)
  return parsed.length ? parsed : DEFAULT_SUGGESTIONS
})
const showFollowups = computed(() => suggestions.value.length > 0)

function isLast(i: number) { return i === messages.value.length - 1 }

function scrollToBottom() {
  nextTick(() => {
    const el = bodyEl.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  })
}

function autoGrow() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 120)}px`
}

function submit() {
  const text = input.value
  input.value = ''
  nextTick(autoGrow)
  send(text)
}

function pick(text: string) {
  send(text)
  nextTick(() => textareaEl.value?.focus())
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
}

function toggle() {
  open.value = !open.value
  dismissTeaser()
  if (open.value) nextTick(() => textareaEl.value?.focus())
}

function onBodyClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a[data-internal]') as HTMLAnchorElement | null
  if (!a) return
  const href = a.getAttribute('href')
  if (!href) return
  e.preventDefault()
  navigateTo(href)
}

function dismissTeaser() {
  showTeaser.value = false
  if (import.meta.client) sessionStorage.setItem('zm_chat_teaser', '1')
}

onMounted(() => {
  if (import.meta.client && !sessionStorage.getItem('zm_chat_teaser')) {
    setTimeout(() => { if (!open.value) showTeaser.value = true }, 4500)
  }
})

watch(messages, scrollToBottom, { deep: true })
watch(open, (v) => { if (v) scrollToBottom() })
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 text-fg print:hidden">
    <!-- Panel -->
    <Transition name="zm-panel">
      <div
        v-if="open"
        class="glass flex w-[calc(100vw-2.5rem)] max-w-[26rem] flex-col overflow-hidden rounded-3xl border border-hair glow-ring sm:w-[25rem]"
        style="height: min(75vh, 38rem)"
        role="dialog"
        aria-label="Sankar Vema site guide"
      >
        <!-- Header -->
        <header class="relative flex items-center gap-3 border-b border-hair px-4 py-3">
          <div class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/12 to-transparent"></div>
          <span class="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft to-accent-deep text-on-accent glow-ring">
            <Icon name="lucide:hexagon" class="size-5" />
            <span class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-ink-850 bg-accent"></span>
          </span>
          <div class="relative min-w-0 flex-1">
            <p class="font-display text-sm font-semibold leading-tight">Sankar's Guide</p>
            <p class="flex items-center gap-1 text-xs leading-tight text-fg-muted">
              <span class="inline-block size-1.5 rounded-full bg-accent"></span> Online now
            </p>
          </div>
          <button
            v-if="audioSupported"
            type="button"
            class="relative flex size-8 items-center justify-center rounded-lg text-fg-muted transition hover:bg-fg/10 hover:text-fg"
            :class="{ 'text-accent': speaking }"
            :aria-label="audioOn ? 'Mute voice' : 'Unmute voice'"
            @click="toggleAudio"
          >
            <Icon :name="audioOn ? 'lucide:volume-2' : 'lucide:volume-x'" class="size-5" />
          </button>
          <button
            type="button"
            class="relative flex size-8 items-center justify-center rounded-lg text-fg-muted transition hover:bg-fg/10 hover:text-fg"
            aria-label="Close chat"
            @click="toggle"
          >
            <Icon name="lucide:x" class="size-5" />
          </button>
        </header>

        <!-- Messages -->
        <div
          ref="bodyEl"
          class="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          aria-live="polite"
          @click="onBodyClick"
        >
          <!-- Greeting + starters -->
          <template v-if="isEmpty">
            <div class="zm-in flex gap-2.5">
              <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-soft to-accent-deep text-on-accent">
                <Icon name="lucide:hexagon" class="size-4" />
              </span>
              <div class="rounded-2xl rounded-tl-sm border border-hair bg-ink-850/70 px-3.5 py-2.5 text-sm leading-relaxed">
                Hi! I'm Sankar's site guide. Ask about his work, advisory, or how to reach him.
              </div>
            </div>
            <div class="flex flex-col gap-2 pl-10 pt-1">
              <button
                v-for="s in starters"
                :key="s.label"
                type="button"
                class="group inline-flex items-center gap-2 self-start rounded-full border border-hair bg-ink-850/60 px-3.5 py-2 text-xs font-medium transition hover:border-accent/50"
                @click="pick(s.label)"
              >
                <Icon :name="s.icon" class="size-3.5 text-accent" />
                {{ s.label }}
                <Icon name="lucide:arrow-right" class="size-3 text-fg-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </button>
            </div>
          </template>

          <!-- Conversation -->
          <div
            v-for="(m, i) in messages"
            :key="i"
            class="zm-in flex gap-2.5"
            :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <span
              v-if="m.role === 'assistant'"
              class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-soft to-accent-deep text-on-accent"
            >
              <Icon name="lucide:hexagon" class="size-4" />
            </span>

            <div
              class="max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed"
              :class="m.role === 'user'
                ? 'rounded-2xl rounded-tr-sm bg-accent-deep text-on-accent'
                : 'rounded-2xl rounded-tl-sm border border-hair bg-ink-850/70'"
            >
              <span v-if="m.role === 'user'" class="whitespace-pre-wrap break-words">{{ m.content }}</span>

              <span v-else-if="!m.content" class="flex gap-1 py-1">
                <span class="size-1.5 animate-bounce rounded-full bg-fg-faint" style="animation-delay:0s"></span>
                <span class="size-1.5 animate-bounce rounded-full bg-fg-faint" style="animation-delay:0.15s"></span>
                <span class="size-1.5 animate-bounce rounded-full bg-fg-faint" style="animation-delay:0.3s"></span>
              </span>
              <div
                v-else
                class="zm-body break-words"
                :class="{ 'is-streaming': isLast(i) && isStreaming }"
                v-html="renderMarkdown(displayText(m.content))"
              ></div>

              <!-- Replay the spoken summary (explain messages only) -->
              <button
                v-if="m.role === 'assistant' && m.speak && m.content && audioSupported && !(isLast(i) && isStreaming)"
                type="button"
                class="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent-deep transition hover:text-accent dark:text-accent-soft"
                @click="replay(m)"
              >
                <Icon :name="speaking ? 'lucide:volume-2' : 'lucide:rotate-ccw'" class="size-3" />
                {{ speaking ? 'Playing' : 'Replay' }}
              </button>
            </div>
          </div>

          <!-- Suggested next steps (from the model, tap to continue or jump to a page) -->
          <div v-if="showFollowups" class="flex flex-wrap gap-2 pl-10">
            <button
              v-for="(s, si) in suggestions"
              :key="si"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent-deep transition hover:bg-accent/20 dark:text-accent-soft"
              @click="onSuggestion(s)"
            >
              {{ s.label }}
              <Icon :name="s.to ? 'lucide:arrow-up-right' : 'lucide:arrow-right'" class="size-3" />
            </button>
          </div>
        </div>

        <!-- Composer -->
        <div class="border-t border-hair px-3 pb-3 pt-2.5">
          <form class="flex items-end gap-2" @submit.prevent="submit">
            <textarea
              ref="textareaEl"
              v-model="input"
              rows="1"
              :disabled="isStreaming"
              placeholder="Ask about Sankar and his work"
              class="max-h-[120px] min-h-[2.75rem] flex-1 resize-none rounded-xl border border-hair bg-ink-850/70 px-3.5 py-3 text-sm leading-snug outline-none transition placeholder:italic placeholder:text-fg-faint/70 focus:border-accent/60 disabled:opacity-60"
              @input="autoGrow"
              @keydown="onKeydown"
            ></textarea>
            <button
              type="submit"
              :disabled="isStreaming || !input.trim()"
              class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-deep text-on-accent glow-ring transition hover:brightness-110 disabled:opacity-40"
              aria-label="Send message"
            >
              <Icon name="lucide:send" class="size-4" />
            </button>
          </form>
          <p class="mt-2 text-center text-[11px] text-fg-muted">
            Sankar Vema · AI Builder & Architect
          </p>
        </div>
      </div>
    </Transition>

    <!-- Greeting nudge -->
    <Transition name="zm-panel">
      <button
        v-if="showTeaser && !open"
        type="button"
        class="zm-in glass flex max-w-[15rem] items-center gap-2 rounded-2xl rounded-br-sm border border-hair px-3.5 py-2.5 text-left text-sm glow-ring"
        @click="toggle"
      >
        <Icon name="lucide:sparkles" class="size-4 shrink-0 text-accent" />
        <span>Curious about Sankar's work? Ask me.</span>
      </button>
    </Transition>

    <!-- Explain-this-page pill (in the stack so it never overlaps the teaser) -->
    <ChatExplainButton />

    <!-- Launcher -->
    <button
      type="button"
      class="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-on-accent glow-ring transition hover:scale-105 active:scale-95"
      :aria-label="open ? 'Close chat' : 'Open the site guide'"
      @click="toggle"
    >
      <span v-if="!open" class="absolute inset-0 animate-ping rounded-full bg-accent/40" style="animation-duration:2.5s"></span>
      <Icon :name="open ? 'lucide:chevron-down' : 'lucide:message-circle'" class="relative size-6" />
    </button>
  </div>
</template>

<style scoped>
.zm-panel-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.zm-panel-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.zm-panel-enter-from,
.zm-panel-leave-to { opacity: 0; transform: translateY(12px) scale(0.97); }

.zm-in { animation: zmIn 0.4s ease-out both; }
@keyframes zmIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

.zm-body :deep(p + p),
.zm-body :deep(p + ul),
.zm-body :deep(p + ol),
.zm-body :deep(ul + p),
.zm-body :deep(ol + p) { margin-top: 0.5rem; }
.zm-body :deep(li) { margin: 0.1rem 0; }

.zm-body.is-streaming :deep(p:last-child)::after,
.zm-body.is-streaming :deep(li:last-child)::after {
  content: '';
  display: inline-block;
  width: 0.5ch;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: currentColor;
  opacity: 0.55;
  animation: zmCaret 1s steps(2, jump-none) infinite;
}
@keyframes zmCaret { 0%, 50% { opacity: 0.55; } 50.01%, 100% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .zm-in, .animate-ping, .animate-bounce,
  .zm-body.is-streaming :deep(p:last-child)::after { animation: none; }
}
</style>
