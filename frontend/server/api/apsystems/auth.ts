import type { APSystemsAuthResult } from '../../utils/types'
import { authenticateAPSystems } from '../../utils/auth'

export default defineEventHandler(async (event: any): Promise<APSystemsAuthResult> => {
  const config = useRuntimeConfig(event)
  const userId = config.apSystemsUserId

  return await authenticateAPSystems(userId)
})
