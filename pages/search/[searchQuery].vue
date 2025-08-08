<script lang="ts" setup>
// STATE
const route = useRoute()
const booksStore = useBooksStore()
const { locale } = useI18n()

// COMPUTEDS
const { t } = useI18n()
const currentQuery = computed(() => String(route.params.searchQuery || ''))
const isInitialLoading = computed(
  () => booksStore.isLoading && booksStore.books.length === 0,
)

// WATCHERS
watch(
  () => currentQuery.value,
  async () => {
    booksStore.resetBooks()
    await booksStore.loadMoreBooks(undefined, currentQuery.value)
  },
  { immediate: true },
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!booksStore.hasMoreBooks) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await booksStore.loadMoreBooks(undefined, currentQuery.value)
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
  title: t('seo.search.title', { q: currentQuery.value }),
  meta: [{ name: 'description', content: t('seo.search.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="search">
    <h1 class="search__title">
      {{ t('search.resultsFor') + ' "' + currentQuery + '"' }}
    </h1>
    <BooksList
      :books="booksStore.books"
      :noResultsText="t('search.noResults')"
      :isInitialLoading="isInitialLoading"
    />
  </div>
</template>

<style lang="scss" scoped>
.search {
  width: 100%;
}

.search__title {
  margin: $spacing-6 0;
}
</style>
