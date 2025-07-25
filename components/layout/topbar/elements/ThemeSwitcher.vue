<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

// STATE
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <ClientOnly>
    <button
      @click="toggleDark()"
      class="theme-switcher"
      aria-label="Theme Switcher"
    >
      <div
        class="theme-switcher__thumb"
        :class="{ 'theme-switcher__thumb--dark': isDark }"
      >
        <Icon
          :name="
            isDark ? 'mdi:moon-waning-crescent' : 'mdi:white-balance-sunny'
          "
          class="theme-switch__icon"
        />
      </div>
    </button>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.theme-switcher {
  position: relative;
  width: 56px;
  height: 32px;
  border: 1px solid $color-gray-400;
  border-radius: $radius-9;
  background-color: $color-gray-200;
  transition: all 0.3s ease;

  html.dark & {
    border: 1px solid $color-gray-600;
    background-color: $color-gray-800;
  }

  &:hover {
    border: 1px solid $color-blue-500 !important;
  }
}

.theme-switcher__thumb {
  position: absolute;
  top: 3px;
  left: 4px;
  @include flex();
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: $color-gray-100;
  transform: translateX(0);
  transition: transform 0.5s ease !important;

  html.dark & {
    background-color: $color-gray-900;
  }
}

.theme-switcher__thumb--dark {
  transform: translateX(22px);
}

.theme-switch__icon {
  color: $color-gray-700;

  html.dark & {
    color: $color-gray-200;
  }
}
</style>
