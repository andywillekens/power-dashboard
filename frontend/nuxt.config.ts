import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/fonts', '@nuxt/icon'],
  vite: { plugins: [tailwindcss()] },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔋</text></svg>'
        }
      ]
    }
  },
  runtimeConfig: {
    apiUrl: process.env.API_URL,
    apSystemsUserId: process.env.APSYSTEMS_USER_ID,
    toonAccessToken: process.env.TOON_ACCESS_TOKEN,
    public: {
      apiUrl: process.env.API_URL
    }
  }
})
