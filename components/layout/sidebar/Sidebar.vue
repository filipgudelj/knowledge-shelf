<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
const cartStore = useCartStore()
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

      <ClientOnly>
        <NuxtLinkLocale
          v-if="user"
          :to="'/cart'"
          class="sidebar__nav-item sidebar__nav-cart"
          aria-label="Go to Cart"
        >
          <Icon name="mdi:cart-outline" size="32px"></Icon>
          <span v-if="cartStore.cartCount > 0" class="sidebar__nav-cart-badge">
            {{ cartStore.cartCount }}
          </span>
          <span class="sidebar__nav-label">{{ $t('sidebar.cart') }}</span>
        </NuxtLinkLocale>
      </ClientOnly>

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
  background-color: $color-gray-100;

  html.dark & {
    border-right: 1px solid $color-gray-700;
    background-color: $color-gray-900;
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

.sidebar__nav-cart {
  position: relative;
}

.sidebar__nav-cart-badge {
  position: absolute;
  top: 0;
  left: 30px;
  @include flex(row, center, center);
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: $color-red-500;
  color: $color-gray-100;
  font-size: $font-size-xxs;

  @media (min-width: $screen-md) {
    left: 24px;
  }
}
</style>
