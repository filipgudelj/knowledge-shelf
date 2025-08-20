<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// PROPS
const props = withDefaults(
  defineProps<{
    title?: string
    books: Book[]
    isLoading?: boolean
  }>(),
  {
    title: '',
    books: () => [],
    isLoading: false,
  },
)

// STATE
const { t, locale } = useI18n()
const { width } = useWindowSize()
const user = useSupabaseUser()
const cartStore = useCartStore()
const currentSlideIndex = ref(0)
const showSkeleton = ref(true)
let skeletonTimer: ReturnType<typeof setTimeout> | null = null
const imageLoaded = ref<boolean[]>([])
const onImageLoad = (index: number) => {
  imageLoaded.value[index] = true
}

// COMPUTEDS
const totalSlides = computed<number>(() => props.books.length)
const visibleSlides = computed<number>(() => {
  if (width.value < 495) return 1
  if (width.value < 685) return 2
  if (width.value < 768) return 3
  if (width.value < 967) return 2
  if (width.value < 1200) return 3
  if (width.value < 1433) return 4
  if (width.value < 1665) return 5
  if (width.value < 1902) return 6
  return 7
})
const isPreviousButtonDisabled = computed(() => currentSlideIndex.value === 0)
const isNextButtonDisabled = computed(
  () => currentSlideIndex.value === maxSlideIndex.value,
)
const maxSlideIndex = computed(() => totalSlides.value - visibleSlides.value)
const translateX = computed(() => {
  return `translateX(-${(100 / totalSlides.value) * currentSlideIndex.value}%)`
})

// WATCHERS
watch(width, () => {
  currentSlideIndex.value = 0
})

watch(
  () => props.books,
  (newBooks) => {
    imageLoaded.value = newBooks.map(() => false)
  },
  { immediate: true },
)

watch(
  () => props.isLoading,
  (isLoading) => {
    if (isLoading) {
      showSkeleton.value = true
      if (skeletonTimer) clearTimeout(skeletonTimer)

      skeletonTimer = setTimeout(() => {
        showSkeleton.value = false
        skeletonTimer = null
      }, 500)
    }
  },
  { immediate: true },
)

// HANDLERS
const nextSlide = () => {
  if (currentSlideIndex.value < maxSlideIndex.value) {
    currentSlideIndex.value++
  }
}

const previousSlide = () => {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
  }
}

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
  <ClientOnly>
    <div class="carousel">
      <div class="carousel__heading">
        <div class="carousel__title">{{ props.title }}</div>
        <div class="carousel__buttons">
          <button
            @click="previousSlide"
            :disabled="isPreviousButtonDisabled"
            aria-label="Previous"
          >
            <Icon name="mdi:chevron-left" size="24px" />
          </button>

          <button
            @click="nextSlide"
            :disabled="isNextButtonDisabled"
            aria-label="Next"
          >
            <Icon name="mdi:chevron-right" size="24px" />
          </button>
        </div>
      </div>

      <div class="carousel__view">
        <div
          :style="{
            transform: translateX,
            width: `calc(100% * (${totalSlides} / ${visibleSlides}))`,
          }"
          class="carousel__track"
        >
          <VueSkeletonLoader
            v-if="props.isLoading || showSkeleton"
            v-for="n in visibleSlides"
            :key="'skeleton-' + n"
            type="image@1"
            :height="'460px'"
            base-color="var(--skel-base)"
            highlight-color="var(--skel-highlight)"
            :style="{ width: `calc(100% / ${totalSlides} - 1rem)` }"
          />

          <div
            v-else
            v-for="(book, index) in props.books"
            :key="book.id"
            :style="{ width: `calc(100% / ${totalSlides})` }"
            class="slide"
            :class="{ visible: imageLoaded[index] }"
          >
            <AddToFavourites
              variant="circle"
              :book-id="book.id"
              class="slide__favourite"
            />

            <NuxtLinkLocale
              :to="`/books/${book.id}`"
              v-if="book.sale_price"
              class="slide__discount"
              :aria-label="`View details for book ${book.title}`"
            >
              <Icon name="mdi:cart-percent" size="24px" />
            </NuxtLinkLocale>

            <NuxtLinkLocale :to="`/books/${book.id}`" class="slide__link">
              <img
                :src="book.cover_url"
                :alt="`${book.title} book cover`"
                @load="onImageLoad(index)"
                :class="['slide__image']"
                :aria-label="`View details for book ${book.title}`"
              />
              <p class="slide__title">{{ book.title }}</p>
            </NuxtLinkLocale>

            <NuxtLinkLocale
              :to="`/authors/${book.author?.id}`"
              class="slide__author"
              :aria-label="`View author ${book.author.name}`"
            >
              {{ book.author.name }}
            </NuxtLinkLocale>

            <p class="slide__price">
              <span v-if="book.sale_price" class="slide__price--old">
                {{ formatNumberToEuro(book.price, locale) }}
              </span>
              <span class="slide__price--current">
                {{ formatNumberToEuro(book.sale_price ?? book.price, locale) }}
              </span>
            </p>

            <FormButton
              v-if="user"
              @click="cartStore.addToCart(book.id)"
              type="button"
              :variant="cartStore.isInCart(book.id) ? 'tertiary' : 'primary'"
              size="md"
              :disabled="book.stock === 0 || cartStore.isInCart(book.id)"
              class="slide__button"
              :class="{ 'slide__button--extra-margin': !book.sale_price }"
            >
              {{
                book.stock === 0
                  ? t('book.actions.unavailable')
                  : cartStore.isInCart(book.id)
                    ? t('book.actions.addedToBasket')
                    : t('book.actions.addToBasket')
              }}
            </FormButton>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  padding-bottom: $spacing-6;
}

.carousel__heading {
  @include flex(row, space-between, center);
  padding-bottom: $spacing-6;
}

.carousel__title {
  font-size: $font-size-2xl;
  font-weight: 700;
}

.carousel__buttons {
  display: flex;
  gap: $spacing-1;

  button {
    @include flex();
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background-color: $color-gray-200;

      html.dark & {
        background-color: $color-gray-800;
      }
    }

    &:disabled {
      color: $color-gray-300;

      html.dark & {
        color: $color-gray-800;
      }

      &:hover {
        background-color: $color-gray-100;
        cursor: not-allowed;

        html.dark & {
          background-color: $color-gray-900;
        }
      }
    }
  }
}

.carousel__view {
  overflow: hidden;
  width: 100%;
  min-height: 375px;

  @media (min-width: $screen-md) {
    min-height: 440px;
  }
}

.carousel__track {
  @include flex(row, flex-start, flex-start);
  gap: $spacing-5;
  transition: transform 0.3s ease-in-out;
}

.slide {
  position: relative;
  @include flex(column, flex-start, center);
  gap: $spacing-1;
  perspective: 700px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  &:has(.slide__discount:hover) .slide__title {
    color: $color-blue-500;
  }
}

.slide__discount {
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

.slide__favourite {
  z-index: 1;
  position: absolute;
  top: 5%;
  right: 5%;
}

.slide__link {
  @include flex(column, center, center);

  &:hover {
    cursor: pointer;
  }

  &:hover .slide__title {
    color: $color-blue-500;
  }
}

.slide__image {
  width: 100%;
  margin-bottom: $spacing-3;
  border-radius: $radius-4;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  transition: all 0.3s ease;
}

.slide__title {
  @include flex(column, center, center);
  max-width: 90%;
  height: 48px;
  font-size: $font-size-lg;
  font-weight: 700;
  text-align: center;
  line-height: normal;
  transition: all 0.4s ease;
}

.slide__author {
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

.slide__price {
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

.slide__button {
  margin-top: $spacing-3;

  &--extra-margin {
    margin-top: $spacing-3;
  }
}
</style>
