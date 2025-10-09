<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="flex flex-col gap-5 pb-5 border-b border-dark-900 max-w-screen-xl w-full mx-auto">
    <HeaderColorBlocks />
    <HeaderHeading :title="title" :subtitle="subtitle" />
  </header>
</template>
