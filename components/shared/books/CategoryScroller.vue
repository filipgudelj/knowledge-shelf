<script lang="ts" setup>
import type { Category } from '@/types'

// PROPS
const props = defineProps<{ categories: Category[] }>()

// STATE
const route = useRoute()
const { t, locale } = useI18n()

// COMPUTEDS
const activeCategory = computed(() => {
  return (route.params.category as string) || 'all'
})

// HELPERS
const localizedName = (category: Category) => category.name[locale.value]
</script>

<template>
  <div class="scrollmenu">
    <NuxtLinkLocale
      :to="{ path: '/explore/all', query: route.query }"
      :class="[
        'scrollmenu__item',
        { 'scrollmenu__item--active': activeCategory === 'all' },
      ]"
      :aria-label="`Go to ${t('explore.categories.all')}`"
    >
      {{ $t('explore.categories.all') }}
    </NuxtLinkLocale>

    <NuxtLinkLocale
      v-for="category in props.categories"
      :key="category.id"
      :to="{ path: `/explore/${category.slug}`, query: route.query }"
      class="scrollmenu__item"
      :class="{ 'scrollmenu__item--active': category.slug === activeCategory }"
      :aria-label="`Go to ${localizedName(category)}`"
    >
      {{ localizedName(category) }}
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

.scrollmenu__item {
  display: inline-block;
  margin: 0 $spacing-6 $spacing-2 0;
  padding-block: $spacing-2;
  font-weight: 700;
  transition: all 0.3s ease;

  @media (min-width: $screen-lg) {
    font-size: $font-size-lg;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: $color-blue-500;
  }

  &--active {
    color: $color-blue-500;
  }
}
</style>
