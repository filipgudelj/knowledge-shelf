<script setup lang="ts">
// PROPS
const props = defineProps<{
  bookId: number
  variant: 'circle' | 'rectangle'
}>()

// STATE
const favouritesStore = useFavouritesStore()
const isFavourite = ref(false)

isFavourite.value = await favouritesStore.isBookFavourite(props.bookId)

// HANDLERS
const toggleFavourite = async () => {
  if (isFavourite.value) {
    await favouritesStore.removeFavourite(props.bookId)
  } else {
    await favouritesStore.addFavourite(props.bookId)
  }
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
  background-color: $color-gray-200;
  color: $color-gray-900;
  transition: all 0.3s ease;

  &--circle {
    padding: $spacing-3 $spacing-3;
    border-radius: 50%;
  }

  &--rectangle {
    padding: $spacing-4 $spacing-7;
    border-radius: $radius-3;
  }

  html.dark & {
    &:hover {
      background-color: $color-gray-500;
    }
  }

  &:hover {
    background-color: $color-gray-400;
  }
}

.favourite__icon {
  width: 24px;
  height: 24px;
}
</style>
