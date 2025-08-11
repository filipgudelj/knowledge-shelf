<script setup lang="ts">
// PAGE META
definePageMeta({ ssr: false })

// STATE
const route = useRoute()
const sessionId = route.query.session_id as string | undefined
const status = ref<'saving' | 'ok' | 'error'>('saving')
const orderId = ref<number | null>(null)
const cartStore = useCartStore()
const { locale, t } = useI18n()

// LCH
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

    cartStore.clearCart()

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

// HEAD
useHead(() => ({
  title: t('seo.checkout.success.title'),
  meta: [
    { name: 'description', content: t('seo.checkout.success.description') },
  ],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div v-if="status === 'ok'" class="success">
    <div class="success__header">
      <div class="success__icon">
        <Icon name="mdi:success-circle-outline" size="48px" />
      </div>
      <h1>Payment success</h1>
    </div>
    <p class="success__description">Your order was completed.</p>
  </div>
</template>

<style lang="scss" scoped>
.success {
  @include flex(column, flex-start, flex-start);
  width: 100%;
  gap: $spacing-5;
  margin-top: $spacing-6;
}

.success__header {
  @include flex(row, flex-start, center);
  width: 100%;
  gap: $spacing-4;
  margin-top: $spacing-6;
}

.success__icon {
  width: 48px;
  height: 48px;
  color: $color-green-500;
}

.success__description {
  font-size: $font-size-lg;
}
</style>
