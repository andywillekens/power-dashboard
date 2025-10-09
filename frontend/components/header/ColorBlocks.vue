<script setup lang="ts">
defineProps<{
  isLiveMode?: boolean
}>()
</script>

<template>
  <section class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 border-dark-200 border"></div>
      <div class="w-6 h-6 bg-dark-200 border-dark-200 border"></div>
    </div>
    <div>
      Mode:
      <span :class="isLiveMode ? 'text-online' : 'text-offline'">{{
        isLiveMode ? 'Live' : 'Inactive'
      }}</span>
    </div>
  </section>
</template>
