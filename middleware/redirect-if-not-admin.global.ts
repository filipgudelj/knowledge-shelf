export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const adminOnlyRoutes = ['/admin/dashboard']

  if (
    user.value?.app_metadata.role !== 'admin' &&
    adminOnlyRoutes.some((route) => to.path.includes(route))
  ) {
    return navigateTo(localePath('/'))
  }
})
