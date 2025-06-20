<template>
  <button class="dropdown">F</button>
</template>

<style lang="scss" scoped>
.dropdown {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $color-gray-200;
  font-size: $font-size-sm;

  html.dark & {
    background-color: $color-gray-800;
  }
}
</style>
