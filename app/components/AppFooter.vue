<script setup lang="ts">
const { data: profile } = await useProfile()

const year = 2026 // build-time constant; the site footer year
const nav = [
  { label: 'Work', to: '/work' },
  { label: 'Assignments', to: '/assignments' },
  { label: 'Journey', to: '/journey' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Contributions', to: '/contributions' },
  { label: 'About', to: '/about' },
  { label: 'Writing', to: '/writing' },
  { label: 'Advisory', to: '/advisory' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <footer class="mt-24 border-t border-[var(--color-hair)]">
    <div class="wrap py-14">
      <div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div class="max-w-sm">
          <p class="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            Let's build something that ships.
          </p>
          <p class="mt-3 text-sm text-[var(--color-fg-muted)]">
            {{ profile?.role }}<span v-if="profile?.location"> · {{ profile?.location }}</span>
          </p>
          <div class="mt-5">
            <SocialLinks v-if="profile" :contact="profile.contact" />
          </div>
        </div>

        <nav class="flex flex-col gap-3">
          <span class="eyebrow mb-1">Navigate</span>
          <NuxtLink
            v-for="l in nav"
            :key="l.to"
            :to="l.to"
            class="link-underline w-fit text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >{{ l.label }}</NuxtLink>
        </nav>
      </div>

      <div class="mt-12 flex flex-col gap-2 border-t border-[var(--color-hair)] pt-6 text-xs text-[var(--color-fg-faint)] sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} {{ profile?.name ?? 'Sankar Vema' }}. All rights reserved.</p>
        <p class="font-[family-name:var(--font-mono)]">Built with Nuxt · hosted on GitHub Pages</p>
      </div>
    </div>
  </footer>
</template>
