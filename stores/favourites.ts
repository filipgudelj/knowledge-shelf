import { defineStore } from 'pinia'
import type { Book } from '@/types'

export const useFavouritesStore = defineStore('favourites', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const {
    getAllFavouritesFromCookie,
    addFavouriteToCookie,
    removeFavouriteFromCookie,
    isBookFavouriteInCookie,
  } = useFavouritesCookie()

  const favourites = ref<Book[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreFavourites = ref(true)
  const isLoading = ref(false)
  let allFavouriteIds: number[] = []

  const loadFavourites = async () => {
    isLoading.value = true
    resetFavourites()

    if (user.value) {
      const { data } = (await supabase
        .from('favourites')
        .select('book_id')
        .eq('user_id', user.value.id)) as unknown as {
        data: { book_id: number }[]
      }

      allFavouriteIds = data?.map((row) => row.book_id) ?? []
    } else {
      allFavouriteIds = getAllFavouritesFromCookie()
    }

    hasMoreFavourites.value = allFavouriteIds.length > 0
    await loadMoreFavourites()

    isLoading.value = false
  }

  const loadMoreFavourites = async () => {
    if (!hasMoreFavourites.value || isLoading.value) return

    isLoading.value = true

    const start = page.value * pageSize
    const end = start + pageSize
    const nextIds = allFavouriteIds.slice(start, end)

    if (nextIds.length === 0) {
      hasMoreFavourites.value = false
      isLoading.value = false
      return
    }

    const { data } = (await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .in('id', nextIds)) as unknown as {
      data: Book[] | null
    }

    if (data) {
      const sorted = nextIds
        .map((id) => data.find((book) => book.id === id))
        .filter((b): b is Book => !!b)

      favourites.value.push(...sorted)
    }

    page.value++
    if (page.value * pageSize >= allFavouriteIds.length) {
      hasMoreFavourites.value = false
    }

    isLoading.value = false
  }

  const isBookFavourite = (bookId: number) => {
    if (user.value) {
      return allFavouriteIds.includes(bookId)
    } else {
      return isBookFavouriteInCookie(bookId)
    }
  }

  const addFavourite = async (bookId: number) => {
    if (user.value) {
      await supabase.from('favourites').insert({
        user_id: user.value.id,
        book_id: bookId,
      } as any)
    } else {
      addFavouriteToCookie(bookId)
    }

    allFavouriteIds.unshift(bookId)
    resetFavourites()
    await loadMoreFavourites()
  }

  const removeFavourite = async (bookId: number) => {
    if (user.value) {
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('book_id', bookId)
    } else {
      removeFavouriteFromCookie(bookId)
    }

    allFavouriteIds = allFavouriteIds.filter((id) => id !== bookId)
    favourites.value = favourites.value.filter((book) => book.id !== bookId)
    hasMoreFavourites.value = allFavouriteIds.length > favourites.value.length
  }

  const resetFavourites = () => {
    favourites.value = []
    page.value = 0
    hasMoreFavourites.value = true
    isLoading.value = false
    allFavouriteIds = []
  }

  return {
    favourites,
    isLoading,
    hasMoreFavourites,
    page,
    loadFavourites,
    loadMoreFavourites,
    isBookFavourite,
    addFavourite,
    removeFavourite,
    resetFavourites,
  }
})
