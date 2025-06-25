<script lang="ts" setup>
//META
definePageMeta({
  middleware: ['confirm'],
})
</script>

<template>
  <div class="confirm">
    <Icon name="mdi:success-circle" size="64px" class="confirm__icon" />
    <p class="confirm__text">{{ $t('verification.emailVerified') }}</p>
    <p class="confirm__subtext">{{ $t('verification.emailThanks') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  @include flex(column, center, center);
  gap: $spacing-3;
  margin-top: $spacing-10;
}

.confirm__text {
  font-size: $font-size-xl;
}

.confirm__icon {
  color: $color-green;
}
</style>
