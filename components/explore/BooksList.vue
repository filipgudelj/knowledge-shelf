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
const showSkeleton = ref(true)
let skeletonTimer: ReturnType<typeof setTimeout> | null = null

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
      v-for="n in 24"
      :key="'skel-' + n"
      type="image@1"
      :width="'100%'"
      :height="'400px'"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
    >
    </VueSkeletonLoader>

    <div v-else v-for="book in props.books" :key="book.id">
      <BookCard :book="book" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}
</style>
