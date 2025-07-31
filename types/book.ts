import type { Author } from './author'
import type { Category } from './category'

export interface Book {
  id: number
  created_at: string // ISO 8601 timestamp
  title: string
  author: Author
  author_id?: number
  price: number
  stock: number
  cover_url: string
  year_published: number
  format_width_mm: number
  format_height_mm: number
  language: 'en' | 'hr'
  pages_count: number
  publisher: string
  binding_type: 'hardcover' | 'softcover'
  weight_kg: number
  sales_count: number
  category: Category
  description: {
    en: string
    hr: string
  }
  original_title: string | null
  translator: string | null
  is_staff_pick: boolean
  author_name?: string
}

export type BookSort =
  | { sortBy: 'created_at'; ascending: boolean }
  | { sortBy: 'price'; ascending: boolean }
  | { sortBy: 'title'; ascending: boolean }

export type BookFilters = {
  language?: 'en' | 'hr' | ''
  binding?: 'hardcover' | 'softcover' | ''
  inStockOnly?: boolean
}
