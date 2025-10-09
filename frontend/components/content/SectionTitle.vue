<script setup lang="ts">
defineProps<{
  index: string
  title: string
}>()
</script>

<template>
  <div class="flex items-center justify-between gap-2 select-none">
    <span>{{ index }}</span>
    <p>{{ title }}</p>
  </div>
</template>
