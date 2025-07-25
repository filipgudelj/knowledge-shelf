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
  padding-block: $spacing-3;
  perspective: 700px;

  &:hover {
    cursor: pointer;
  }

  &:hover .book__image {
    transform: rotateX(-10deg) rotateY(25deg) scale(0.95);
  }

  &:hover .book__title {
    color: $color-blue-500;
  }
}

.book__image {
  width: 100%;
  margin-bottom: $spacing-3;
  border-radius: $radius-4;
  transition: transform 0.4s ease;
}

.book__title {
  max-width: 90%;
  font-size: $font-size-lg;
  text-align: center;
  transition: color 0.4s ease;
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
