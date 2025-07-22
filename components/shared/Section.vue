<template>
  <section class="section">
    <slot />
  </section>
</template>

<style lang="scss" scoped>
.section {
  @include flex(row, center, flex-start);
}
</style>
