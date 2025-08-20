<script lang="ts" setup>
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = defineProps<{ book: Book }>()

// STATE
const { t, locale } = useI18n()
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
      v-if="book.sale_price"
      class="book__discount"
      :aria-label="`View details for book ${props.book.title}`"
    >
      <Icon name="mdi:cart-percent" size="24px" />
    </NuxtLinkLocale>

    <NuxtLinkLocale
      :to="`/books/${book.id}`"
      class="book__link"
      :aria-label="`View details for book ${props.book.title}`"
    >
      <img
        :src="props.book.cover_url"
        :alt="`${props.book.title} book cover`"
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

    <p class="book__price">
      <span v-if="book.sale_price" class="book__price--old">
        {{ formatNumberToEuro(book.price, locale) }}
      </span>
      <span class="book__price--current">
        {{ formatNumberToEuro(book.sale_price ?? book.price, locale) }}
      </span>
    </p>

    <FormButton
      v-if="user"
      @click="cartStore.addToCart(book.id)"
      type="button"
      :variant="inCart ? 'tertiary' : 'primary'"
      size="md"
      :disabled="book.stock === 0 || inCart"
      class="book__button"
      :class="{ 'book__button--extra-margin': !book.sale_price }"
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
  perspective: 1300px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  &:has(.book__discount:hover) .book__title {
    color: $color-blue-500;
  }
}

.book__discount {
  z-index: 1;
  position: absolute;
  top: 5%;
  left: 5%;
  @include flex(row, center, center);
  padding: $spacing-3 $spacing-3;
  border-radius: 50%;
  background-color: $color-red-500;
  color: $color-gray-100;
  overflow: visible;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid rgba($color-red-500, 1);
    animation: pulse 4s ease-out infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  17% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
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
  @include flex(column, center, center);
  max-width: 90%;
  height: 48px;
  font-size: $font-size-lg;
  font-weight: 700;
  text-align: center;
  line-height: normal;
  transition: color 0.4s ease;
}

.book__author {
  @include flex(column, center, center);
  max-width: 90%;
  color: $color-gray-600;
  text-align: center;
  transition: all 0.4s ease;

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
  @include flex(column, center, center);
  height: 50px;
  font-size: $font-size-lg;

  &--old {
    color: $color-gray-700;
    font-size: $font-size-sm;
    text-decoration: line-through;

    html.dark & {
      color: $color-gray-400;
    }
  }
}

.book__button {
  margin-top: $spacing-3;

  &--extra-margin {
    margin-top: $spacing-3;
  }
}
</style>
