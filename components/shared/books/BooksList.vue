<script lang="ts" setup>
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'
import type { Book } from '@/types'

// PROPS
const props = defineProps<{
  books: Book[]
  isInitialLoading: boolean
}>()

// STATE
const { t } = useI18n()
const showSkeleton = ref(true)
let skeletonTimer: ReturnType<typeof setTimeout> | null = null

// COMPUTEDS
const showNoResults = computed(() => {
  return (
    !props.isInitialLoading && !showSkeleton.value && props.books.length === 0
  )
})

// WATCHERS
watch(
  () => props.isInitialLoading,
  (isLoadingAgain) => {
    if (isLoadingAgain) {
      showSkeleton.value = true

      if (skeletonTimer) {
        clearTimeout(skeletonTimer)
      }

      skeletonTimer = setTimeout(() => {
        showSkeleton.value = false
        skeletonTimer = null
      }, 500)
    }
  },
  { immediate: true },
)

// LCH
onMounted(() => {
  skeletonTimer = setTimeout(() => {
    showSkeleton.value = false
  }, 500)
})

onBeforeUnmount(() => {
  if (skeletonTimer) {
    clearTimeout(skeletonTimer)
    skeletonTimer = null
  }
})
</script>

<template>
  <div class="books">
    <VueSkeletonLoader
      v-if="props.isInitialLoading || showSkeleton"
      v-for="n in 14"
      :key="'skel-' + n"
      type="image@1"
      :width="'100%'"
      :height="'400px'"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
    >
    </VueSkeletonLoader>

    <p v-else-if="showNoResults" class="no-results">
      {{ t('books.noResults') }}
    </p>

    <div v-else v-for="book in props.books" :key="book.id">
      <BookCard :book="book" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-9;
}

.no-results {
  grid-column: 1 / -1;
  width: 100%;
  font-size: $font-size-lg;
}
</style>
