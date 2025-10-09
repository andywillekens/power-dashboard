<script setup lang="ts">
import type { ChartData } from '~/utils/chartUtils'
import { calculateBarHeight } from '~/utils/chartUtils'
import { formatValueWithUnit } from '~/utils/formatUtils'

const props = defineProps<{
  data?: ChartData[]
}>()

const chartData = computed(() => {
  if (props.data && props.data.length > 0) {
    return props.data
  }
  return [
    { consumption: 0, production: 0, label: 'Current' },
    { consumption: 0, production: 0, label: 'Today' }
  ]
})

const getBarHeight = (value: number, label: string) => {
  return calculateBarHeight(value, label, chartData.value)
}

const isVisible = ref(false)

onMounted(() => {
  nextTick(() => {
    isVisible.value = true
  })
})
</script>

<template>
  <div
    class="w-full h-auto relative overflow-hidden border border-dark-900 p-10 flex flex-col gap-8 perspective-200">
    <div
      class="w-[calc(200%)] h-[calc(200%)] bg-pattern absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 transform-3d"></div>

    <div class="z-2 relative flex justify-center gap-8">
      <div v-for="(item, index) in chartData" :key="index" class="flex flex-col items-center gap-4">
        <div class="flex gap-4 items-end">
          <!-- Power Consumption Bar -->
          <div class="flex flex-col items-center gap-2">
            <div class="w-14 sm:w-16 h-60 bg-dark-900/30 flex items-end relative overflow-hidden">
              <div
                class="w-full bg-purple-500 transition-all duration-1000 ease-out"
                :style="{
                  height: isVisible ? `${getBarHeight(item.consumption, item.label)}%` : '0%',
                  transform: isVisible ? 'translateY(0)' : 'translateY(100%)'
                }"></div>
            </div>
            <span class="text-xs text-dark-400">
              Con<span class="inline sm:hidden">.</span>
              <span class="hidden sm:inline">sumption</span>
            </span>
            <span class="text-sm font-medium text-dark-200">
              {{ formatValueWithUnit(item.consumption, item.label === 'Current') }}
            </span>
          </div>

          <!-- Power Production Bar -->
          <div class="flex flex-col items-center gap-2">
            <div class="w-14 sm:w-16 h-60 bg-dark-900/30 flex items-end relative overflow-hidden">
              <div
                class="w-full bg-teal-500 transition-all duration-1000 ease-out"
                :style="{
                  height: isVisible ? `${getBarHeight(item.production, item.label)}%` : '0%',
                  transform: isVisible ? 'translateY(0)' : 'translateY(-100%)'
                }"></div>
            </div>
            <span class="text-xs text-dark-400">
              Prod<span class="inline sm:hidden">.</span>
              <span class="hidden sm:inline">uction</span>
            </span>
            <span class="text-sm font-medium text-dark-200">
              {{ formatValueWithUnit(item.production, item.label === 'Current') }}
            </span>
          </div>
        </div>

        <p class="text-sm text-dark-400 text-center">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>
