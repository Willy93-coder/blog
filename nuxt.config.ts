// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/test-utils/module"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
  routeRules: {
    "/studio/**": { ssr: false },
  },
});
