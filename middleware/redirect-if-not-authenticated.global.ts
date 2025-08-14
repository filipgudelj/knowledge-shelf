export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const guestOnlyRoutes = [
    '/cart',
    '/checkout',
    '/checkout/success',
    '/orders',
    '/settings',
  ]

  if (!user.value && guestOnlyRoutes.some((route) => to.path.includes(route))) {
    return navigateTo(localePath('/'))
  }
})
