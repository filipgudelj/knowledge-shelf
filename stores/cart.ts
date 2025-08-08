import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const items = ref<any[]>([])

  const loadCart = async () => {
    if (!user.value) return

    const { data, error } = await supabase
      .from('cart_items')
      .select('book_id, quantity, book:books(id,title,price,cover_url,stock)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: true })

    if (!error) items.value = data
  }

  const addToCart = async (bookId: number, qty = 1) => {
    if (!user.value) return

    await supabase.from('cart_items').upsert(
      {
        user_id: user.value.id,
        book_id: bookId,
        quantity: qty,
      } as any,
      { onConflict: 'user_id,book_id' },
    )

    await loadCart()
  }

  const updateQuantity = async (bookId: number, qty: number) => {
    if (!user.value) return

    await (supabase as any)
      .from('cart_items')
      .update({ quantity: qty })
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

  return {
    items,
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})
