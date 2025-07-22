<script lang="ts" setup>
import type { Category } from '~/types/category'

// STATE
const categories = ref<Category[]>([
  { label: 'All', value: 'all', slug: 'all' },
  { label: 'Art and Design', value: 'art and design', slug: 'art-and-design' },
  { label: 'Biography', value: 'biography', slug: 'biography' },
  {
    label: 'Business and Law',
    value: 'business, economics and law',
    slug: 'business-economics-and-law',
  },
  { label: 'Computing', value: 'computing', slug: 'computing' },
  {
    label: 'Crime and Thrillers',
    value: 'crime and thrillers',
    slug: 'crime-and-thrillers',
  },
  { label: 'Education', value: 'education', slug: 'education' },
  { label: 'Fiction', value: 'fiction', slug: 'fiction' },
  { label: 'Graphic Novels', value: 'graphic novels', slug: 'graphic-novels' },
  {
    label: 'Health and Wellness',
    value: 'health and wellbeing',
    slug: 'health-and-wellbeing',
  },
  { label: 'History', value: 'history', slug: 'history' },
  {
    label: 'Sci and Nature',
    value: 'science and nature',
    slug: 'science-and-nature',
  },
  { label: 'Travel', value: 'travel', slug: 'travel' },
])
const route = useRoute()
const booksStore = useBooksStore()
const slug = route.params.category as string
const category = categories.value.find((c) => c.slug === slug)
if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: `Category not found: ${slug}`,
  })
}
const pageTitle = category.label + ' books'

// API
const books = await booksStore.getBooks()
</script>

<template>
  <div class="explore">
    <CategoryScroller :categories="categories" />

    <h1 class="explore__title">{{ pageTitle }}</h1>
    <!-- <div class="explore__controls">
      <FilterBooks />
      <SortBooks />
    </div> -->
    <BooksList :books="books" />
  </div>
</template>

<style lang="scss" scoped>
.explore {
  width: 100%;
}

.explore__title {
  margin: $spacing-6 0;
}
</style>
