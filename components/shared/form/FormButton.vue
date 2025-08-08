<script lang="ts" setup>
// PROPS
const props = defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

// EMITS
const emits = defineEmits(['click'])
</script>

<template>
  <button
    :type="props.type || 'button'"
    @click="emits('click')"
    :disabled="props.disabled"
    :class="[
      'button',
      `button--${props.variant}`,
      `button--${props.size || 'md'}`,
    ]"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  @include flex(row, center, center);
  width: 100%;
  padding: $spacing-4;
  border-radius: $radius-3;
  transition: all 0.3s ease;

  &--sm {
    padding: $spacing-3 $spacing-3;
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

    &:disabled {
      background-color: $color-gray-300;
      color: $color-gray-100;
      cursor: not-allowed;

      html.dark & {
        background-color: $color-gray-700;
        color: $color-gray-400;

        &:hover {
          background-color: $color-gray-700;
        }
      }

      &:hover {
        background-color: $color-gray-300;
      }
    }

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
    border: none;
    background-color: $color-gray-200;
    color: $color-gray-900;

    &:disabled {
      background-color: $color-gray-300;
      color: $color-gray-100;
      cursor: not-allowed;

      html.dark & {
        background-color: $color-gray-700;
        color: $color-gray-400;

        &:hover {
          background-color: $color-gray-700;
        }
      }

      &:hover {
        background-color: $color-gray-300;
      }
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

  &--tertiary {
    border: none;
    background-color: $color-green-500;
    color: $color-gray-100;

    &:disabled {
      background-color: $color-green-300;
      color: $color-gray-100;
      cursor: not-allowed;

      html.dark & {
        background-color: $color-green-900;
        color: $color-gray-500;

        &:hover {
          background-color: $color-green-900;
        }
      }

      &:hover {
        background-color: $color-green-300;
      }
    }

    html.dark & {
      &:hover {
        background-color: $color-green-700;
      }
    }

    &:hover {
      background-color: $color-green-700;
    }
  }
}
</style>
