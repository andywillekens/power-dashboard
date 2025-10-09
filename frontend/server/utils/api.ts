import type { PowerData, PowerYieldData, PowerUsageData, ApiResponse } from './types'

export const createErrorResponse = (
  error: string,
  defaultData: Partial<PowerData> = {}
): PowerData => ({
  currentPowerYield: 0,
  dailyPowerYield: 0,
  currentPowerUsage: 0,
  dailyPowerUsage: 0,
  raw: {},
  error,
  ...defaultData
})

export const handleApiError = (error: any, defaultData: Partial<PowerData> = {}): PowerData => {
  const errorMessage = error?.message || String(error)
  return createErrorResponse(`Request failed: ${errorMessage}`, defaultData)
}

export const createSuccessResponse = (data: Partial<PowerData>): PowerData => ({
  currentPowerYield: 0,
  dailyPowerYield: 0,
  currentPowerUsage: 0,
  dailyPowerUsage: 0,
  raw: {},
  ...data
})

export const createYieldErrorResponse = (
  error: string,
  defaultData: Partial<PowerYieldData> = {}
): PowerYieldData => ({
  currentPowerYield: 0,
  dailyPowerYield: 0,
  raw: {},
  error,
  ...defaultData
})

export const createUsageErrorResponse = (
  error: string,
  defaultData: Partial<PowerUsageData> = {}
): PowerUsageData => ({
  currentPowerUsage: 0,
  dailyPowerUsage: 0,
  raw: {},
  error,
  ...defaultData
})

export const handleYieldApiError = (
  error: any,
  defaultData: Partial<PowerYieldData> = {}
): PowerYieldData => {
  const errorMessage = error?.message || String(error)
  return createYieldErrorResponse(`Request failed: ${errorMessage}`, defaultData)
}

export const handleUsageApiError = (
  error: any,
  defaultData: Partial<PowerUsageData> = {}
): PowerUsageData => {
  const errorMessage = error?.message || String(error)
  return createUsageErrorResponse(`Request failed: ${errorMessage}`, defaultData)
}

export const createYieldSuccessResponse = (data: Partial<PowerYieldData>): PowerYieldData => ({
  currentPowerYield: 0,
  dailyPowerYield: 0,
  raw: {},
  ...data
})

export const createUsageSuccessResponse = (data: Partial<PowerUsageData>): PowerUsageData => ({
  currentPowerUsage: 0,
  dailyPowerUsage: 0,
  raw: {},
  ...data
})

export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error: any) {
    return {
      error: error?.message || String(error),
      success: false
    }
  }
}
