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

      <div class="dashboard__row">
        <!-- <CategoryPie />
        <TopBooks /> -->
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

.dashboard__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-3;
}
</style>
