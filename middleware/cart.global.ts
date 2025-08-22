export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath()

  if (to.path === localePath('/checkout/success')) return

  const cartStore = useCartStore()
  await cartStore.loadCart()
})
