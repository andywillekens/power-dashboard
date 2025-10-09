<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="flex flex-col sm:flex-row sm:items-end-safe select-none">
    <h1 class="-translate-x-2">{{ title }}</h1>
    <p v-if="subtitle">{{ subtitle }}</p>
  </section>
</template>
