<script lang="ts" setup>
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = defineProps<{ book: Book }>()

// STATE
const { t } = useI18n()
const imageLoaded = ref(false)
const user = useSupabaseUser()
const cartStore = useCartStore()

// COMPUTEDS
const inCart = computed(() => cartStore.isInCart(props.book.id))
</script>

<template>
  <div class="book" :class="{ visible: imageLoaded }">
    <AddToFavourites
      variant="circle"
      :book-id="props.book.id"
      class="book__favourite"
    />

    <NuxtLinkLocale
      :to="`/books/${book.id}`"
      class="book__link"
      :aria-label="`View details for book ${props.book.title}`"
    >
      <img
        :src="props.book.cover_url"
        :alt="props.book.title"
        @load="imageLoaded = true"
        class="book__image"
      />
      <p class="book__title">{{ props.book.title }}</p>
    </NuxtLinkLocale>

    <NuxtLinkLocale
      :to="`/authors/${props.book.author?.id ?? props.book.author_id}`"
      class="book__author"
      :aria-label="`View author ${props.book.author?.name ?? props.book.author_name}`"
    >
      {{ props.book.author?.name ?? props.book.author_name }}
    </NuxtLinkLocale>

    <p class="book__price">{{ formatNumberToEuro(props.book.price) }}</p>

    <FormButton
      v-if="user"
      @click="cartStore.addToCart(book.id)"
      type="button"
      :variant="inCart ? 'tertiary' : 'primary'"
      size="md"
      :disabled="book.stock === 0 || inCart"
      class="book__button"
    >
      {{
        book.stock === 0
          ? t('book.actions.unavailable')
          : inCart
            ? t('book.actions.addedToBasket')
            : t('book.actions.addToBasket')
      }}
    </FormButton>
  </div>
</template>

<style lang="scss" scoped>
.book {
  position: relative;
  @include flex(column, center, center);
  width: 100%;
  gap: $spacing-1;
  padding-block: $spacing-3;
  perspective: 1300px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }
}

.book__favourite {
  z-index: 1;
  position: absolute;
  top: 5%;
  right: 5%;
}

.book__link {
  @include flex(column, center, center);

  &:hover {
    cursor: pointer;
  }

  &:hover .book__image {
    transform: scale(0.95);
  }

  &:hover .book__title {
    color: $color-blue-500;
  }
}

.book__image {
  width: 100%;
  margin-bottom: $spacing-3;
  border-radius: $radius-4;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  transition: all 0.3s ease;
}

.book__title {
  max-width: 90%;
  font-size: $font-size-lg;
  font-weight: 700;
  text-align: center;
  transition: color 0.4s ease;
}

.book__author {
  max-width: 90%;
  color: $color-gray-600;
  text-align: center;

  html.dark & {
    color: $color-gray-500;

    &:hover {
      color: $color-blue-500;
    }
  }

  &:hover {
    color: $color-blue-500;
  }
}

.book__price {
  max-width: 90%;
  font-size: $font-size-lg;
  text-align: center;
}

.book__button {
  margin-top: $spacing-3;
}
</style>
