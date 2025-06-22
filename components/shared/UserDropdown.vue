<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
const authStore = useAuthStore()
const showMenu = ref(false)

// TOGGLE
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// HANDLERS
const handleLogout = () => {
  toggleMenu()
  authStore.logout()
}
</script>

<template>
  <div v-if="user" class="dropdown">
    <button @click="toggleMenu" class="dropdown__button">
      {{ user?.email?.charAt(0).toUpperCase() }}
    </button>

    <div v-if="showMenu" class="dropdown__menu">
      <button class="dropdown__item">
        <div class="dropdown__label">Settings</div>
        <Icon name="mdi:chevron-right" size="20px" class="dropdown__icon" />
      </button>
      <button
        @click="handleLogout"
        class="dropdown__item dropdown__item--logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  @include flex();
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $color-gray-200;

  html.dark & {
    background-color: $color-gray-800;
  }
}

.dropdown__button {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.dropdown__menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 10;
  width: 150px;
  padding-inline: $spacing-4;
  padding-block: $spacing-4;
  border-radius: $radius-4;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.4);
  background-color: $color-gray-100;

  html.dark & {
    background-color: $color-gray-900;
  }

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    right: 10.5px;
    width: 0;
    height: 0;
    border-right: 6px solid transparent;
    border-bottom: 6px solid $color-gray-100;
    border-left: 6px solid transparent;

    html.dark & {
      border-bottom-color: $color-gray-900;
    }
  }
}

.dropdown__item {
  @include flex(row, space-between, center);
  width: 100%;
  padding-inline: $spacing-3;
  padding-block: $spacing-2;
  border-radius: $radius-3;
  transition: all 0.3s ease;

  html.dark & {
    &:hover {
      background-color: $color-gray-800;
    }
  }

  &:hover {
    background-color: $color-gray-200;

    .dropdown__icon {
      transform: translateX(2px);
    }
  }
}

.dropdown__icon {
  color: $color-gray-800;
  transition: transform 0.15s ease;

  html.dark & {
    color: $color-gray-200;
  }
}

.dropdown__item--logout {
  color: $color-red;
}
</style>
