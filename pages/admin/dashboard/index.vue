<script lang="ts" setup>
// STATE
const { t, locale } = useI18n()

// HEAD
useHead(() => ({
  title: t('seo.dashboard.title'),
  meta: [{ name: 'description', content: t('seo.dashboard.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>

    <ClientOnly>
      <RevenueLine />

      <div class="dashboard__flex">
        <CategoryDonut />
        <TopBooks />
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  @include flex(column, flex-start, flex-start);
  gap: $spacing-5;
  margin-top: $spacing-6;
}

.dashboard__flex {
  display: grid;
  @include flex(column);
  gap: $spacing-3;
  width: 100%;

  @media (min-width: $screen-lg) {
    @include flex(row);
  }
}
</style>
