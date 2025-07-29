<template>
  <div class="loader" />
</template>

<style lang="scss" scoped>
.loader {
  width: 48px;
  height: 48px;
  margin: $spacing-12 0;
  border: 6px solid $color-gray-200;
  border-top: 6px solid $color-blue-500;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;

  html.dark & {
    border: 6px solid $color-gray-800;
    border-top: 6px solid $color-blue-500;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
