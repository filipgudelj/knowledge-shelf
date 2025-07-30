<script lang="ts" setup>
import type { Book } from '~/types'
import { useWindowSize } from '@vueuse/core'
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = withDefaults(defineProps<{ title?: string; books: Book[] }>(), {
  title: '',
  books: () => [],
})

// STATE
const currentSlideIndex = ref(0)
const { width } = useWindowSize()

// COMPUTEDS
const totalSlides = computed(() => props.books.length)

const visibleSlides = computed(() => {
  if (width.value < 567) return 1
  if (width.value < 900) return 2
  if (width.value < 1150) return 3
  if (width.value < 1450) return 4
  if (width.value < 1700) return 5
  return 6
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
          <div
            v-for="book in books"
            :key="book.id"
            :style="{
              width: `calc(100% / ${totalSlides})`,
            }"
            class="slide"
          >
            <img :src="book.cover_url" :alt="book.title" class="slide__image" />
            <p class="slide__title">{{ book.title }}</p>
            <p class="slide__author">{{ book.author.name }}</p>
            <p class="slide__price">{{ formatNumberToEuro(book.price) }}</p>
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
  padding-block: $spacing-6;
}

.carousel__title {
  font-size: $font-size-2xl;
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
}

.carousel__track {
  @include flex(row, flex-start, flex-start);
  gap: $spacing-5;
  transition: transform 0.3s ease-in-out;
}

.slide {
  @include flex(column, flex-start, center);
  gap: $spacing-1;
}

.slide__image {
  width: 100%;
  margin-bottom: $spacing-3;
  border-radius: $radius-4;
}

.slide__title {
  max-width: 90%;
  font-size: $font-size-lg;
  text-align: center;
}

.slide__author {
  color: $color-gray-600;

  html.dark & {
    color: $color-gray-500;
  }
}

.slide__price {
  font-size: $font-size-lg;
}
</style>
