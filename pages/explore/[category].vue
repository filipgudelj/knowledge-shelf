<script lang="ts" setup>
import type { BookSort, BookFilters } from '@/types'

// PAGE META
definePageMeta({
  layout: 'explore',
})

// STATE
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const allowedQueryKeys = [
  'sortBy',
  'order',
  'language',
  'binding',
  'inStockOnly',
  'onSaleOnly',
]

// COMPUTEDS
const slug = computed(() => route.params.category as string)

const category = computed(() =>
  slug.value === 'all' ? null : booksStore.getCategoryBySlug(slug.value),
)

if (slug.value !== 'all' && !category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `${t('errors.categoryNotFound')}: ${slug.value}`,
  })
}

const pageTitle = computed(() => {
  if (slug.value === 'all') return t('explore.headings.allBooks')
  const cat = category.value!
  return cat.name[locale.value]
})

const isInitialLoading = computed(
  () => booksStore.isLoading && booksStore.books.length === 0,
)

// SORT
const validSortByOptions = ['created_at', 'price', 'title']
const validSortOrders = ['asc', 'desc']

const querySortByOption = route.query.sortBy as string
const querySortOrder = route.query.order as string

const errors: string[] = []

const unknownQueryKeys = Object.keys(route.query).filter(
  (key) => !allowedQueryKeys.includes(key),
)
if (unknownQueryKeys.length > 0) {
  errors.push(`${t('errors.unknownQueryKeys')}: ${unknownQueryKeys.join(', ')}`)
}

if (querySortByOption && !validSortByOptions.includes(querySortByOption)) {
  errors.push(`${t('errors.invalidSortBy')}: "${querySortByOption}"`)
}

if (querySortOrder && !validSortOrders.includes(querySortOrder)) {
  errors.push(`${t('errors.invalidSortOrder')}: "${querySortOrder}"`)
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

// FILTER
const filters = ref<BookFilters>({
  language: (route.query.language as 'en' | 'hr') ?? '',
  binding: (route.query.binding as 'softcover' | 'hardcover') ?? '',
  inStockOnly: route.query.inStockOnly === 'true',
  onSaleOnly: route.query.onSaleOnly === 'true',
})

// WATCHERS
watch([sortBy, sortOrder], ([newSortBy, newOrder]) => {
  router.replace({
    query: {
      ...route.query,
      sortBy: newSortBy,
      order: newOrder,
    },
  })
})

watch(filters, (newFilters) => {
  const query = { ...route.query }

  if (newFilters.language) {
    query.language = newFilters.language
  } else {
    delete query.language
  }

  if (newFilters.binding) {
    query.binding = newFilters.binding
  } else {
    delete query.binding
  }

  if (newFilters.inStockOnly) {
    query.inStockOnly = 'true'
  } else {
    delete query.inStockOnly
  }

  if (newFilters.onSaleOnly) {
    query.onSaleOnly = 'true'
  } else {
    delete query.onSaleOnly
  }

  router.replace({ query })
})

watch(
  [category, sort, filters] as const,
  async ([newCategory, newSort, newFilters]) => {
    if (slug.value !== 'all' && !newCategory) return

    booksStore.resetBooks()
    await booksStore.loadMoreBooks(
      newCategory?.id,
      undefined,
      newFilters,
      newSort,
    )
  },
  { immediate: true, flush: 'post' },
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!booksStore.hasMoreBooks) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await booksStore.loadMoreBooks(
      category.value?.id,
      undefined,
      filters.value,
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
useHead(() => ({
  title: t('seo.explore.title', { pageTitle: pageTitle.value }),
  meta: [{ name: 'description', content: t('seo.explore.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="explore">
    <div class="explore__header">
      <h1 class="explore__title">{{ pageTitle }}</h1>
      <SortBooks v-model:sortBy="sortBy" v-model:order="sortOrder" />
    </div>
    <FilterBooks v-model:filters="filters" class="explore__filters" />
    <BooksList
      :books="booksStore.books"
      :noResultsText="t('explore.categoryEmpty')"
      :isInitialLoading="isInitialLoading"
    />
  </div>
</template>

<style lang="scss" scoped>
.explore {
  width: 100%;
}

.explore__header {
  @include flex(row, space-between, center);
  flex-wrap: wrap;
  gap: $spacing-2;
  margin-top: $spacing-2;
}

.explore__title {
  margin-right: $spacing-9;
}

.explore__filters {
  margin-bottom: $spacing-6;
}
</style>
