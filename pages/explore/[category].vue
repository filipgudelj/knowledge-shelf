<script lang="ts" setup>
import type { Category } from '~/types/category'

// STATE
const { t } = useI18n()
const baseCategories = ref<Omit<Category, 'label'>[]>([
  { value: 'all', slug: 'all' },
  { value: 'art and design', slug: 'art-and-design' },
  { value: 'biography', slug: 'biography' },
  { value: 'business, economics and law', slug: 'business-economics-and-law' },
  { value: 'computing', slug: 'computing' },
  { value: 'crime and thrillers', slug: 'crime-and-thrillers' },
  { value: 'education', slug: 'education' },
  { value: 'fiction', slug: 'fiction' },
  { value: 'graphic novels', slug: 'graphic-novels' },
  { value: 'health and wellbeing', slug: 'health-and-wellbeing' },
  { value: 'history', slug: 'history' },
  { value: 'science and nature', slug: 'science-and-nature' },
  { value: 'travel', slug: 'travel' },
])

const categories = computed<Category[]>(() =>
  baseCategories.value.map((c) => ({
    ...c,
    label: t(`categories.${c.slug}`),
  })),
)
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
const pageTitle = computed(() => `${category.value!.label}`)
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
