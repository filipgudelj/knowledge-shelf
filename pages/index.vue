<script lang="ts" setup>
import type { Book } from '~/types'

// STATE
const { locale, t } = useI18n()
const booksStore = useBooksStore()
const mostSoldBooks = ref<Book[]>([])
const newestBooks = ref<Book[]>([])
const staffPickedBooks = ref<Book[]>([])

// LCH
onMounted(async () => {
  mostSoldBooks.value = await booksStore.getMostSoldBooks()
  newestBooks.value = await booksStore.getNewestBooks()
  staffPickedBooks.value = await booksStore.getStaffPicksBooks()
})

// HEAD
useHead({
  title: 'Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Browse and buy books online from a wide range of categories.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
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
