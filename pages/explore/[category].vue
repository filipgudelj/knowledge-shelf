<script lang="ts" setup>
import type { Category, CategoryName, BookSort } from '~/types'

// STATE
const baseCategories = ref<Omit<Category, 'label'>[]>([
  { name: 'all', slug: 'all', headTitle: 'All' },
  {
    name: 'art and design',
    slug: 'art-and-design',
    headTitle: 'Art and Design',
  },
  { name: 'biography', slug: 'biography', headTitle: 'Biography' },
  {
    name: 'business, economics and law',
    slug: 'business-economics-and-law',
    headTitle: 'Business, Economics and Law',
  },
  { name: 'computing', slug: 'computing', headTitle: 'Computing' },
  {
    name: 'crime and thrillers',
    slug: 'crime-and-thrillers',
    headTitle: 'Crime and Thrillers',
  },
  { name: 'education', slug: 'education', headTitle: 'Education' },
  { name: 'fiction', slug: 'fiction', headTitle: 'Fiction' },
  {
    name: 'graphic novels',
    slug: 'graphic-novels',
    headTitle: 'Graphic Novels',
  },
  {
    name: 'health and wellbeing',
    slug: 'health-and-wellbeing',
    headTitle: 'Health and Wellbeing',
  },
  { name: 'history', slug: 'history', headTitle: 'History' },
  {
    name: 'science and nature',
    slug: 'science-and-nature',
    headTitle: 'Science and Nature',
  },
  { name: 'travel', slug: 'travel', headTitle: 'Travel' },
])
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

// COMPUTEDS
const categories = computed<Category[]>(() =>
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

const categoryName = computed<CategoryName>(() => category.value!.name)

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

// SORT
const allowedQueryKeys = ['sortBy', 'order']
const validSortByOptions = ['created_at', 'price', 'title']
const validSortOrders = ['asc', 'desc']

const querySortByOption = route.query.sortBy as string
const querySortOrder = route.query.order as string

const errors: string[] = []

const unknownQueryKeys = Object.keys(route.query).filter(
  (key) => !allowedQueryKeys.includes(key),
)
if (unknownQueryKeys.length > 0) {
  errors.push(`Unknown query parameter(s): ${unknownQueryKeys.join(', ')}`)
}

if (querySortByOption && !validSortByOptions.includes(querySortByOption)) {
  errors.push(`Invalid sortBy: "${querySortByOption}"`)
}

if (querySortOrder && !validSortOrders.includes(querySortOrder)) {
  errors.push(`Invalid order: "${querySortOrder}"`)
}

if (errors.length > 0) {
  throw createError({
    statusCode: 400,
    statusMessage: errors.join(' | '),
  })
}

const sortBy = ref(querySortByOption || 'created_at')
const sortOrder = ref(querySortOrder || 'desc')

const sort = computed<BookSort>(() => ({
  sortBy: sortBy.value as BookSort['sortBy'],
  ascending: sortOrder.value === 'asc',
}))

// WATCHERS
watch([sortBy, sortOrder], ([sortBy, order]) => {
  router.replace({
    query: {
      ...route.query,
      sortBy: sortBy,
      order: order,
    },
  })
})

watch(
  [categoryName, sort] as const,
  async ([newCategoryName, newSort]) => {
    booksStore.resetBooks()
    await booksStore.loadMoreBooks(
      newCategoryName,
      undefined,
      undefined,
      newSort,
    )
  },
  { immediate: true },
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!booksStore.hasMoreBooks) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await booksStore.loadMoreBooks(
      categoryName.value,
      undefined,
      undefined,
      sort.value,
    )
  }
}

// LCH
onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// HEAD
useHead({
  title: `${category.value!.headTitle === 'All' ? 'All books' : category.value!.headTitle} | Knowledge Shelf`,
  meta: [
    {
      name: 'description',
      content: `Explore our collection of ${category.value!.headTitle} books.`,
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <div class="explore">
    <CategoryScroller :categories="categories" />
    <SortBooks v-model:sortBy="sortBy" v-model:order="sortOrder" />
    <FilterBooks />
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
