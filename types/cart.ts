import type { Book } from './book'

type BookLite = Pick<
  Book,
  'id' | 'title' | 'price' | 'cover_url' | 'stock' | 'sale_price'
>

export interface CartItem {
  book_id: number
  quantity: number
  book: BookLite | null
}
