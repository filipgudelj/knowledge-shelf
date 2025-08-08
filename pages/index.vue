<script lang="ts" setup>
import type { Book } from '~/types'

// STATE
const { locale, t } = useI18n()
const booksStore = useBooksStore()
const mostSoldBooks = ref<Book[]>([])
const newestBooks = ref<Book[]>([])
const staffPickedBooks = ref<Book[]>([])
const cartStore = useCartStore()
const favouritesStore = useFavouritesStore()

// API
await (async () => {
  const [mostSold, newest, staffPicked] = await Promise.all([
    booksStore.getMostSoldBooks(),
    booksStore.getNewestBooks(),
    booksStore.getStaffPicksBooks(),
  ])

  mostSoldBooks.value = mostSold
  newestBooks.value = newest
  staffPickedBooks.value = staffPicked
})()

// LCH
onMounted(async () => {
  await favouritesStore.loadFavourites()
  await cartStore.loadCart()
})

// HEAD
useHead(() => ({
  title: t('seo.home.title'),
  meta: [{ name: 'description', content: t('seo.home.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <Section>
    <Carousel
      :title="t('carousel.mostSold')"
      :books="mostSoldBooks"
      :isLoading="mostSoldBooks.length === 0"
    />
  </Section>

  <Section>
    <Carousel
      :title="t('carousel.staffPicks')"
      :books="staffPickedBooks"
      :isLoading="staffPickedBooks.length === 0"
    />
  </Section>

  <Section>
    <Carousel
      :title="t('carousel.newest')"
      :books="newestBooks"
      :isLoading="newestBooks.length === 0"
    />
  </Section>
</template>
