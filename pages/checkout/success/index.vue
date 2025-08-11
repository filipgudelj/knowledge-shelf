<script setup lang="ts">
definePageMeta({ ssr: false })

const route = useRoute()
const sessionId = route.query.session_id as string | undefined
const status = ref<'saving' | 'ok' | 'error'>('saving')
const orderId = ref<number | null>(null)

onMounted(async () => {
  if (!sessionId) {
    await navigateTo('/checkout', { replace: true })
    return
  }

  try {
    const res = await $fetch<{ ok: boolean; order_id: number }>(
      '/api/stripe/confirm',
      {
        params: { session_id: sessionId },
      },
    )
    orderId.value = res.order_id
    status.value = 'ok'

    const url = new URL(window.location.href)
    url.searchParams.delete('session_id')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  } catch {
    await navigateTo('/checkout', { replace: true })
    return
  }
})
</script>

<template>
  <div style="padding: 2rem; text-align: center">
    <h1 v-if="status === 'ok'">✅ Payment Successful</h1>
    <p v-if="status === 'ok'">Order saved. #{{ orderId }}</p>
  </div>
</template>
