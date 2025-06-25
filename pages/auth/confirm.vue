<script lang="ts" setup>
const user = useSupabaseUser()

// WATCHERS
// watch(
//   user,
//   async () => {
//     if (user.value) {
//       await new Promise((resolve) => setTimeout(resolve, 2000))
//       return navigateTo('/')
//     }
//   },
//   { immediate: true },
// )
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
  height: 100%;
  gap: $spacing-3;
}

.confirm__text {
  font-size: $font-size-xl;
}

.confirm__icon {
  color: $color-green;
}
</style>
