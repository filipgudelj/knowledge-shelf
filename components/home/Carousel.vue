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
const { width } = useWindowSize()
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
  if (width.value < 510) return 1
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

watch(
  () => props.books,
  (newBooks) => {
    imageLoaded.value = newBooks.map(() => false)
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

// SKELETON LOADER
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
            :height="'400px'"
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
            <NuxtLinkLocale :to="`/books/${book.id}`" class="slide__link">
              <img
                :src="book.cover_url"
                :alt="book.title"
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
  @include flex(column, flex-start, center);
  gap: $spacing-1;
  perspective: 700px;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }
}

.slide__link {
  @include flex(column, center, center);

  &:hover {
    cursor: pointer;
  }

  &:hover .slide__image {
    transform: scale(0.9);
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
  max-width: 90%;
  font-size: $font-size-lg;
  font-weight: 700;
  text-align: center;
}

.slide__author {
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

.slide__price {
  font-size: $font-size-lg;
}
</style>
