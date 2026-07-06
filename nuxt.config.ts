import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-07-05',
  modules: ['vuetify-nuxt-module', '@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [],
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: { defaultTheme: 'light' },
    },
  },
  vite: {
    resolve: {
      alias: {
        cookie: fileURLToPath(new URL('./node_modules/cookie/dist/index.js', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: ['cookie'],
    },
  },
})