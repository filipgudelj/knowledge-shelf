export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const authOnlyRoutes = [
    '/cart',
    '/checkout',
    '/checkout/success',
    '/orders',
    '/settings',
  ]

  if (!user.value && authOnlyRoutes.some((route) => to.path.includes(route))) {
    return navigateTo(localePath('/'))
  }
})
