<script setup lang="ts">
const user = useSupabaseUser()

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
  <div>Email Verification</div>
  <div>Your email was confirmed</div>
  <div>Waiting for login...</div>
</template>
