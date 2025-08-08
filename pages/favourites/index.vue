<script setup lang="ts">
// STATE
const { t, locale } = useI18n()
const favouritesStore = useFavouritesStore()
const isInitialLoading = computed(
  () => favouritesStore.isLoading && favouritesStore.favourites.length === 0,
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!favouritesStore.hasMoreFavourites) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await favouritesStore.loadMoreFavourites()
  }
}

// LCH
onMounted(async () => {
  await favouritesStore.loadFavourites()
  window.addEventListener('scroll', onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// HEAD
useHead(() => ({
  title: t('seo.favourites.title'),
  meta: [{ name: 'description', content: t('seo.favourites.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="favourites">
    <h1 class="favourites__title">{{ t('favourites.title') }}</h1>

    <BooksList
      :books="favouritesStore.favourites"
      :isInitialLoading="isInitialLoading"
    />
  </div>
</template>

<style scoped lang="scss">
.favourites {
  width: 100%;
}

.favourites__title {
  margin: $spacing-6 0;
}
</style>
