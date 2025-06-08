// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['vuetify/lib/styles/main.css', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },
  app: {
    head: {
      title: 'Newsletter Manager',
      meta: [
        { name: 'description', content: 'A modern newsletter management system' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})