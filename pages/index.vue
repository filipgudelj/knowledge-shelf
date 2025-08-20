<script lang="ts" setup>
import type { Book } from '@/types'

// STATE
const { locale, t } = useI18n()
const { showToast } = useToast()
const booksStore = useBooksStore()
const mostSoldBooks = ref<Book[]>([])
const newestBooks = ref<Book[]>([])
const staffPickedBooks = ref<Book[]>([])
const cartStore = useCartStore()
const favouritesStore = useFavouritesStore()
const route = useRoute()
const router = useRouter()

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

  const fromQuery = route.query.error_code as string | undefined
  const fromHash = route.hash
    ? (new URLSearchParams(route.hash.slice(1)).get('error_code') ?? undefined)
    : undefined

  if (!fromQuery && !fromHash) return

  setTimeout(() => {
    showToast('error', t('toast.linkExpired'))
  }, 0)

  const { error, error_code, error_description, ...rest } = route.query
  router.replace({ path: route.path, query: rest, hash: '' })
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
