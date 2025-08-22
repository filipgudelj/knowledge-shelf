import { useDark } from '@vueuse/core'

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<'light' | 'dark'>('theme-cookie', {
    path: '/',
    sameSite: 'lax',
  })

  const isDark = useDark()

  const write = (val: boolean) => {
    themeCookie.value = val ? 'dark' : 'light'
  }

  write(isDark.value)

  watch(isDark, (newIsDark) => write(newIsDark), { immediate: false })
})
