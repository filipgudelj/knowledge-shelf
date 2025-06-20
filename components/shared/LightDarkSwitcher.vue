<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <ClientOnly>
    <button @click="toggleDark()" class="light-dark-switcher__button">
      <Icon
        :name="isDark ? 'mdi:moon-waning-crescent' : 'mdi:white-balance-sunny'"
        size="32px"
        class="light-dark-switcher__icon"
      />
    </button>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.light-dark-switcher__button {
  @include flex();
  transition: all 0.3s ease;

  &:hover {
    color: $color-blue-500;
  }
}
</style>
