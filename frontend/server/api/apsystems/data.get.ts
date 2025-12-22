import type { H3Event } from 'h3'
import authHandler from './auth'
import type { APSystemsAuthResult, PowerYieldData } from '../../utils/types'
import {
  createYieldErrorResponse,
  handleYieldApiError,
  createYieldSuccessResponse
} from '../../utils/api'

export default defineEventHandler(async (event: H3Event): Promise<PowerYieldData> => {
  const authResult: APSystemsAuthResult = await authHandler(event)

  if (!authResult.success) {
    return createYieldErrorResponse(authResult.error || 'Authentication failed')
  }
  try {
    const response = await authResult.axiosInstance.post(
      'https://apsystemsema.com/ema/ajax/getDashboardApiAjax/getDashboardProductionInfoAjax',
      '',
      {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          Referer:
            'https://apsystemsema.com/ema/security/optmainmenu/intoLargeDashboard.action?language=en_US',
          Origin: 'https://apsystemsema.com',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin'
        },
        validateStatus: (status: number) => status < 500
      }
    )

    if (response.status === 403 || response.status >= 400) {
      console.error('API request failed:', response.status, response.data)
      return createYieldErrorResponse(
        `API request failed with status ${response.status}: ${JSON.stringify(response.data)}`
      )
    }

    const data = response.data

    return createYieldSuccessResponse({
      currentPowerYield: Number(data.lastPower) || 0,
      dailyPowerYield: parseFloat(data.today) || 0
    })
  } catch (error: any) {
    return handleYieldApiError(error)
  }
})
