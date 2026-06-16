<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

useHead({ title: 'Page not found' })
</script>

<template>
  <div class="grid min-h-dvh place-items-center px-6">
    <div class="text-center">
      <p class="eyebrow">{{ error?.statusCode ?? 404 }}</p>
      <h1 class="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-tight md:text-7xl">
        Nothing here.
      </h1>
      <p class="mx-auto mt-4 max-w-md text-[var(--color-fg-muted)]">
        {{ error?.statusMessage || 'The page you were looking for has moved or never existed.' }}
      </p>
      <NuxtLink to="/" class="btn btn-primary mt-8" @click="clearError({ redirect: '/' })">
        Back home
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </NuxtLink>
    </div>
  </div>
</template>
