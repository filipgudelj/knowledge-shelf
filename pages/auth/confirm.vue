<script setup lang="ts">
// STATE
const user = useSupabaseUser()

// WATCHERS
watch(
  user,
  async () => {
    if (user.value) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return navigateTo('/')
    }
  },

  { immediate: true },
)
</script>

<template>
  <div class="confirm">
    <p>Thank you! Your email is now verified.</p>
    <p>You're being redirected to your dashboard...</p>
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  @include flex(column, center, center);
  gap: $spacing-5;
  margin-top: $spacing-7;
}
</style>
