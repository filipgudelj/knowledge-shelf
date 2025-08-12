import type { Order } from '@/types'

export const useOrdersStore = defineStore('orders', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const orders = ref<Order[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreOrders = ref(true)
  const isLoading = ref(false)

  const resetOrders = () => {
    orders.value = []
    page.value = 0
    hasMoreOrders.value = true
    isLoading.value = false
  }

  const loadOrders = async () => {
    if (isLoading.value) return
    if (!user.value) return

    isLoading.value = true
    resetOrders()
    await loadMoreOrders()
    isLoading.value = false
  }

  const loadMoreOrders = async () => {
    if (!hasMoreOrders.value || isLoading.value) return
    if (!user.value) return

    isLoading.value = true

    const from = page.value * pageSize
    const to = from + pageSize - 1

    const { data: orderRows, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        items:order_items (
          id,
          order_id,
          book_id,
          title_snapshot,
          unit_price,
          quantity,
          line_total
        )
      `,
      )
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error || !orderRows?.length) {
      hasMoreOrders.value = false
      isLoading.value = false
      return
    }

    orders.value.push(...(orderRows as Order[]))
    page.value++
    hasMoreOrders.value = orderRows.length === pageSize
    isLoading.value = false
  }

  return {
    orders,
    isLoading,
    hasMoreOrders,
    page,
    loadOrders,
    loadMoreOrders,
    resetOrders,
  }
})
