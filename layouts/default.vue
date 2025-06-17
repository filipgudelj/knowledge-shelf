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
  grid-template-columns: 250px 1fr;
  grid-template-rows: 80px 1fr;
  min-height: 100vh;
}

.content {
  grid-column: 2/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: $spacing-5;
}
</style>
