import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/fonts', '@nuxt/icon'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    apiUrl: process.env.API_URL,
    apSystemsUserId: process.env.APSYSTEMS_USER_ID,
    toonAccessToken: process.env.TOON_ACCESS_TOKEN,
    public: {
      apiUrl: process.env.API_URL
    }
  }
})
