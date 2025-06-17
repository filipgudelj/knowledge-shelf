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
const visibleSlides = 5
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
  <div class="carousel-container">
    <div class="carousel-heading">
      <h4>{{ props.title }}</h4>
      <div class="carousel-btns">
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
    <div class="carousel-view">
      <div
        class="carousel-track"
        :style="{
          transform: translateX,
          width: `calc(100% * (${totalSlides} / ${visibleSlides}))`,
        }"
      >
        <div
          class="carousel-slide"
          :style="{
            width: `calc(100% / ${totalSlides})`,
          }"
          v-for="(slide, index) in slides"
          :key="index"
        >
          <img :src="slide.image" :alt="slide.title" class="slide-image" />
          <p class="slide-title">{{ slide.title }}</p>
          <p class="slide-author">{{ slide.author }}</p>
          <p class="slide-price">{{ formatNumberToEuro(slide.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-container {
  padding-block: $spacing-6;
  background-color: $color-white;
}

.carousel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: $spacing-5;
}

.carousel-btns {
  display: flex;
  gap: $spacing-1;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
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

.carousel-view {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: $spacing-5;
  transition: transform 0.3s ease-in-out;
}

.carousel-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-1;

  img {
    width: 100%;
    margin-bottom: $spacing-3;
  }

  .slide-title {
    max-width: 90%;
    color: $color-black;
    font-size: $font-size-lg;
    text-align: center;
  }

  .slide-author {
    color: $color-gray-700;
  }

  .slide-price {
    color: $color-black;
    font-size: $font-size-lg;
  }
}
</style>
