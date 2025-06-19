<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <button class="sidebar__logo" aria-label="Knowledge Shelf Home">
        <Icon
          name="mdi:book-open-page-variant"
          size="40px"
          class="sidebar__logo-icon"
        />
        <span class="sidebar__logo-text">KNOWLEDGE SHELF</span>
      </button>
    </div>

    <div class="sidebar__nav">
      <button class="sidebar__nav-item" aria-label="Go to Home">
        <Icon name="mdi:home-variant-outline" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.home') }}</span>
      </button>
      <button class="sidebar__nav-item" aria-label="Go to Explore">
        <Icon name="mdi:explore" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.explore') }}</span>
      </button>
      <button class="sidebar__nav-item" aria-label="Go to Favourites">
        <Icon name="mdi:favorite-border" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.favourites') }}</span>
      </button>
      <button class="sidebar__nav-item" aria-label="Go to Cart">
        <Icon name="mdi:cart-outline" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.cart') }}</span>
      </button>

      <div class="sidebar__nav-divider"></div>

      <LangSwitcher />

      <div class="sidebar__nav-divider"></div>

      <button class="sidebar__nav-item" aria-label="Go to Login">
        <Icon name="mdi:login-variant" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.login') }}</span>
      </button>
      <button class="sidebar__nav-item" aria-label="Go to Register">
        <Icon name="mdi:register-outline" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.register') }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  grid-column: 1/2;
  grid-row: 1/3;
  display: grid;
  grid-template-rows: 80px 1fr;
  border-right: 1px solid $color-gray-300;
}

.sidebar__header {
  @include flex();
  padding-inline: $spacing-4;
  color: $color-blue-500;
  @media (min-width: $screen-md) {
    color: $color-black;
  }
}

.sidebar__logo {
  @include flex();
  width: 100%;

  @media (min-width: $screen-md) {
    @include flex(row, flex-start, center);
  }
}

.sidebar__logo-icon {
  display: block;
  @media (min-width: $screen-md) {
    display: none;
  }
}

.sidebar__logo-text {
  display: none;
  font-family: $font-family-logo;
  @media (min-width: $screen-md) {
    display: block;
    font-size: $font-size-xl;
    font-weight: 700;
  }
}

.sidebar__nav {
  @include flex(column, flex-start, center);
  gap: $spacing-2;
  padding-inline: $spacing-4;
}

.sidebar__nav-item {
  @include flex(row, center, center);
  gap: $spacing-2;
  width: 100%;
  padding-block: $spacing-2;
  border-radius: $radius-5;
  font-size: $font-size-xl;
  transition: all 0.3s ease;
  @media (min-width: $screen-md) {
    @include flex(row, flex-start, center);
  }

  &:hover {
    background-color: $color-gray-200;
  }
}

.sidebar__nav-label {
  display: none;
  @media (min-width: $screen-md) {
    display: block;
    font-weight: 700;
    line-height: 20px;
  }
}

.sidebar__nav-divider {
  width: calc(100% + $spacing-4 * 2);
  height: 1px;
  margin-block: $spacing-4;
  background-color: $color-gray-300;
}
</style>
