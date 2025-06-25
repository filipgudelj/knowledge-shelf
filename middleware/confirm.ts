export default defineNuxtRouteMiddleware((to, from) => {
  // STATE
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  // REDIRECT
  const rawPath = to.path.replace(/^\/[a-z]{2}(\/|$)/, '/')

  if (rawPath === '/auth/confirm') {
    if (!user.value) {
      return navigateTo(localePath('/'))
    }
  }
})
