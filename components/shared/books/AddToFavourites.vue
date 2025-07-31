<script setup lang="ts">
// PROPS
const props = defineProps<{
  variant: 'circle' | 'rectangle'
}>()

// STATE
const isFavourite = ref(false)

// HANDLERS
const toggleFavourite = () => {
  isFavourite.value = !isFavourite.value
}
</script>

<template>
  <button
    @click="toggleFavourite"
    :class="['favourite', `favourite--${props.variant || 'circle'}`]"
    :aria-label="isFavourite ? 'Remove from favourites' : 'Add to favourites'"
  >
    <icon
      :name="isFavourite ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
      size="24px"
      class="favourite__icon"
    />
  </button>
</template>

<style lang="scss" scoped>
.favourite {
  @include flex(flex, center, center);
  border: 1px solid $color-gray-300;
  background-color: $color-gray-200;
  color: $color-gray-900;
  transition: all 0.3s ease;

  &--circle {
    padding: $spacing-5 $spacing-5;
    border-radius: 50%;
  }

  &--rectangle {
    padding: $spacing-4 $spacing-7;
    border-radius: $radius-3;
  }

  html.dark & {
    &:hover {
      background-color: $color-gray-400;
    }
  }

  &:hover {
    background-color: $color-gray-300;
  }
}

.favourite__icon {
  width: 24px;
  height: 24px;
}
</style>
