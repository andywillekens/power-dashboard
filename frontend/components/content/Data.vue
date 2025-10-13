<script setup lang="ts">
import { formatPowerValue } from '~/utils/formatUtils'

interface Item {
  label: string
  value: number | 'Online' | 'Offline'
  unit?: string
  isGridValue?: boolean
}

defineProps<{
  title: string
  items: Item[]
}>()

const getValueClass = (
  value: number | 'Online' | 'Offline',
  isGridValue: boolean = false
): string => {
  if (typeof value === 'string') {
    return value === 'Online' ? 'text-online' : 'text-offline'
  }

  if (isGridValue) {
    return value >= 1 ? 'text-online' : value < 0 ? 'text-offline' : null
  }

  if (value < 0) {
    return 'text-offline'
  }

  return 'text-dark-200'
}

const formatValue = (
  value: number | 'Online' | 'Offline',
  unit: string = 'W',
  isGridValue: boolean = false
): string => {
  if (isGridValue && typeof value === 'number' && value >= 1) {
    return `+${formatPowerValue(value, unit)}`
  }
  return formatPowerValue(value, unit)
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <h2 class="mb-2 md:mb-4">{{ title }}</h2>
    <div v-for="(item, index) in items" :key="index" class="flex justify-between">
      <p>{{ item.label }}</p>
      <p :class="getValueClass(item.value, item.isGridValue)" class="text-dark-200">
        {{ formatValue(item.value, item.unit, item.isGridValue) }}
      </p>
    </div>
  </div>
</template>
