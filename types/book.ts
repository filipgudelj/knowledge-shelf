import type { CategoryName } from './category'

type Language = 'english' | 'croatian'

type BindingType = 'softcover' | 'hardcover'

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  description: string
  price: number
  category: CategoryName
  stock: number
  cover_url: string
  year_published: number
  format_width_mm: number
  format_height_mm: number
  language: Language
  pages_count: number
  publisher: string
  binding_type: BindingType
  weight_kg: number
  sales_count: number
  created_at: string
}

export type BookSort =
  | { sortBy: 'created_at'; ascending: boolean }
  | { sortBy: 'price'; ascending: boolean }
  | { sortBy: 'title'; ascending: boolean }

export type BookFilters = {
  language?: 'english' | 'croatian' | ''
  binding?: 'softcover' | 'hardcover' | ''
  inStockOnly?: boolean
}
