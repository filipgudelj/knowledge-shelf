// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    lazy: false,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
        flag: '/images/en.png',
      },
      {
        code: 'hr',
        name: 'Hrvatski',
        file: 'hr.json',
        flag: '/images/hr.png',
      },
    ],
  },
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/styles/_reset.scss" as *;
            @use "~/assets/styles/_mixins.scss" as *;
            @use "~/assets/styles/_breakpoints.scss" as *;
            @use "~/assets/styles/_spacings.scss" as *;
            @use "~/assets/styles/_borders.scss" as *;
            @use "~/assets/styles/_colors.scss" as *;
            @use "~/assets/styles/_typography.scss" as *;
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
