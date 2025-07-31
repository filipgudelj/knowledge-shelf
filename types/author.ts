export interface Author {
  id: number
  created_at: string
  name: string
  bio: {
    en: string
    hr: string
  }
  avatar_url?: string
}
