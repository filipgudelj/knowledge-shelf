<script lang="ts" setup>
// TYPES
type Category = { label: string; value: string; slug: string }

// PROPS
const props = defineProps<{ categories: Category[] }>()

// STATE
const route = useRoute()

// COMPUTEDS
const activeCategory = computed(() => {
  return (route.params.category as string) || 'all'
})
</script>

<template>
  <div class="scrollmenu">
    <NuxtLinkLocale
      v-for="category in props.categories"
      :key="category.value"
      :to="`/explore/${category.slug}`"
      class="scrollmenu-item"
      :class="{ 'scrollmenu-item--active': category.slug === activeCategory }"
      :aria-label="`Go to ${category.label}`"
      >{{ category.label }}
    </NuxtLinkLocale>
  </div>
</template>

<style lang="scss" scoped>
.scrollmenu {
  width: 100%;
  overflow: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $radius-3;
    background-color: $color-gray-300;

    &:hover {
      cursor: pointer;
      background-color: $color-gray-400;

      html.dark & {
        background-color: $color-gray-600;
      }
    }

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
}

.scrollmenu-item {
  display: inline-block;
  margin: $spacing-3 $spacing-6 $spacing-3 0;
  padding-block: $spacing-2;
  transition: all 0.3s ease;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: $color-blue-500;
  }
}

.scrollmenu-item--active {
  color: $color-blue-500;
}
</style>
