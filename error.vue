<script setup lang="ts">
import type { NuxtError } from '#app'

// PROPS
const props = defineProps({
  error: Object as () => NuxtError,
})

// STATE
const localePath = useLocalePath()

// HANDLERS
const handleError = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <div class="error">
    <h1 class="error__code">{{ props.error?.statusCode }}</h1>
    <p class="error__message">{{ props.error?.message }}</p>
    <button @click="handleError" class="error__button">Back to home</button>
    <div class="error__image" />
  </div>
</template>

<style lang="scss" scoped>
.error {
  @include flex(column, center, center);
  gap: $spacing-2;
  width: 100vw;
  height: 100vh;
}

.error__code {
  color: $color-blue-500;
}

.error__message {
  color: $color-gray-700;
  font-size: $font-size-lg;
  text-align: center;

  html.dark & {
    color: $color-gray-300;
  }
}

.error__button {
  margin-top: $spacing-4;
  padding-block: $spacing-2;
  padding-inline: $spacing-4;
  border: 1px solid $color-blue-500;
  background-color: $color-gray-100;
  color: $color-blue-500;
  transition: all 0.3s ease;

  html.dark & {
    background-color: $color-gray-900;
  }

  &:hover {
    background-color: $color-gray-200;

    html.dark & {
      background-color: $color-gray-800;
    }
  }
}

.error__image {
  width: 100%;
  height: 220px;
  margin-top: $spacing-6;
  border-radius: $radius-4;
  background-image: url('/svgs/feeling-blue.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
