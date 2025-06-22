<script lang="ts" setup>
// EMITS
const emit = defineEmits(['click'])
</script>

<template>
  <button type="submit" @click="emit('click')" class="button">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  width: 100%;
  padding: $spacing-4;
  border-radius: $radius-3;
  background-color: $color-blue-500;
  color: $color-gray-200;
  font-size: $font-size-lg;
  transition: all 0.3s ease;

  &:hover {
    background-color: $color-blue-400;
  }
}
</style>
