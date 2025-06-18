<script lang="ts" setup>
import { formatNumberToEuro } from '~/helpers/formatters'

// PROPS
const props = withDefaults(defineProps<{ title?: string }>(), { title: '' })

// STATE
const slides = [
  {
    title: 'The Dawn of Vue',
    author: 'Alice Johnson',
    price: 20,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'Mastering Nuxt',
    author: 'Bob Smith',
    price: 25,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'Frontend First',
    author: 'Clara Davis',
    price: 18,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'Scaling Components',
    author: 'David Lee',
    price: 22,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'Patterns & Practices',
    author: 'Ella Brown',
    price: 30,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'Designing UX',
    author: 'Frank Moore',
    price: 19,
    image: '/images/test-book-img.jpg',
  },
  {
    title: 'TypeScript in Depth',
    author: 'Grace Wilson',
    price: 27,
    image: '/images/test-book-img.jpg',
  },
]
const visibleSlides = 3
const totalSlides = slides.length
const currentSlideIndex = ref(0)

// NAVIGATION FUNCTIONS
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
const isPreviousButtonDisabled = computed(() => currentSlideIndex.value === 0)
const isNextButtonDisabled = computed(
  () => currentSlideIndex.value === maxSlideIndex.value,
)
const maxSlideIndex = computed(() => slides.length - visibleSlides)
const translateX = computed(() => {
  return `translateX(-${(100 / slides.length) * currentSlideIndex.value}%)`
})
</script>

<template>
  <div class="carousel">
    <div class="carousel__heading">
      <h4>{{ props.title }}</h4>
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
</template>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  padding-block: $spacing-6;
  background-color: $color-white;
}

.carousel__heading {
  @include flex(row, space-between, center);
  padding-block: $spacing-5;
}

.carousel__buttons {
  display: flex;
  gap: $spacing-1;

  button {
    @include flex();
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $color-gray-800;
    transition: all 0.3s ease;

    &:hover {
      background-color: $color-gray-200;
    }

    &:disabled {
      color: $color-gray-300;

      &:hover {
        cursor: not-allowed;
        background-color: $color-white;
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
  height: 275px;
  margin-bottom: $spacing-3;
}

.slide__title {
  max-width: 90%;
  color: $color-black;
  font-size: $font-size-lg;
  text-align: center;
}

.slide__author {
  color: $color-gray-700;
}

.slide__price {
  color: $color-black;
  font-size: $font-size-lg;
}
</style>
