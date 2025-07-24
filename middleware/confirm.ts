export default defineNuxtRouteMiddleware((to, from) => {
  const localePath = useLocalePath()

  const { code, error } = to.query as Record<string, string>

  if (!code && !error) {
    return navigateTo(localePath('/'))
  }
})
