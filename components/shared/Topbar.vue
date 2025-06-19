<template>
  <div class="topbar">
    <Searchbar />
    <UserDropdown />
  </div>
</template>

<style lang="scss" scoped>
.topbar {
  grid-column: 2/3;
  @include flex(row, space-between, center);
  padding: $spacing-5;
  border-bottom: 1px solid $color-gray-300;
}
</style>
