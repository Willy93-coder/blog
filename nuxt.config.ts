// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/test-utils/module', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
  routeRules: {
    '/studio/**': { ssr: false },
  },
  app: {
    head: {
      title: 'GMV-Blog',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-light.png', media: '(prefers-color-scheme: light)' },
        { rel: 'icon', type: 'image/png', href: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },
});
