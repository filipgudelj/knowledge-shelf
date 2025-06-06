<template>
  <div class="layout">
    <Sidebar class="sidebar" />

    <Topbar class="topbar" />

    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  min-height: 100vh;
}

.sidebar {
  grid-column: 1/2;
  grid-row: 1/3;
  border-right: 1px solid black;
}

.topbar {
  grid-column: 2/3;
  border-bottom: 1px solid black;
}

.content {
  grid-column: 2/3;
}
</style>
