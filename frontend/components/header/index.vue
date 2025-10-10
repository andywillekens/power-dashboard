<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  isLiveMode?: boolean
  onRefetch?: () => void
}>()
</script>

<template>
  <header
    class="flex flex-col gap-4 md:gap-8 py-4 md:py-8 border-b border-dark-900 max-w-screen-xl w-full mx-auto">
    <HeaderColorBlocks :is-live-mode="isLiveMode" />
    <HeaderHeading
      :title="title"
      :subtitle="subtitle"
      :is-live-mode="isLiveMode"
      :on-refetch="onRefetch" />
  </header>
</template>
