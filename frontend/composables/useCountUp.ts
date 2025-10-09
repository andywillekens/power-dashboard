export const useCountUp = (targetValue: Ref<number>, duration: number = 1000) => {
  const currentValue = ref(0)
  const isAnimating = ref(false)

  watch(
    targetValue,
    (newValue) => {
      if (newValue === 0) return

      isAnimating.value = true
      const startValue = currentValue.value
      const difference = newValue - startValue
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        currentValue.value = Math.round(startValue + difference * easeOutCubic)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          currentValue.value = newValue
          isAnimating.value = false
        }
      }

      requestAnimationFrame(animate)
    },
    { immediate: true }
  )

  return { currentValue, isAnimating }
}
