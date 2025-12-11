<script setup lang="ts">
defineProps<{
  url: string
  text: string
  prefix?: string
}>()
</script>

<template>
  <div>
    <span v-if="prefix">{{ prefix }}{{ ' ' }}</span>
    <a
      :href="url"
      target="_blank"
      class="text-dark-200 cursor-pointer hover:text-purple-500 underline"
      >{{ text }}</a
    >
  </div>
</template>
