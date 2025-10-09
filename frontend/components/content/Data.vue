<script setup lang="ts">
import { formatPowerValue } from '~/utils/formatUtils'

interface Item {
  label: string
  value: number | 'Online' | 'Offline'
  unit?: string
}

defineProps<{
  title: string
  items: Item[]
}>()

const getValueClass = (value: number | 'Online' | 'Offline'): string => {
  if (typeof value === 'string') {
    return value === 'Online' ? 'text-online' : 'text-offline'
  }

  if (value < 0) {
    return 'text-offline'
  }

  return 'text-dark-200'
}

const formatValue = (value: number | 'Online' | 'Offline', unit: string = 'W'): string => {
  return formatPowerValue(value, unit)
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <h2 class="mb-5">{{ title }}</h2>
    <div v-for="(item, index) in items" :key="index" class="flex justify-between">
      <p>{{ item.label }}</p>
      <p :class="getValueClass(item.value)" class="text-dark-200">
        {{ formatValue(item.value, item.unit) }}
      </p>
    </div>
  </div>
</template>
