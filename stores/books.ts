import { defineStore } from 'pinia'
import type { Book } from '@/types'

export const useBooksStore = defineStore('books', () => {
  const supabase = useSupabaseClient()

  const getBooks = async (): Promise<Book[]> => {
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .range(0, 13)

    return books ?? []
  }

  return { getBooks }
})
