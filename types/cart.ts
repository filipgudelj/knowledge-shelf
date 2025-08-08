import type { Book } from './book'

type BookLite = Pick<Book, 'id' | 'title' | 'price' | 'cover_url' | 'stock'>

export interface CartItem {
  book_id: number
  quantity: number
  book: BookLite | null
}
