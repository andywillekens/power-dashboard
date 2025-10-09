export const formatPowerValue = (
  value: number | 'Online' | 'Offline',
  unit: string = 'W'
): string => {
  if (typeof value === 'string') return value
  if (unit === 'kWh') return `${value.toFixed(2)} kWh`
  return `${value} ${unit}`
}

export const formatValueWithUnit = (value: number, isCurrent: boolean): string => {
  if (isCurrent) {
    return `${value}W`
  }
  return `${value.toFixed(2)}kWh`
}
