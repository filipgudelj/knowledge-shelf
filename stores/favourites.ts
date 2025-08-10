import { defineStore } from 'pinia'
import type { Book } from '@/types'

export const useFavouritesStore = defineStore('favourites', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const {
    getAllFavouritesFromCookie,
    addFavouriteToCookie,
    removeFavouriteFromCookie,
  } = useFavouritesCookie()

  const favourites = ref<Book[]>([])
  const allFavouriteIds = ref<number[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreFavourites = ref(true)
  const isLoading = ref(false)
  const favouriteIdSet = computed(() => new Set(allFavouriteIds.value))

  const resetFavourites = (clearIds = false) => {
    favourites.value = []
    page.value = 0
    hasMoreFavourites.value = true
    isLoading.value = false
    if (clearIds) allFavouriteIds.value = []
  }

  const loadFavourites = async () => {
    if (isLoading.value) return
    isLoading.value = true
    resetFavourites(true)

    if (user.value) {
      const { data, error } = (await supabase
        .from('favourites')
        .select('book_id')
        .eq('user_id', user.value.id)) as unknown as {
        data: { book_id: number }[]
        error: any
      }

      allFavouriteIds.value = !error ? (data ?? []).map((r) => r.book_id) : []
    } else {
      allFavouriteIds.value = getAllFavouritesFromCookie()
    }

    hasMoreFavourites.value = allFavouriteIds.value.length > 0
    await loadMoreFavourites()
    isLoading.value = false
  }

  const loadMoreFavourites = async () => {
    if (!hasMoreFavourites.value || isLoading.value) return
    isLoading.value = true

    const start = page.value * pageSize
    const end = start + pageSize
    const nextIds = allFavouriteIds.value.slice(start, end)

    if (nextIds.length === 0) {
      hasMoreFavourites.value = false
      isLoading.value = false
      return
    }

    const { data, error } = (await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .in('id', nextIds as number[])) as unknown as {
      data: Book[] | null
      error: any
    }

    if (!error && data) {
      const sorted = nextIds
        .map((id) => data.find((b) => b.id === id) as Book | undefined)
        .filter((b): b is Book => !!b)
      favourites.value.push(...sorted)
    }

    page.value++
    hasMoreFavourites.value =
      page.value * pageSize < allFavouriteIds.value.length
    isLoading.value = false
  }

  const isBookFavourite = (bookId: number) => {
    return favouriteIdSet.value.has(bookId)
  }

  const addFavourite = async (bookId: number) => {
    if (favouriteIdSet.value.has(bookId)) return

    if (user.value) {
      await supabase.from('favourites').insert({
        user_id: user.value.id,
        book_id: bookId,
      } as any)
    } else {
      addFavouriteToCookie(bookId)
    }

    allFavouriteIds.value = [bookId, ...allFavouriteIds.value]
    favourites.value = []
    page.value = 0
    hasMoreFavourites.value = allFavouriteIds.value.length > 0
    await loadMoreFavourites()
  }

  const removeFavourite = async (bookId: number) => {
    if (!favouriteIdSet.value.has(bookId)) return

    if (user.value) {
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('book_id', bookId)
    } else {
      removeFavouriteFromCookie(bookId)
    }

    allFavouriteIds.value = allFavouriteIds.value.filter((id) => id !== bookId)
    favourites.value = favourites.value.filter((book) => book.id !== bookId)
    hasMoreFavourites.value =
      allFavouriteIds.value.length > favourites.value.length
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
