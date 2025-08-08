<script setup lang="ts">
import { formatNumberToEuro } from '~/helpers/formatters'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// STATE
const cartStore = useCartStore()
const showSkeleton = ref(true)
const { t, locale } = useI18n()
const imageLoaded = ref(false)

// COMPUTEDS
const cartTotal = computed(() =>
  cartStore.items.reduce(
    (sum, item) => sum + (item.book?.price ?? 0) * item.quantity,
    0,
  ),
)

// LCH
onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
  cartStore.loadCart()
})

// HEAD
useHead({
  title: `${t('cart.title')} | Knowledge Shelf`,
  meta: [
    {
      name: 'description',
      content: 'View and manage the books in your shopping cart.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <div class="cart">
    <h1 class="cart__title">{{ t('cart.title') }}</h1>

    <div v-if="!showSkeleton && cartStore.items.length !== 0">
      <div class="cart__table-wrapper">
        <div class="cart__header">
          <p>{{ t('cart.productName') }}</p>
          <p class="center-text">{{ t('cart.quantity') }}</p>
          <p class="center-text">{{ t('cart.price') }}</p>
          <p class="center-text">{{ t('cart.totalPrice') }}</p>
        </div>

        <div
          v-for="item in cartStore.items"
          :key="item.book_id"
          class="cart__item"
        >
          <div class="cart__product">
            <img
              :src="item.book?.cover_url"
              :alt="item.book?.title"
              class="cart__product-image"
              :class="{ visible: imageLoaded }"
              @load="imageLoaded = true"
            />
            <NuxtLinkLocale
              :to="`/books/${item.book?.id}`"
              class="cart__product-title"
              >{{ item.book?.title }}</NuxtLinkLocale
            >
          </div>

          <div class="cart__quantity">
            <FormInputNumber
              :id="`quantity-${item.book?.id}`"
              v-model="item.quantity"
              :min="1"
              :max="item.book?.stock"
              :step="1"
              @update:modelValue="
                cartStore.updateQuantity(item.book_id, $event)
              "
            />
          </div>

          <div class="cart__price center-text">
            {{ formatNumberToEuro(item.book?.price ?? 0) }}
          </div>

          <div class="cart__total center-text">
            {{ formatNumberToEuro((item.book?.price ?? 0) * item.quantity) }}
          </div>

          <button
            class="cart__remove"
            @click="cartStore.removeFromCart(item.book_id)"
            aria-label="Remove"
          >
            <icon name="mdi:remove-bold" />
          </button>
        </div>
      </div>
      <div class="cart__summary">
        <p>{{ t('cart.summary') }}: {{ formatNumberToEuro(cartTotal) }}</p>
      </div>

      <div class="cart__actions">
        <SubmitButton
          type="secondary"
          @click="cartStore.clearCart()"
          class="cart__actions-button"
        >
          {{ t('cart.clearCart') }}
        </SubmitButton>
        <SubmitButton type="primary" class="cart__actions-button">
          {{ t('cart.checkout') }}
        </SubmitButton>
      </div>
    </div>

    <div
      v-else-if="!showSkeleton && cartStore.items.length === 0"
      class="cart__no-results"
    >
      {{ t('cart.empty') }}
    </div>

    <div v-else class="cart__skeleton">
      <VueSkeletonLoader
        type="text@1"
        height="50px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="cart__skeleton-header"
      />
      <VueSkeletonLoader
        type="text@2"
        height="180px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="cart__skeleton-items"
      />
      <VueSkeletonLoader
        type="text@1"
        height="100px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="cart__skeleton-summary"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart {
  width: 100%;
}

.cart__title {
  margin-top: $spacing-6;
}

.cart__table-wrapper {
  overflow-x: auto;
  width: 100%;
  padding-bottom: $spacing-3;

  &::-webkit-scrollbar {
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $radius-3;
    background-color: $color-gray-300;

    &:hover {
      cursor: pointer;
      background-color: $color-gray-400;

      html.dark & {
        background-color: $color-gray-600;
      }
    }

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
}

.cart__header,
.cart__item {
  display: grid;
  grid-template-columns:
    minmax(225px, 1.5fr) minmax(145px, 0.75fr) minmax(125px, 1fr)
    minmax(125px, 1fr) 60px;
  align-items: center;
  gap: $spacing-6;
  min-width: 800px;
}

.cart__header {
  margin-top: $spacing-6;
  padding: $spacing-6 0;
  border-bottom: 1px solid $color-gray-300;
  font-weight: 700;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }
}

.cart__item {
  padding: $spacing-6 0;
  border-bottom: 1px solid $color-gray-300;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }
}

.cart__product {
  @include flex(row, flex-start, center);
  gap: 0.75rem;
}

.cart__product-image {
  display: block;
  width: 100px;
  height: 156px;
  border-radius: $radius-3;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }
}

.cart__product-title {
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    color: $color-blue-500;
  }
}

.cart__remove {
  @include flex(row, center, center);
  padding-block: $spacing-3;
  border-radius: $radius-4;
  color: $color-red-500;
  transition: all 0.3s ease;

  html.dark & {
    &:hover {
      background-color: $color-gray-800;
    }
  }

  &:hover {
    background-color: $color-gray-300;
  }
}

.cart__summary {
  margin-top: $spacing-6;
  padding-bottom: $spacing-6;
  border-bottom: 1px solid $color-gray-300;
  font-weight: 700;
  text-align: right;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }

  & p {
    font-size: $font-size-lg;
  }
}

.cart__actions {
  margin-block: $spacing-6;
  display: flex;
  justify-content: space-between;
}

.cart__actions-button {
  width: 150px;
}

.cart__no-results {
  margin-top: $spacing-6;
  font-size: $font-size-lg;
}

.cart__skeleton {
  margin-top: $spacing-6;
}

.cart__skeleton-header {
  margin-top: $spacing-6;
}

.cart__skeleton-items {
  @include flex(column);
  gap: $spacing-3;
  margin-top: $spacing-6;
}

.cart__skeleton-summary {
  margin-top: $spacing-6;
}

.center-text {
  text-align: center;
}
</style>
