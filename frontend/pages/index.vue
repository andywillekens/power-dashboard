<script setup lang="ts">
import type { PowerYieldData, PowerUsageData } from '~/server/utils/types'
import { useCountUp } from '~/composables/useCountUp'

const apsystemsData = ref<PowerYieldData | null>(null)
const enecoData = ref<PowerUsageData | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
const isInitialLoad = ref(true)
const isLiveMode = ref(true)
const timeRemaining = ref(300) // 5 minutes

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

const producedCurrent = computed(() => apsystemsData.value?.currentPowerYield || 0)
const consumedCurrent = computed(() => enecoData.value?.currentPowerUsage || 0)
const producedToday = computed(() => apsystemsData.value?.dailyPowerYield || 0)
const consumedToday = computed(() => enecoData.value?.dailyPowerUsage || 0)

const { currentValue: animatedProducedCurrent } = useCountUp(producedCurrent)
const { currentValue: animatedConsumedCurrent } = useCountUp(consumedCurrent)
const { currentValue: animatedProducedToday } = useCountUp(producedToday)
const { currentValue: animatedConsumedToday } = useCountUp(consumedToday)

// Optimized base calculations to avoid repeated isInitialLoad checks
const basePowerCalculations = computed(() => {
  const isInitial = isInitialLoad.value
  return {
    currentProduced: isInitial ? 0 : animatedProducedCurrent.value,
    currentConsumed: isInitial ? 0 : animatedConsumedCurrent.value,
    todayProduced: isInitial ? 0 : animatedProducedToday.value,
    todayConsumed: isInitial ? 0 : animatedConsumedToday.value / 1000
  }
})

const currentPowerData = computed(() => {
  const { currentProduced, currentConsumed } = basePowerCalculations.value
  const grid = currentProduced - currentConsumed
  const gridLabel = grid >= 0 ? 'To grid' : 'From grid'

  return [
    { label: 'Producing', value: currentProduced, unit: 'W' },
    { label: 'Consuming', value: currentConsumed, unit: 'W' },
    { label: gridLabel, value: grid, unit: 'W', isGridValue: true }
  ]
})

const todayPowerData = computed(() => {
  const { todayProduced, todayConsumed } = basePowerCalculations.value
  const grid = todayProduced - todayConsumed
  const gridLabel = grid >= 0 ? 'To grid' : 'From grid'

  return [
    { label: 'Production', value: todayProduced, unit: 'kWh' },
    { label: 'Consumed', value: todayConsumed, unit: 'kWh' },
    { label: gridLabel, value: grid, unit: 'kWh', isGridValue: true }
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
  const { currentProduced, currentConsumed, todayProduced, todayConsumed } =
    basePowerCalculations.value

  return [
    { consumption: currentConsumed, production: currentProduced, label: 'Now' },
    { consumption: todayConsumed, production: todayProduced, label: 'Today' }
  ]
})

// Dynamic page title with current production and consumption
const dynamicTitle = computed(() => {
  const { currentProduced, currentConsumed } = basePowerCalculations.value
  const produced = Math.round(currentProduced)
  const consumed = Math.round(currentConsumed)
  return `↓ ${produced}W ↑ ${consumed}W  | Energy dashboard`
})

// Set the page title in the document head
useHead({
  title: dynamicTitle
})

let refreshInterval: NodeJS.Timeout | null = null
let countdownInterval: NodeJS.Timeout | null = null

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (--timeRemaining.value <= 0) {
      isLiveMode.value = false
      refreshInterval && clearInterval(refreshInterval)
      countdownInterval && clearInterval(countdownInterval)
      refreshInterval = null
      countdownInterval = null
    }
  }, 1000)
}

const handleRefetch = () => {
  // Reset the counter
  timeRemaining.value = 300 // 5 minutes
  isLiveMode.value = true

  // Clear existing intervals
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  // Fetch new data immediately
  fetchData()

  // Restart the intervals
  refreshInterval = setInterval(fetchData, 30000)
  startCountdown()
}

onMounted(() => {
  fetchData()
  refreshInterval = setInterval(fetchData, 30000)
  startCountdown()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <Header
    title="Current"
    subtitle="Energy dashboard"
    :is-live-mode="isLiveMode"
    :on-refetch="handleRefetch" />
  <main class="flex flex-col md:flex-row w-full max-w-screen-xl mx-auto">
    <section class="flex flex-col w-full md:w-10/24 py-4 md:pt-8 md:pr-8 gap-4 md:gap-8">
      <ContentSectionTitle index="01" title="Energy monitoring" />

      <ContentData title="Current power" :items="currentPowerData" />
      <ContentData title="Today’s Total Power" :items="todayPowerData" />
      <ContentData title="API status" :items="apiStatus" />
    </section>

    <div class="w-full md:w-[1px] h-[1px] md:min-h-full bg-dark-900"></div>

    <section class="flex flex-col w-full md:w-14/24 py-4 md:pt-8 md:pl-8 gap-4 md:gap-8">
      <ContentSectionTitle index="02" title="Power visualization" />
      <ContentChart :data="currentPowerVisualData" />
    </section>
  </main>
  <ContentGithubLink
    url="https://github.com/andywillekens/dash"
    prefix="View this project on"
    text="GitHub" />
</template>
