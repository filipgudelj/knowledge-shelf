<script lang="ts" setup>
// PAGE META
useHead({
  title: 'Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Explore a curated selection of books.',
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
