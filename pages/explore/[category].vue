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

// COMPUTEDS
const slug = computed(() => route.params.category as string)
const category = computed(() =>
  categories.value.find((c) => c.slug === slug.value),
)
if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Category not found: ${slug.value}`,
  })
}
const categoryName = computed(() => category.value!.value)
const pageTitle = computed(() => `${category.value!.label} books`)
const isInitialLoading = computed(
  () => booksStore.isLoading && booksStore.books.length === 0,
)

// WATCHERS
watch(
  () => categoryName.value,
  async (newCategoryName, oladCategoryName) => {
    if (newCategoryName === oladCategoryName) return

    booksStore.resetBooks()
    await booksStore.loadMoreBooks(newCategoryName)
  },
  { immediate: true },
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!booksStore.hasMoreBooks) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await booksStore.loadMoreBooks(categoryName.value)
  }
}

// LCH
onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="explore">
    <CategoryScroller :categories="categories" />
    <h1 class="explore__title">{{ pageTitle }}</h1>
    <BooksList :books="booksStore.books" :isInitialLoading="isInitialLoading" />
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
