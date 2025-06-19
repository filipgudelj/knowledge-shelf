<script setup>
// STATE
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// COMPUTED
const currentLocaleData = computed(() => {
  return locales.value.find((i) => i.code === locale.value)
})
const nextLocaleCode = computed(() => (locale.value === 'en' ? 'hr' : 'en'))
</script>

<template>
  <NuxtLink
    :to="switchLocalePath(nextLocaleCode)"
    :key="locale.code"
    class="lang-switcher__link"
    :aria-label="`Switch language to ${nextLocaleCode.toUpperCase()}`"
  >
    <img
      :src="currentLocaleData.flag"
      :alt="`Flag of ${currentLocaleData.name}`"
      class="lang-switcher__flag"
    />
    <span class="lang-switcher__label">{{ currentLocaleData.name }}</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.lang-switcher__link {
  @include flex(row, center, center);
  gap: $spacing-2;
  width: 100%;
  padding-block: $spacing-2;
  border-radius: $radius-5;
  font-size: $font-size-xl;
  transition: all 0.3s ease;
  @media (min-width: $screen-md) {
    @include flex(row, flex-start, center);
  }

  &:hover {
    background-color: $color-gray-300;
  }
}

.lang-switcher__flag {
  width: 24px;
  height: 24px;
  margin: $spacing-2;
}

.lang-switcher__label {
  display: none;
  @media (min-width: $screen-md) {
    display: block;
    font-weight: 700;
    line-height: 20px;
  }
}
</style>
