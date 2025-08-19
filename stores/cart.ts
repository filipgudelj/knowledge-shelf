import { defineStore } from 'pinia'
import type { CartItem } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const items: Ref<CartItem[]> = ref([])

  const loadCart = async () => {
    if (!user.value) return

    const { data, error } = await supabase
      .from('cart_items')
      .select(
        'book_id, quantity, book:books(id,title,price,cover_url,stock,sale_price)',
      )
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: true })

    if (!error) {
      items.value = (data ?? []) as CartItem[]
    }
  }

  const addToCart = async (bookId: number, quantity = 1) => {
    if (!user.value) return

    await supabase.from('cart_items').upsert(
      {
        user_id: user.value.id,
        book_id: bookId,
        quantity: quantity,
      } as any,
      { onConflict: 'user_id,book_id' },
    )

    await loadCart()
  }

  const updateQuantity = async (bookId: number, quantity: number) => {
    if (!user.value) return

    await (supabase as any)
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('user_id', user.value.id)
      .eq('book_id', bookId)

    await loadCart()
  }

  const removeFromCart = async (bookId: number) => {
    if (!user.value) return

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.value.id)
      .eq('book_id', bookId)

    await loadCart()
  }

  const clearCart = async () => {
    if (!user.value) return

    await supabase.from('cart_items').delete().eq('user_id', user.value.id)
    items.value = []
  }

  const isInCart = (bookId: number): boolean => {
    return items.value.some((i) => i.book_id === bookId)
  }

  const cartCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  return {
    items,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount,
  }
})
