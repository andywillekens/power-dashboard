<script setup lang="ts">
import type { PowerYieldData, PowerUsageData } from '~/server/utils/types'
import { useCountUp } from '~/composables/useCountUp'

const apsystemsData = ref<PowerYieldData | null>(null)
const enecoData = ref<PowerUsageData | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isInitialLoad = ref(true)

const fetchData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const [apsystemsResponse, enecoResponse] = await Promise.allSettled([
      $fetch<PowerYieldData>('/api/apsystems/data'),
      $fetch<PowerUsageData>('/api/eneco/data')
    ])

    if (apsystemsResponse.status === 'fulfilled') {
      apsystemsData.value = apsystemsResponse.value
    } else {
      console.error('APSystems API error:', apsystemsResponse.reason)
    }

    if (enecoResponse.status === 'fulfilled') {
      enecoData.value = enecoResponse.value
    } else {
      console.error('Eneco API error:', enecoResponse.reason)
    }

    if (isInitialLoad.value) {
      isInitialLoad.value = false
    }
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to fetch data from APIs'
  } finally {
    isLoading.value = false
  }
}

const generatedCurrent = computed(() => apsystemsData.value?.currentPowerYield || 0)
const consumedCurrent = computed(() => enecoData.value?.currentPowerUsage || 0)
const generatedToday = computed(() => apsystemsData.value?.dailyPowerYield || 0)
const consumedToday = computed(() => enecoData.value?.dailyPowerUsage || 0)

const { currentValue: animatedGeneratedCurrent } = useCountUp(generatedCurrent)
const { currentValue: animatedConsumedCurrent } = useCountUp(consumedCurrent)
const { currentValue: animatedGeneratedToday } = useCountUp(generatedToday)
const { currentValue: animatedConsumedToday } = useCountUp(consumedToday)

// Optimized base calculations to avoid repeated isInitialLoad checks
const basePowerCalculations = computed(() => {
  const isInitial = isInitialLoad.value
  return {
    currentGenerated: isInitial ? 0 : animatedGeneratedCurrent.value,
    currentConsumed: isInitial ? 0 : animatedConsumedCurrent.value,
    todayGenerated: isInitial ? 0 : animatedGeneratedToday.value,
    todayConsumed: isInitial ? 0 : animatedConsumedToday.value / 1000
  }
})

const currentPowerData = computed(() => {
  const { currentGenerated, currentConsumed } = basePowerCalculations.value
  const net = currentGenerated - currentConsumed

  return [
    { label: 'Generated', value: currentGenerated, unit: 'W' },
    { label: 'Consumed', value: currentConsumed, unit: 'W' },
    { label: 'Net', value: net, unit: 'W' }
  ]
})

const todayPowerData = computed(() => {
  const { todayGenerated, todayConsumed } = basePowerCalculations.value
  const net = todayGenerated - todayConsumed

  return [
    { label: 'Generated', value: todayGenerated, unit: 'kWh' },
    { label: 'Consumed', value: todayConsumed, unit: 'kWh' },
    { label: 'Net', value: net, unit: 'kWh' }
  ]
})

const apiStatus = computed(() => {
  const isInitial = isInitialLoad.value

  const getApiStatus = (data: PowerYieldData | PowerUsageData | null) => {
    return isInitial || data?.error ? 'Offline' : 'Online'
  }

  return [
    { label: 'APSystems', value: getApiStatus(apsystemsData.value) as 'Online' | 'Offline' },
    { label: 'Eneco', value: getApiStatus(enecoData.value) as 'Online' | 'Offline' }
  ]
})

const currentPowerVisualData = computed(() => {
  const { currentGenerated, currentConsumed, todayGenerated, todayConsumed } =
    basePowerCalculations.value

  return [
    { consumption: currentConsumed, generation: currentGenerated, label: 'Current' },
    { consumption: todayConsumed, generation: todayGenerated, label: 'Today Total' }
  ]
})

let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  fetchData()
  refreshInterval = setInterval(fetchData, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<template>
  <Header title="Current" subtitle="Energy dashboard" />
  <main class="flex flex-col md:flex-row gap-5 w-full max-w-screen-xl mx-auto">
    <section class="flex flex-col w-full md:w-10/24 pt-5 md:pt-10 md:pr-10 gap-8 md:gap-15">
      <ContentSectionTitle index="01" title="Energy monitoring" />
      <div v-if="error" class="my-15 p-4 bg-red-900/20 border border-red-500/30 rounded">
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
          Retry
        </button>
      </div>

      <ContentData title="Current power" :items="currentPowerData" />
      <ContentData title="Total power today" :items="todayPowerData" />
      <ContentData title="API status" :items="apiStatus" />
    </section>

    <div class="w-full md:w-[1px] h-[1px] md:min-h-full bg-dark-900"></div>

    <section class="flex flex-col w-full md:w-14/24 pt-5 md:pt-10 md:pl-10 gap-5 md:gap-15">
      <ContentSectionTitle index="02" title="Data visualization" />

      <ContentChart :data="currentPowerVisualData" />
    </section>
  </main>
</template>
