<script lang="ts" setup>
// PROPS
const props = defineProps<{
  type: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}>()

// EMITS
const emits = defineEmits(['click'])
</script>

<template>
  <button
    type="submit"
    @click="emits('click')"
    :class="[
      'button',
      `button--${props.type}`,
      `button--${props.size || 'md'}`,
    ]"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  width: 100%;
  padding: $spacing-4;
  border-radius: $radius-3;
  font-size: $font-size-lg;
  transition: all 0.3s ease;

  &--sm {
    padding: $spacing-2 $spacing-3;
    font-size: $font-size-sm;
  }

  &--md {
    padding: $spacing-3 $spacing-4;
    font-size: $font-size-md;
  }

  &--lg {
    padding: $spacing-4 $spacing-5;
    font-size: $font-size-lg;
  }

  &--primary {
    border: none;
    background-color: $color-blue-500;
    color: $color-gray-100;

    html.dark & {
      &:hover {
        background-color: $color-blue-700;
      }
    }

    &:hover {
      background-color: $color-blue-600;
    }
  }

  &--secondary {
    border: 1px solid $color-gray-300;
    background-color: $color-gray-200;
    color: $color-gray-900;

    html.dark & {
      &:hover {
        background-color: $color-gray-400;
      }
    }

    &:hover {
      background-color: $color-gray-300;
    }
  }
}
</style>
