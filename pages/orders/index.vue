<script setup lang="ts">
import { formatNumberToEuro } from '~/helpers/formatters'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'
import { useWindowSize } from '@vueuse/core'

// STATE
const { t, locale } = useI18n()
const ordersStore = useOrdersStore()
const showSkeleton = ref(true)
const { width } = useWindowSize()

// COMPUTEDS
const skeletonRowHeight = computed(() => (width.value < 768 ? '140px' : '40px'))
const rows = computed(() =>
  ordersStore.orders.map((order, index) => ({
    number: index + 1,
    titles: (order.items ?? []).map((i) => i.title_snapshot).join(', '),
    shipping_method: order.shipping_method,
    total: (order as any).total,
    createdAt: order.created_at,
  })),
)

const isInitialLoading = computed(
  () =>
    (ordersStore.isLoading && ordersStore.orders.length === 0) ||
    showSkeleton.value,
)

// API
await ordersStore.loadOrders()

// INFINITE SCROLL
const onScroll = async () => {
  if (!ordersStore.hasMoreOrders || ordersStore.isLoading) return
  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200
  if (scrollPos >= threshold) {
    await ordersStore.loadMoreOrders()
  }
}

// HELPERS
const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s)

// LCH
onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// HEAD
useHead(() => ({
  title: t('seo.orders.title'),
  meta: [{ name: 'description', content: t('seo.orders.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="orders">
    <h1 class="orders__title">{{ t('orders.title') }}</h1>

    <div v-if="isInitialLoading" class="orders__skeleton">
      <ClientOnly>
        <VueSkeletonLoader
          type="text@12"
          :height="skeletonRowHeight"
          base-color="var(--skel-base)"
          highlight-color="var(--skel-highlight)"
          class="orders__skeleton-rows"
        />
      </ClientOnly>
    </div>

    <div v-else-if="!ordersStore.orders.length" class="orders__state">
      {{ t('orders.empty') }}
    </div>

    <div v-else class="orders__table-wrapper">
      <div class="orders__header">
        <div>{{ t('orders.number') }}</div>
        <div class="align-text">{{ t('orders.titles') }}</div>
        <div class="align-text">{{ t('orders.shippingMethod') }}</div>
        <div class="align-text">{{ t('orders.totalPrice') }}</div>
        <div class="align-text">{{ t('orders.createdAt') }}</div>
      </div>

      <div v-for="r in rows" :key="r.number" class="orders__row">
        <div class="orders__cell">{{ t('orders.order') }} {{ r.number }}</div>
        <div class="orders__cell align-text">
          <span>{{ r.titles }}</span>
        </div>
        <div class="orders__cell align-text">
          {{ capitalize(r.shipping_method) }}
          <span class="orders__shipping">{{ t('orders.shipping') }}</span>
        </div>
        <div class="orders__cell orders__total align-text">
          {{ formatNumberToEuro(r.total, locale) }}
        </div>
        <div class="orders__cell align-text">
          {{
            new Date(r.createdAt).toLocaleString(locale, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orders {
  width: 100%;
  margin-top: $spacing-6;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $radius-3;
    background-color: $color-gray-300;

    &:hover {
      cursor: pointer;
      background-color: $color-gray-400;

      html.dark & {
        background-color: $color-gray-600;
      }
    }

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
}

.orders__title {
  margin-bottom: $spacing-4;
}

.orders__table-wrapper {
  min-width: 0;

  @media (min-width: $screen-md) {
    min-width: 950px;
  }
}

.orders__header,
.orders__row {
  display: grid;
  grid-template-columns:
    minmax(120px, 0.5fr)
    minmax(200px, 1fr)
    minmax(160px, 0.6fr)
    minmax(140px, 0.5fr)
    minmax(180px, 0.6fr);
  column-gap: $spacing-4;
  align-items: center;
  padding: $spacing-4;
  border-bottom: 1px solid $color-gray-300;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }
}

.orders__header {
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: 700;

  @media (max-width: $screen-md) {
    display: none;
  }
}

.orders__row {
  @media (max-width: $screen-md) {
    grid-template-columns: 1fr;
    row-gap: $spacing-2;
    margin-bottom: $spacing-3;
    border: 1px solid $color-gray-200;
    border-radius: $radius-4;

    html.dark & {
      border: 1px solid $color-gray-700;
    }
  }
}

.orders__cell {
  &:nth-child(1) {
    font-weight: 700;
  }

  @media (min-width: $screen-md) {
    &:nth-child(1) {
      font-weight: 400;
    }
  }
}

.orders__shipping {
  @media (min-width: $screen-md) {
    display: none;
  }
}

.orders__total {
  font-weight: 700;
}

.orders__skeleton-rows {
  @include flex(column);
  gap: $spacing-3;
}

.align-text {
  text-align: left;

  @media (min-width: $screen-md) {
    text-align: center;
  }
}
</style>
