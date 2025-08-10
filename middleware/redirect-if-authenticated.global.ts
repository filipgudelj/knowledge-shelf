export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const guestOnlyRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/confirm',
  ]

  if (user.value && guestOnlyRoutes.some((route) => to.path.includes(route))) {
    return navigateTo(localePath('/'))
  }
})
