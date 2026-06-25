<script setup lang="ts">
// Prefix static public assets with the app base URL so they resolve under the
// GitHub Pages project sub-path (e.g. /SankarVema/favicon.svg) rather than the
// domain root, where they would 404. baseURL already has a trailing slash.
const { app } = useRuntimeConfig()
useHead({
  link: [{ rel: 'icon', type: 'image/svg+xml', href: `${app.baseURL}favicon.svg` }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
