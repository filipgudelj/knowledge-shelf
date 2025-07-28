import { defineStore } from 'pinia'
import type { Book, BookFilters, BookSort } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const supabase = useSupabaseClient()
  const books = ref<Book[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreBooks = ref(true)
  const isLoading = ref(false)

  const loadMoreBooks = async (
    category?: string,
    searchQuery?: string,
    filters?: BookFilters,
    sort?: BookSort,
  ) => {
    if (isLoading.value || !hasMoreBooks.value) return

    isLoading.value = true

    const start = page.value * pageSize
    const end = start + pageSize - 1

    let queryBuilder = supabase
      .from('books')
      .select('*')
      .order(sort?.sortBy ?? 'created_at', {
        ascending: sort?.ascending ?? true,
      })
      .range(start, end)

    if (category !== 'all' && category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (searchQuery) {
      queryBuilder = queryBuilder.ilike('title', `%${searchQuery}%`)
    }

    if (filters?.binding?.length) {
      queryBuilder = queryBuilder.eq('binding_type', filters.binding)
    }

    if (filters?.language?.length) {
      queryBuilder = queryBuilder.eq('language', filters.language)
    }

    if (filters?.inStockOnly) {
      queryBuilder = queryBuilder.gt('stock', 0)
    }

    const { data } = await queryBuilder

    if (!data || data.length < pageSize) {
      hasMoreBooks.value = false
    }

    books.value.push(...(data ?? []))
    page.value++

    isLoading.value = false
  }

  const searchBooks = async (searchQuery?: string) => {
    if (!searchQuery) {
      resetBooks()
    }

    await loadMoreBooks(undefined, searchQuery)
  }

  const resetBooks = () => {
    books.value = []
    page.value = 0
    hasMoreBooks.value = true
    isLoading.value = false
  }

  return {
    books,
    hasMoreBooks,
    isLoading,
    loadMoreBooks,
    searchBooks,
    resetBooks,
  }
})
