import type { H3Event } from 'h3'
import authHandler from './auth'
import type { APSystemsAuthResult, PowerYieldData } from '../../utils/types'
import {
  createYieldErrorResponse,
  handleYieldApiError,
  createYieldSuccessResponse
} from '../../utils/api'

const DEFAULT_ERROR_RESPONSE = {
  duration: 0,
  lastPower: 0,
  today: 0,
  co2: 0,
  lifetime: 0,
  ecuSign: '',
  meterFlag: 0
}

export default defineEventHandler(async (event: H3Event): Promise<PowerYieldData> => {
  const authResult: APSystemsAuthResult = await authHandler(event)

  if (!authResult.success) {
    return createYieldErrorResponse(authResult.error || 'Authentication failed', {
      raw: DEFAULT_ERROR_RESPONSE
    })
  }

  try {
    const response = await authResult.axiosInstance.post(
      'https://apsystemsema.com/ema/ajax/getDashboardApiAjax/getDashboardProductionInfoAjax',
      '',
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0',
          Referer:
            'https://apsystemsema.com/ema/security/optmainmenu/intoLargeDashboard.action?language=en_US',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const data = response.data

    return createYieldSuccessResponse({
      currentPowerYield: Number(data.lastPower) || 0,
      dailyPowerYield: parseFloat(data.today) || 0,
      raw: data
    })
  } catch (error: any) {
    return handleYieldApiError(error, { raw: DEFAULT_ERROR_RESPONSE })
  }
})
