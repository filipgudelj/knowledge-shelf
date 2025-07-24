import { useDark } from '@vueuse/core'

export default defineNuxtRouteMiddleware((to, from) => {
  const themeCookie = useCookie('theme-cookie')
  const isDark = useDark()

  watch(isDark, (newIsDarkValue) => {
    themeCookie.value = newIsDarkValue ? 'dark' : 'light'
  })

  if (import.meta.client) return

  useHead({
    htmlAttrs: {
      class: themeCookie.value === 'dark' ? 'dark' : '',
    },
  })
})
