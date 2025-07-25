<script lang="ts" setup>
import type { Category } from '~/types/category'

// STATE
const { t } = useI18n()
const baseCategories = ref<(Omit<Category, 'label'> & { headTitle: string })[]>(
  [
    { value: 'all', slug: 'all', headTitle: 'All' },
    {
      value: 'art and design',
      slug: 'art-and-design',
      headTitle: 'Art and Design',
    },
    { value: 'biography', slug: 'biography', headTitle: 'Biography' },
    {
      value: 'business, economics and law',
      slug: 'business-economics-and-law',
      headTitle: 'Business, Economics and Law',
    },
    { value: 'computing', slug: 'computing', headTitle: 'Computing' },
    {
      value: 'crime and thrillers',
      slug: 'crime-and-thrillers',
      headTitle: 'Crime and Thrillers',
    },
    { value: 'education', slug: 'education', headTitle: 'Education' },
    { value: 'fiction', slug: 'fiction', headTitle: 'Fiction' },
    {
      value: 'graphic novels',
      slug: 'graphic-novels',
      headTitle: 'Graphic Novels',
    },
    {
      value: 'health and wellbeing',
      slug: 'health-and-wellbeing',
      headTitle: 'Health and Wellbeing',
    },
    { value: 'history', slug: 'history', headTitle: 'History' },
    {
      value: 'science and nature',
      slug: 'science-and-nature',
      headTitle: 'Science and Nature',
    },
    { value: 'travel', slug: 'travel', headTitle: 'Travel' },
  ],
)
const route = useRoute()
const booksStore = useBooksStore()

// COMPUTEDS
const categories = computed<(Category & { headTitle: string })[]>(() =>
  baseCategories.value.map((c) => ({
    ...c,
    label: t(`explore.categories.${c.slug}`),
  })),
)
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
const pageTitle = computed(() => {
  const label = category.value!.label.toLocaleLowerCase()
  const allLabel = t('explore.categories.all').toLowerCase()
  if (label === allLabel) {
    return t('explore.allBooks')
  }
  return category.value!.label
})
const isInitialLoading = computed(
  () => booksStore.isLoading && booksStore.books.length === 0,
)

// PAGE META
useHead({
  title: `${category.value!.headTitle === 'All' ? 'All books' : category.value!.headTitle} | Knowledge Shelf`,
  meta: [
    {
      name: 'description',
      content: `Explore our collection of ${category.value!.headTitle} books.`,
    },
  ],
})

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
