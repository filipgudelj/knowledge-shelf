<script setup lang="ts">
// STATE
const booksStore = useBooksStore()

// API
if (booksStore.categories.length === 0) {
  await booksStore.getCategories()
}
</script>

<template>
  <NuxtLayout name="default">
    <template #default>
      <CategoryScroller :categories="booksStore.categories" />
      <slot />
    </template>
  </NuxtLayout>
</template>
