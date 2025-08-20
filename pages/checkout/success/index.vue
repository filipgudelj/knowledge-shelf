<script setup lang="ts">
// PAGE META
definePageMeta({ ssr: false })

// STATE
const route = useRoute()
const router = useRouter()
const sessionId = route.query.session_id as string | undefined
const status = ref<'saving' | 'ok' | 'error'>('saving')
const orderId = ref<number | null>(null)
const cartStore = useCartStore()
const { locale, t } = useI18n()
const localePath = useLocalePath()

// LCH
onMounted(async () => {
  if (!sessionId) {
    await router.push(localePath(`/`))
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
    await router.push(localePath(`/`))
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
  <div v-if="status === 'saving'"><Loader /></div>
  <div v-else-if="status === 'ok'" class="success">
    <div class="success__header">
      <div class="success__icon">
        <Icon name="mdi:success-circle-outline" size="48px" />
      </div>
      <h1>{{ t('checkout.success.title') }}</h1>
    </div>
    <p class="success__description">{{ t('checkout.success.description') }}</p>
  </div>
</template>

<style lang="scss" scoped>
.success {
  @include flex(column, flex-start, flex-start);
  width: 100%;
  gap: $spacing-5;
}

.success__header {
  @include flex(row, flex-start, center);
  width: 100%;
  gap: $spacing-4;
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
