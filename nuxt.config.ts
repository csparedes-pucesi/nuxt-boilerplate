// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    port: Number(process.env.PORT || '3000'),
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    // public: {
    //   backendUrl: process.env.BACKEND_URL,
    // },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
  ],
  css: ['~/assets/css/main.css', '~/assets/fonts/fonts.css'],
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error',
      ],
    },
  },
  // plugins: ['~/plugins/tankstack-query.ts', '~/plugins/axios.ts'],
})
