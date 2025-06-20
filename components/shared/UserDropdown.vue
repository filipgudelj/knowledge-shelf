<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
const authStore = useAuthStore()
const showMenu = ref(false)

// TOGGLE
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <div v-if="user" class="dropdown">
    <button @click="toggleMenu" class="dropdown__button">
      {{ user?.email?.charAt(0).toUpperCase() }}
    </button>

    <div v-if="showMenu" class="dropdown__menu">
      <button class="dropdown__item">Settings</button>
      <button
        @click="authStore.logout"
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
}

.dropdown__item {
  @include flex(row, flex-start, center);
  width: 100%;
  padding-inline: $spacing-2;
  padding-block: $spacing-2;
  border-radius: $radius-3;

  &:hover {
    background-color: $color-gray-200;
  }
}

.dropdown__item--logout {
  color: $color-red;
}
</style>
