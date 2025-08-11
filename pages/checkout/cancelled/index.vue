<template>
  <div class="cancelled">
    <div class="cancelled__header">
      <div class="cancelled__icon">
        <Icon name="mdi:cancel-circle-outline" size="48px" />
      </div>
      <h1>Payment Cancelled</h1>
    </div>
    <p class="cancelled__description">Your order was not completed.</p>
  </div>
</template>

<style lang="scss" scoped>
.cancelled {
  @include flex(column, flex-start, flex-start);
  width: 100%;
  gap: $spacing-5;
  margin-top: $spacing-6;
}

.cancelled__header {
  @include flex(row, flex-start, center);
  width: 100%;
  gap: $spacing-4;
  margin-top: $spacing-6;
}

.cancelled__icon {
  width: 48px;
  height: 48px;
  color: $color-red-500;
}

.cancelled__description {
  font-size: $font-size-lg;
}
</style>
