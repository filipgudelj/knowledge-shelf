// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/icon', '@nuxt/fonts'],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/_reset.scss" as *;
            @use "~/assets/styles/_colors.scss" as *;
            @use "~/assets/styles/_spacings.scss" as *;
            @use "~/assets/styles/_breakpoints.scss" as *;
            @use "~/assets/styles/_typography.scss" as *;
            @use "~/assets/styles/_mixins.scss" as *;
          `,
        },
      },
    },
  },
  compatibilityDate: '2025-05-15',
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
})
