<script setup lang="ts">
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// TYPES
type Row = { day: string; revenue: number }

// STATE
const supabase = useSupabaseClient()
const rows = ref<Row[]>([])
const loading = ref(true)
const { locale } = useI18n()
const showSkeleton = ref(true)

// API
const fetchRevenue = async () => {
  const { data, error } = await supabase.rpc('revenue_last_30d')
  if (data) {
    rows.value = data
  }
  loading.value = false
}

// COMPUTEDS
const revenueData = computed<Row[]>(() =>
  rows.value.map((row) => ({ day: row.day, revenue: Number(row.revenue) })),
)

const revenueCategories = computed(() => ({
  revenue: { name: 'Revenue', color: '#1aa3ff' },
}))

// CHART OPTIONS
const xFormatter = (index: number) =>
  new Date(revenueData.value[index].day).toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
  })

const yFormatter = (value: number) => `${value} €`

// LCH
onMounted(async () => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
  await fetchRevenue()
})
</script>

<template>
  <div v-if="loading || showSkeleton" class="skeleton">
    <VueSkeletonLoader
      v-for="n in 1"
      :key="'skeleton-' + n"
      type="image@1"
      width="'100%'"
      :height="'390px'"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
    >
    </VueSkeletonLoader>
  </div>

  <div v-else class="chart">
    <div class="chart__title">Revenue (last 30 days)</div>

    <LineChart
      :data="revenueData"
      :categories="revenueCategories"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :y-grid-line="true"
      :height="320"
      :hide-legend="true"
      class="chart__body"
    >
      <template #tooltip="{ values }">
        <div class="chart__tooltip">
          <div class="chart__tooltip-date">
            {{
              new Date(values?.day as string).toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            }}
          </div>
          <div>
            <div class="chart__tooltip-divider" />
          </div>
          <div class="chart__tooltip-value">
            <span class="chart__tooltip-label">Revenue:</span>
            <span class="chart__tooltip-amount">{{ values?.revenue }} €</span>
          </div>
        </div>
      </template>
    </LineChart>
  </div>
</template>

<style lang="scss" scoped>
.skeleton {
  width: 100%;
}

.chart {
  width: 100%;
  padding: $spacing-5;
  border: 1px solid $color-gray-300;
  border-radius: $radius-4;

  html.dark & {
    border: 1px solid $color-gray-700;
  }
}

.chart__title {
  margin-bottom: $spacing-3;
  font-size: $font-size-xl;
  font-weight: 700;
}

.chart__tooltip {
  min-width: 130px;

  .chart__tooltip-divider {
    height: 1px;
    margin-block: $spacing-2;
    background-color: $color-gray-300;

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  .chart__tooltip-label {
    margin-right: $spacing-2;
  }

  .chart__tooltip-amount {
    font-weight: 700;
  }
}
</style>
