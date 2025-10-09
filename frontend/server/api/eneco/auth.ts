import type { EnecoAuthResult } from '../../utils/types'
import { authenticateEneco } from '../../utils/auth'

export default defineEventHandler(async (event): Promise<EnecoAuthResult> => {
  const config = useRuntimeConfig(event)
  const accessToken = config.toonAccessToken

  return await authenticateEneco(accessToken)
})
