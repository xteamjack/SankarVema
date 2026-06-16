<script setup lang="ts">
const props = defineProps<{ sections: { id: string; label: string }[] }>()

const active = ref(props.sections[0]?.id ?? '')
let observer: IntersectionObserver | null = null

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.value = entry.target.id
      }
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )
  for (const s of props.sections) {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <nav
    class="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    aria-label="Section navigation"
  >
    <ul class="flex flex-col items-end gap-1">
      <li v-for="s in sections" :key="s.id">
        <button
          type="button"
          class="group flex items-center gap-2.5 py-1.5"
          :aria-current="active === s.id ? 'true' : undefined"
          @click="go(s.id)"
        >
          <span
            class="order-2 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider transition-all duration-300"
            :class="active === s.id
              ? 'text-[var(--color-accent)] opacity-100'
              : 'text-[var(--color-fg-faint)] opacity-0 group-hover:opacity-100'"
          >{{ s.label }}</span>
          <span
            class="order-3 h-2.5 rounded-full transition-all duration-300"
            :class="active === s.id
              ? 'w-2.5 bg-[var(--color-accent)]'
              : 'w-2.5 bg-[var(--color-hair-strong)] group-hover:bg-[var(--color-fg-muted)]'"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>
