import {
  createUsageErrorResponse,
  handleUsageApiError,
  createUsageSuccessResponse,
  makeAuthenticatedRequest
} from '../../utils/api'
import type { EnecoAuthResult, PowerUsageData } from '../../utils/types'

export default defineEventHandler(async (event): Promise<PowerUsageData> => {
  const config = useRuntimeConfig(event)
  const accessToken = config.toonAccessToken

  const authResponse: EnecoAuthResult = await $fetch('/api/eneco/auth')

  if (!authResponse.success || !authResponse.agreementId || !authResponse.displayCommonName) {
    return createUsageErrorResponse(authResponse.error || 'Authentication failed')
  }

  const { agreementId, displayCommonName } = authResponse

  try {
    const result = await makeAuthenticatedRequest(
      `https://api.toon.eu/toon/v3/${agreementId}/status`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-CommonName': displayCommonName,
          'X-Agreement-ID': agreementId
        }
      }
    )

    if (!result.success) {
      return createUsageErrorResponse(result.error || 'Request failed')
    }

    const userData = result.data
    const powerUsage = userData.powerUsage

    return createUsageSuccessResponse({
      currentPowerUsage: powerUsage.value || 0,
      dailyPowerUsage: (powerUsage.dayUsage || 0) + (powerUsage.dayLowUsage || 0)
    })
  } catch (error) {
    return handleUsageApiError(error)
  }
})
