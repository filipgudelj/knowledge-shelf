export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) return

  const themeCookie = useCookie<'light' | 'dark'>('theme-cookie')

  useHead({
    htmlAttrs: { class: themeCookie.value === 'dark' ? 'dark' : '' },
  })
})
