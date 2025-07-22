<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = withDefaults(defineProps<{ title?: string }>(), { title: '' })

// STATE
const slides = [
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
  {
    title: 'Title',
    author: 'Author',
    price: 10,
    image: '/images/book.jpg',
  },
]
const totalSlides = slides.length
const currentSlideIndex = ref(0)
const { width } = useWindowSize()

// CAROUSEL NAVIGATION
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

// COMPUTED
const visibleSlides = computed(() => {
  if (width.value < 475) return 1
  if (width.value < 900) return 2
  if (width.value < 1200) return 3
  if (width.value < 1500) return 4
  return 5
})
const isPreviousButtonDisabled = computed(() => currentSlideIndex.value === 0)
const isNextButtonDisabled = computed(
  () => currentSlideIndex.value === maxSlideIndex.value,
)
const maxSlideIndex = computed(() => slides.length - visibleSlides.value)
const translateX = computed(() => {
  return `translateX(-${(100 / slides.length) * currentSlideIndex.value}%)`
})

// WATCHERS
watch(width, () => {
  currentSlideIndex.value = 0
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
          <div
            v-for="(slide, index) in slides"
            :key="index"
            :style="{
              width: `calc(100% / ${totalSlides})`,
            }"
            class="slide"
          >
            <img :src="slide.image" :alt="slide.title" class="slide__image" />
            <p class="slide__title">{{ slide.title }}</p>
            <p class="slide__author">{{ slide.author }}</p>
            <p class="slide__price">{{ formatNumberToEuro(slide.price) }}</p>
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
  padding-block: $spacing-5;
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
