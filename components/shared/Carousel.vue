<script lang="ts" setup>
import { ref, computed } from 'vue'

const slides = ['slide 1', 'slide 2', 'slide 3', 'slide 4', 'slide 5']
const visibleSlides = 3
const totalSlides = slides.length

const currentIndex = ref(0)

const maxIndex = computed(() => slides.length - visibleSlides)

const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const translateX = computed(() => {
  return `translateX(-${(100 / slides.length) * currentIndex.value}%)`
})
</script>

<template>
  <div class="carousel-container">
    <div class="carousel-heading">
      <h4>Carousel Title</h4>
      <div class="carousel-nav-btns">
        <button @click="prev">-</button>
        <button @click="next">+</button>
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
          {{ slide }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-container {
  padding: 1rem;
  background-color: $color-gray-200;
}

.carousel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carousel-view {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 1rem;
  transition: transform 0.3s ease-in-out;
}

.carousel-slide {
  padding: 1rem;
  border: 1px solid #aaa;
  background-color: white;
  text-align: center;
}
</style>
