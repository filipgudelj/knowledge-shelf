import { defineStore } from 'pinia'
import type { Book } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const supabase = useSupabaseClient()
  const books = ref<Book[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreBooks = ref(true)
  const isLoading = ref(false)

  const loadMoreBooks = async (category?: string, searchQuery?: string) => {
    if (isLoading.value || !hasMoreBooks.value) return

    isLoading.value = true

    const start = page.value * pageSize
    const end = start + pageSize - 1

    let queryBuilder = supabase
      .from('books')
      .select('*')
      .order('id', { ascending: true })
      .range(start, end)

    if (category !== 'all' && category) {
      queryBuilder = queryBuilder.eq('category', category)
    }

    if (searchQuery) {
      queryBuilder = queryBuilder.ilike('title', `%${searchQuery}%`)
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
