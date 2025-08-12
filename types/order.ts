export interface Order {
  id: number
  created_at: string
  stripe_session_id: string | null
  user_id: string
  email: string
  name: string
  surname: string
  phone: string | null
  country: string
  city: string
  zip: string
  address: string
  shipping_method: string
  notes: string | null
  subtotal: number
  shipping_price: number
  total: number
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number
  book_id: number
  title_snapshot: string
  unit_price: number
  quantity: number
  line_total: number
}
