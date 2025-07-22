<template>
  <div class="layout">
    <Sidebar />
    <Topbar />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-rows: 80px 1fr;
  grid-template-columns: 80px 1fr;
  min-height: 100vh;
  background-color: $color-gray-100;
  color: $color-gray-900;

  html.dark & {
    background-color: $color-gray-900;
    color: $color-gray-200;
  }

  @media (min-width: $screen-md) {
    grid-template-columns: 250px 1fr;
  }
}

.content {
  grid-column: 2/3;
  @include flex(column, flex-start, center);
  width: 100%;
  min-width: 0;
  max-width: calc(1920px - 250px);
  margin-inline: auto;
  padding-inline: $spacing-6;
}
</style>
