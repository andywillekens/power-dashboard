export interface ChartData {
  consumption: number
  generation: number
  label: string
}

export const calculateBarHeight = (value: number, label: string, data: ChartData[]): number => {
  const filteredData = data.filter((d) => d.label === label)
  const values = filteredData.flatMap((d) => [d.consumption, d.generation])
  const max = Math.max(...values, 1)
  const multiplier = label === 'Current' ? 100 : 35
  return (value / max) * multiplier
}

export const getMaxValueForLabel = (label: string, data: ChartData[]): number => {
  const filteredData = data.filter((d) => d.label === label)
  const values = filteredData.flatMap((d) => [d.consumption, d.generation])
  return Math.max(...values, 1)
}
