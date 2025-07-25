<script lang="ts" setup>
// PAGE META
useHead({
  title: 'Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Browse and buy books online from a wide range of categories.',
    },
  ],
})
</script>

<template>
  <Section>
    <Carousel :title="$t('carousel.title1')" />
  </Section>

  <Section>
    <Carousel :title="$t('carousel.title2')" />
  </Section>

  <Section>
    <Carousel :title="$t('carousel.title3')" />
  </Section>
</template>
