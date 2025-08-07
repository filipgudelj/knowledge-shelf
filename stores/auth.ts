import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const localePath = useLocalePath()
  const { getAllFavouritesFromCookie, clearAllFavouritesFromCookie } =
    useFavouritesCookie()

  const register = async (email: string, password: string) => {
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `http://localhost:3000${localePath('/auth/confirm')}`,
      },
    })

    return response
  }

  const login = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    const user = response.data.user

    if (user) {
      await migrateAnonymousFavourites(user.id)
    }

    return response
  }

  const migrateAnonymousFavourites = async (userId: string) => {
    const cookieFavouriteIds = getAllFavouritesFromCookie()

    if (!cookieFavouriteIds.length) return

    const { data: existingFavourites } = (await supabase
      .from('favourites')
      .select('book_id')
      .eq('user_id', userId)) as unknown as { data: { book_id: number }[] }

    const existingFavouriteIds = new Set(
      existingFavourites?.map((f) => f.book_id) ?? [],
    )

    const newFavouriteIds = cookieFavouriteIds.filter(
      (id) => !existingFavouriteIds.has(id),
    )

    if (newFavouriteIds.length > 0) {
      const inserts = newFavouriteIds.map((bookId) => ({
        user_id: userId,
        book_id: bookId,
      }))

      await supabase.from('favourites').insert(inserts as any)
    }

    clearAllFavouritesFromCookie()
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const sendPasswordResetLink = async (email: string) => {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `http://localhost:3000${localePath('/auth/reset-password')}`,
    })

    return response
  }

  const updateUserPassword = async (newPassword: string) => {
    const response = await supabase.auth.updateUser({ password: newPassword })

    return response
  }

  return { register, login, logout, sendPasswordResetLink, updateUserPassword }
})
