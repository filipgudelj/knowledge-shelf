// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    'nuxt-charts',
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
            @use "~/assets/styles/_base.scss" as *;
            @use "~/assets/styles/_skeleton.scss" as *;
            @use "~/assets/styles/_charts.scss" as *;
          `,
        },
      },
    },
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SK_KEY,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PK_KEY,
    },
  },
  compatibilityDate: '2025-05-15',
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirect: false,
  },
})
