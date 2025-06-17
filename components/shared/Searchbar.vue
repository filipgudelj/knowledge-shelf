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
  <div class="search-container">
    <input
      type="text"
      name="search"
      v-model="searchQuery"
      @keydown.enter="doSearch"
      placeholder="Search books..."
      class="search-input"
    />
    <button @click="doSearch" class="search-btn">
      <Icon name="mdi:search" size="24px" />
    </button>
    <button v-if="searchQuery" @click="clearSearch" class="remove-btn">
      <Icon name="mdi:remove" size="24px" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  position: relative;
}

.search-container:hover .search-input:focus {
  border: 1px solid $color-blue-800;
  background-color: $color-gray-300;
}

.search-input {
  width: 375px;
  height: 48px;
  padding-inline: 48px;
  border: 1px solid $color-gray-200;
  border-radius: $spacing-3;
  background-color: $color-gray-200;
  line-height: 48px;
  font-size: $font-size-lg;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid $color-gray-300;
    background-color: $color-gray-300;
  }

  &:focus {
    outline: none;
    border: 1px solid $color-blue-800;
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

.search-btn {
  @extend %icon-btn;
  left: 0;
  margin: 0 $spacing-3 0 $spacing-5;
}

.remove-btn {
  @extend %icon-btn;
  right: 0;
  margin: 0 $spacing-5 0 $spacing-3;
}
</style>
