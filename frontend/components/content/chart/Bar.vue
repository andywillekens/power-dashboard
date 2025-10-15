<script setup lang="ts">
import { formatValueWithUnit } from '~/utils/formatUtils'

interface Props {
  value: number
  label: string
  type: 'production' | 'consumption'
  height: number
  isVisible: boolean
  isCurrent: boolean
}

const props = defineProps<Props>()

const barClasses = computed(() => {
  return props.type === 'production'
    ? 'bg-gradient-to-r from-teal-500 to-teal-800'
    : 'bg-gradient-to-r from-purple-500 to-purple-800'
})

const labelText = computed(() => {
  return props.type === 'production'
    ? { short: 'Prod.', long: 'Production' }
    : { short: 'Con.', long: 'Consumption' }
})

const barStyle = computed(() => ({
  height: props.isVisible ? `${props.height}%` : '0%',
  transform: props.isVisible
    ? 'translateY(0)'
    : props.type === 'production'
    ? 'translateY(-100%)'
    : 'translateY(100%)'
}))
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div
      class="w-14 sm:w-16 h-60 bg-gradient-to-r from-dark-900/10 to-dark-900/30 flex items-end relative overflow-hidden">
      <div
        :class="barClasses"
        class="w-full transition-all duration-1000 ease-out"
        :style="barStyle"></div>
    </div>
    <span class="text-xs text-dark-400">
      <span class="sm:hidden inline">{{ labelText.short }}</span>
      <span class="hidden sm:inline">{{ labelText.long }}</span>
    </span>
    <span class="text-sm font-medium text-dark-200">
      {{ formatValueWithUnit(value, isCurrent) }}
    </span>
  </div>
</template>
