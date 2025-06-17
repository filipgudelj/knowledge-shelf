<script setup lang="ts"></script>

<template>
  <div class="topbar">
    <Searchbar />
    <UserDropdown />
  </div>
</template>

<style lang="scss" scoped>
.topbar {
  grid-column: 2/3;
  border-bottom: 1px solid $color-gray-300;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-5;
}
</style>
