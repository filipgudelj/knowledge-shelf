<script setup lang="ts">
// STATE
const { t } = useI18n()
const favouritesStore = useFavouritesStore()
const user = useSupabaseUser()
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
