<script lang="ts" setup>
</script>

<template>
  <div class="carousel-container">
    <div class="carousel-heading">
      <h4>Carousel Title</h4>
      <div class="carousel-nav-btns">
        <button>-</button>
        <button>+</button>
      </div>
    </div>
    <div class="carousel-content">
      <div>slide 1</div>
      <div>slide 2</div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container{
  background-color: gray;
}

.carousel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
