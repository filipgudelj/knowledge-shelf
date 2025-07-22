<script lang="ts" setup>
const categories = [
  { label: 'All', value: 'all', slug: 'all' },
  { label: 'Art and Design', value: 'art and design', slug: 'art-and-design' },
  { label: 'Biography', value: 'biography', slug: 'biography' },
  {
    label: 'Business, Economics and Law',
    value: 'business, economics and law',
    slug: 'business-economics-and-law',
  },
  { label: 'Computing', value: 'computing', slug: 'computing' },
  {
    label: 'Crime and Thrillers',
    value: 'crime and thrillers',
    slug: 'crime-and-thrillers',
  },
  { label: 'Education', value: 'education', slug: 'education' },
  { label: 'Fiction', value: 'fiction', slug: 'fiction' },
  { label: 'Graphic Novels', value: 'graphic novels', slug: 'graphic-novels' },
  {
    label: 'Health and Wellbeing',
    value: 'health and wellbeing',
    slug: 'health-and-wellbeing',
  },
  { label: 'History', value: 'history', slug: 'history' },
  {
    label: 'Science and Nature',
    value: 'science and nature',
    slug: 'science-and-nature',
  },
  { label: 'Travel', value: 'travel', slug: 'travel' },
]
</script>

<template>
  <div class="scrollmenu">
    <NuxtLinkLocale
      v-for="category in categories"
      :key="category.value"
      :to="`/explore/${category.slug}`"
      class="scrollmenu-item"
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
</style>
