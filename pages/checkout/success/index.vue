<script setup lang="ts">
const route = useRoute()
const sessionId = route.query.session_id as string | undefined
</script>

<template>
  <div class="container" style="padding: 2rem; text-align: center">
    <h1>✅ Payment Successful</h1>
    <p>Thank you for your order!</p>
    <p v-if="sessionId">
      <small>Session ID: {{ sessionId }}</small>
    </p>
    <NuxtLinkLocale to="/books">← Continue Shopping</NuxtLinkLocale>
  </div>
</template>
