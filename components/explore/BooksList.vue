<script lang="ts" setup>
import type { Book } from '@/types'

// PROPS
const props = defineProps<{ books: Book[] }>()
</script>

<template>
  <div class="books">
    <div v-for="book in props.books" :key="book.id" class="books__item">
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
