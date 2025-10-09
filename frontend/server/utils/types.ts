export interface PowerData {
  currentPowerYield?: number
  currentPowerUsage?: number
  dailyPowerYield?: number
  dailyPowerUsage?: number
  error?: string
}

export interface PowerYieldData {
  currentPowerYield: number
  dailyPowerYield: number
  error?: string
}

export interface PowerUsageData {
  currentPowerUsage: number
  dailyPowerUsage: number
  error?: string
}

export interface AuthResult {
  success: boolean
  error?: string
}

export interface APSystemsAuthResult extends AuthResult {
  axiosInstance: any
}

export interface EnecoAuthResult extends AuthResult {
  agreementId?: string
  displayCommonName?: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}
