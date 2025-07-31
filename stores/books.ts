import { defineStore } from 'pinia'
import type { Book, BookFilters, BookSort, Category } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const supabase = useSupabaseClient()

  const books = ref<Book[]>([])
  const categories = ref<Category[]>([])
  const page = ref(0)
  const pageSize = 24
  const hasMoreBooks = ref(true)
  const isLoading = ref(false)
  const { t } = useI18n()

  const getCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name->>en', { ascending: true })

    categories.value = data || []
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find((c) => c.slug === slug)
  }

  const getNewestBooks = async (): Promise<Book[]> => {
    const { data } = await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .order('created_at', { ascending: false })
      .limit(12)

    return data ?? []
  }

  const getMostSoldBooks = async (): Promise<Book[]> => {
    const { data } = await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .order('sales_count', { ascending: false })
      .limit(12)

    return data ?? []
  }

  const getStaffPicksBooks = async (): Promise<Book[]> => {
    const { data } = await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .eq('is_staff_pick', true)
      .order('created_at', { ascending: false })
      .limit(12)

    return data ?? []
  }

  const getBookDetails = async (id: number): Promise<Book | null> => {
    const { data, error } = await supabase
      .from('books')
      .select('*, author:authors(*), category:categories(*)')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          statusMessage: `${t('errors.bookNotFound')} (ID: ${id})`,
        })
      }
    }

    return data
  }

  const loadMoreBooks = async (
    categoryId?: number,
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
      .select('*, author:authors(*), category:categories(*)')
      .order(sort?.sortBy ?? 'created_at', {
        ascending: sort?.ascending ?? true,
      })
      .range(start, end)

    if (categoryId) {
      queryBuilder = queryBuilder.eq('category_id', categoryId)
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
    categories,
    hasMoreBooks,
    isLoading,
    getCategories,
    getCategoryBySlug,
    getMostSoldBooks,
    getNewestBooks,
    getStaffPicksBooks,
    getBookDetails,
    loadMoreBooks,
    searchBooks,
    resetBooks,
  }
})
