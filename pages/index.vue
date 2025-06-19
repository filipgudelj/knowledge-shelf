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
    <Carousel title="Title 1" />
  </Section>

  <Section>
    <Carousel title="Title 2" />
  </Section>

  <Section>
    <Carousel title="Title 3" />
  </Section>
</template>
