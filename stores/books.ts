import { defineStore } from 'pinia'
import type { Book } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const supabase = useSupabaseClient()
  const books = ref<Book[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreBooks = ref(true)
  const isLoading = ref(false)

  const loadMoreBooks = async (category: string) => {
    if (isLoading.value || !hasMoreBooks.value) return

    isLoading.value = true

    const start = page.value * pageSize
    const end = start + pageSize - 1

    let query = supabase
      .from('books')
      .select('*')
      .order('id', { ascending: true })
      .range(start, end)

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data } = await query

    if (!data || data.length < pageSize) {
      hasMoreBooks.value = false
    }

    books.value.push(...(data ?? []))
    page.value++

    isLoading.value = false
  }

  const resetBooks = () => {
    books.value = []
    page.value = 0
    hasMoreBooks.value = true
    isLoading.value = false
  }

  return { books, hasMoreBooks, isLoading, loadMoreBooks, resetBooks }
})
