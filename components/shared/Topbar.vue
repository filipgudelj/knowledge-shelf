<template>
  <div class="topbar">
    <Searchbar />
    <div class="topbar__right">
      <ThemeSwitcher />
      <UserDropdown />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topbar {
  grid-column: 2/3;
  @include flex(row, space-between, center);
  padding: $spacing-5;
  border-bottom: 1px solid $color-gray-300;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }
}

.topbar__right {
  @include flex();
  gap: $spacing-3;
}
</style>
