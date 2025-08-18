<script setup lang="ts">
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// TYPES
type Row = {
  book_count: number
  category_label: string
  category_slug: string
}

// STATE
const supabase = useSupabaseClient()
const rows = ref<Row[]>([])
const loading = ref(true)
const showSkeleton = ref(true)
const { locale, t } = useI18n()

const palette = [
  '#1aa3ff',
  '#4bc0c0',
  '#36a2eb',
  '#9966ff',
  '#ff9f40',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#06b6d4',
  '#a855f7',
  '#ec4899',
  '#94a3b8',
]

// API
const fetchCategories = async () => {
  const { data } = await supabase.rpc('books_by_category', {
    locale: locale.value,
  } as any)

  if (data) {
    rows.value = data
  }
  loading.value = false
}

// COMPUTEDS
const donutData = computed<number[]>(() =>
  rows.value.map((row) => Number(row.book_count ?? 0)),
)

const labels = computed(() =>
  rows.value.map((row, index) => ({
    name: row.category_label,
    color: palette[index % palette.length],
    slug: row.category_slug,
  })),
)

// LCH
onMounted(async () => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
  await fetchCategories()
})
</script>

<template>
  <div v-if="loading || showSkeleton" class="skeleton">
    <VueSkeletonLoader
      v-for="n in 1"
      :key="'skeleton-' + n"
      type="image@1"
      width="'100%'"
      :height="'425px'"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
    />
  </div>

  <div v-else class="chart">
    <div class="chart__title">
      {{ t('admin.booksByCategory') }}
    </div>

    <div class="chart__body">
      <DonutChart
        :data="donutData"
        :arc-width="45"
        :labels="labels"
        :height="305"
        :radius="0"
        :type="'full'"
        :crosshair="false"
      >
        <template #tooltip="{ values }">
          <div class="chart__tooltip">
            {{ values?.value }}
          </div>
        </template>
      </DonutChart>
    </div>
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
  margin-bottom: $spacing-6;
  font-size: $font-size-xl;
  font-weight: 700;
}

.chart__body {
  justify-self: center;
  width: 240px;
}
</style>
