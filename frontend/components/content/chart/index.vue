<script setup lang="ts">
import type { ChartData } from '~/utils/chartUtils'
import { calculateBarHeight } from '~/utils/chartUtils'

const props = defineProps<{
  data?: ChartData[]
}>()

const chartData = computed(() => {
  if (props.data && props.data.length > 0) {
    return props.data
  }
  return [
    { consumption: 0, production: 0, label: 'Now' },
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
          <ContentChartBar
            :value="item.production"
            :label="item.label"
            type="production"
            :height="getBarHeight(item.production, item.label)"
            :is-visible="isVisible"
            :is-current="item.label === 'Now'" />
          <ContentChartBar
            :value="item.consumption"
            :label="item.label"
            type="consumption"
            :height="getBarHeight(item.consumption, item.label)"
            :is-visible="isVisible"
            :is-current="item.label === 'Now'" />
        </div>

        <p class="text-sm text-dark-400 text-center">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>
