<script lang="ts" setup>
// STATE
const searchQuery = ref('')

// SEARCH FUNCTIONS
const doSearch = () => {
  console.log(`Search ${searchQuery.value}`)
}
const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="search">
    <input
      type="text"
      name="search"
      v-model="searchQuery"
      @keydown.enter="doSearch"
      placeholder="Search books..."
      class="search__input"
    />
    <button @click="doSearch" class="search__button" aria-label="Search">
      <Icon name="mdi:search" size="24px" />
    </button>
    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="search__button--clear"
      aria-label="Clear search"
    >
      <Icon name="mdi:remove" size="24px" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search {
  position: relative;
}

.search:hover .search__input:focus {
  border: 1px solid $color-blue-500;
  background-color: $color-gray-300;
}

.search__input {
  width: 225px;
  height: 48px;
  padding-inline: 48px;
  border: 1px solid $color-gray-200;
  border-radius: $spacing-3;
  background-color: $color-gray-200;
  line-height: 48px;
  font-size: $font-size-lg;
  transition: all 0.3s ease;

  @media (min-width: $screen-sm) {
    width: 300px;
  }

  @media (min-width: $screen-md) {
    width: 350px;
  }

  &:hover {
    border: 1px solid $color-gray-300;
    background-color: $color-gray-300;
  }

  &:focus {
    outline: none;
    border: 1px solid $color-blue-500;
  }

  &::placeholder {
    color: $color-gray-600;
  }
}

%icon-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: $color-gray-800;
}

.search__button {
  @extend %icon-btn;
  left: 0;
  margin: 0 $spacing-3 0 $spacing-5;
}

.search__button--clear {
  @extend %icon-btn;
  right: 0;
  margin: 0 $spacing-5 0 $spacing-3;
}
</style>
