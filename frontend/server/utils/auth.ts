import axios from 'axios'
import { CookieJar } from 'tough-cookie'
import { wrapper } from 'axios-cookiejar-support'
import type { APSystemsAuthResult, EnecoAuthResult } from './types'

export const createAxiosInstance = () => {
  const cookieJar = new CookieJar()
  return wrapper(
    axios.create({
      jar: cookieJar,
      withCredentials: true,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })
  )
}

export const handleAPSystemsLogin = async (
  userId: string,
  axiosInstance: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Initial login request
    const loginRes = await axiosInstance.get(
      `https://apsystemsema.com/ema/intoDemoUser.action?id=${userId}&locale=en_US`,
      { maxRedirects: 0, validateStatus: () => true }
    )

    // Follow redirect if needed
    if (loginRes.status === 302) {
      const location = loginRes.headers.location
      if (location) {
        const redirectRes = await axiosInstance.get(location, {
          headers: {
            Referer: `https://apsystemsema.com/ema/intoDemoUser.action?id=${userId}&locale=en_US`
          },
          maxRedirects: 0,
          validateStatus: () => true
        })

        if (redirectRes.status >= 400) {
          return {
            success: false,
            error: `Login failed: ${redirectRes.status}`
          }
        }
      }
    } else if (loginRes.status >= 400) {
      return { success: false, error: `Login failed: ${loginRes.status}` }
    }

    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: `Authentication failed: ${error?.message || String(error)}`
    }
  }
}

export const authenticateAPSystems = async (userId: string): Promise<APSystemsAuthResult> => {
  if (!userId) {
    return {
      axiosInstance: null,
      success: false,
      error: 'APSystems User ID not configured'
    }
  }

  try {
    const axiosInstance = createAxiosInstance()
    const loginResult = await handleAPSystemsLogin(userId, axiosInstance)

    if (!loginResult.success) {
      return {
        axiosInstance,
        success: false,
        error: loginResult.error
      }
    }

    return { axiosInstance, success: true }
  } catch (error: any) {
    return {
      axiosInstance: null,
      success: false,
      error: `Authentication failed: ${error?.message || String(error)}`
    }
  }
}

export const authenticateEneco = async (accessToken: string): Promise<EnecoAuthResult> => {
  if (!accessToken) {
    return {
      success: false,
      error: 'Eneco access token not configured'
    }
  }

  try {
    const response = await fetch('https://api.toon.eu/toon/v3/agreements', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      agreementId: data[0]?.agreementId,
      displayCommonName: data[0]?.displayCommonName
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Authentication failed: ${error?.message || String(error)}`
    }
  }
}
