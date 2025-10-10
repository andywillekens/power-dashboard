<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  isLiveMode?: boolean
  onRefetch?: () => void
}>()
</script>

<template>
  <section class="flex flex-row justify-between items-end">
    <div class="flex flex-col sm:flex-row sm:items-end-safe select-none">
      <h1 class="-translate-x-2">{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <button
      v-if="!isLiveMode && onRefetch"
      @click="onRefetch"
      class="bg-dark-900 text-dark-200 px-4 py-2 rounded-md active:bg-dark-700 hover:bg-dark-800 transition-colors cursor-pointer">
      Re-fetch
    </button>
  </section>
</template>
