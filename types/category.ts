export type CategoryName =
  | 'all'
  | 'art and design'
  | 'biography'
  | 'business, economics and law'
  | 'computing'
  | 'crime and thrillers'
  | 'education'
  | 'fiction'
  | 'graphic novels'
  | 'health and wellbeing'
  | 'history'
  | 'science and nature'
  | 'travel'

export interface Category {
  name: CategoryName
  slug: string
  headTitle: string
  label: string
}
