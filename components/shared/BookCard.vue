<script lang="ts" setup>
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = defineProps<{ book: Book }>()
</script>

<template>
  <div class="book">
    <img
      :src="props.book.cover_url"
      :alt="props.book.title"
      class="book__image"
    />
    <p class="book__title">{{ props.book.title }}</p>
    <p class="book__author">{{ props.book.author }}</p>
    <p class="book__price">{{ formatNumberToEuro(props.book.price) }}</p>
  </div>
</template>

<style lang="scss" scoped>
.book {
  @include flex(column, center, center);
  width: 100%;
  gap: $spacing-1;
}

.book__image {
  width: 100%;
  margin-bottom: $spacing-3;
  border-radius: $radius-4;
}

.book__title {
  max-width: 90%;
  font-size: $font-size-lg;
  text-align: center;
}

.book__author {
  color: $color-gray-600;

  html.dark & {
    color: $color-gray-500;
  }
}

.book__price {
  font-size: $font-size-lg;
}
</style>
