<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <NuxtLinkLocale
        :to="'/'"
        class="sidebar__logo"
        aria-label="Knowledge Shelf Home"
      >
        <Icon
          name="mdi:book-open-page-variant"
          size="40px"
          class="sidebar__logo-icon"
        />
        <span class="sidebar__logo-text">KNOWLEDGE SHELF</span>
      </NuxtLinkLocale>
    </div>

    <div class="sidebar__nav">
      <NuxtLinkLocale
        :to="'/'"
        class="sidebar__nav-item"
        aria-label="Go to Home"
      >
        <Icon name="mdi:home-variant-outline" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.home') }}</span>
      </NuxtLinkLocale>

      <NuxtLinkLocale
        :to="'/explore/all'"
        class="sidebar__nav-item"
        aria-label="Go to Explore"
      >
        <Icon name="mdi:explore" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.explore') }}</span>
      </NuxtLinkLocale>

      <NuxtLinkLocale
        :to="'/favourites'"
        class="sidebar__nav-item"
        aria-label="Go to Favourites"
      >
        <Icon name="mdi:favorite-border" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.favourites') }}</span>
      </NuxtLinkLocale>

      <NuxtLinkLocale
        :to="'/'"
        class="sidebar__nav-item"
        aria-label="Go to Cart"
      >
        <Icon name="mdi:cart-outline" size="32px" />
        <span class="sidebar__nav-label">{{ $t('sidebar.cart') }}</span>
      </NuxtLinkLocale>

      <div class="sidebar__nav-divider"></div>

      <LangSwitcher />

      <ClientOnly>
        <div v-if="!user" class="sidebar__nav-divider"></div>

        <NuxtLinkLocale
          v-if="!user"
          :to="'/auth/login'"
          class="sidebar__nav-item"
          aria-label="Go to Login"
        >
          <Icon name="mdi:login-variant" size="32px" />
          <span class="sidebar__nav-label">{{ $t('sidebar.login') }}</span>
        </NuxtLinkLocale>

        <NuxtLinkLocale
          v-if="!user"
          :to="'/auth/register'"
          class="sidebar__nav-item"
          aria-label="Go to Register"
        >
          <Icon name="mdi:register-outline" size="32px" />
          <span class="sidebar__nav-label">{{ $t('sidebar.register') }}</span>
        </NuxtLinkLocale>
      </ClientOnly>
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

  html.dark & {
    border-right: 1px solid $color-gray-700;
  }
}

.sidebar__header {
  @include flex();
  padding-inline: $spacing-4;
  color: $color-blue-500;

  @media (min-width: $screen-md) {
    color: $color-gray-900;

    html.dark & {
      color: $color-gray-200;
    }
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
  padding-inline: $spacing-2;
  border-radius: $radius-5;
  font-size: $font-size-xl;
  transition: all 0.3s ease;

  &:hover {
    background-color: $color-gray-200;

    html.dark & {
      background-color: $color-gray-800;
    }
  }

  @media (min-width: $screen-md) {
    @include flex(row, flex-start, center);
  }
}

.sidebar__nav-label {
  display: none;

  @media (min-width: $screen-md) {
    display: block;
    line-height: 20px;
    font-weight: 700;
  }
}

.sidebar__nav-divider {
  width: calc(100% + $spacing-4 * 2);
  height: 1px;
  margin-block: $spacing-4;
  background-color: $color-gray-300;

  html.dark & {
    background-color: $color-gray-700;
  }
}
</style>
