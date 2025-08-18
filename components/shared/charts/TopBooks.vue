<script setup lang="ts">
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// TYPES
type Row = {
  id: number
  title: string
  sales_count: number
  cover_url: string
  price: number
}

// STATE
const supabase = useSupabaseClient()
const rows = ref<Row[]>([])
const loading = ref(true)
const showSkeleton = ref(true)

// API
const fetchTopBooks = async () => {
  const { data } = await supabase.rpc('top_books', {
    limit_count: 10,
  } as any)

  if (data) rows.value = data
  loading.value = false
}

// LCH
onMounted(async () => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
  await fetchTopBooks()
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

  <div v-else class="top-books">
    <h2 class="top-books__title">
      <Icon name="mdi:trophy-outline" class="top-books__icon" />
      {{ 'Top Selling Books' }}
    </h2>
    <div class="top-books__list">
      <div
        v-for="(book, i) in rows"
        :key="book.id"
        class="top-books__item"
        :class="{ 'top-books__item--first': i === 0 }"
      >
        <span class="top-books__rank">{{ i + 1 }}.</span>
        <span class="top-books__name">{{ book.title }}</span>
        <span class="top-books__count">{{ book.sales_count }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton {
  width: 100%;
}

.top-books {
  width: 100%;
  height: 100%;
  padding: $spacing-5;
  border: 1px solid $color-gray-300;
  border-radius: $radius-4;

  html.dark & {
    border-color: $color-gray-700;
  }
}

.top-books__title {
  @include flex(row, flex-start, center);
  gap: $spacing-2;
  margin-bottom: $spacing-6;
  font-size: $font-size-xl;
  font-weight: 700;
}

.top-books__icon {
  color: $color-gold-500;
  font-size: $font-size-2xl;
}

.top-books__list {
  @include flex(column, flex-start, space-between);
  gap: $spacing-2;
}

.top-books__item {
  display: grid;
  grid-template-columns: 25px 1fr auto;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-2 $spacing-3;
  border-radius: $radius-2;

  &--first {
    background-color: $color-gray-200;
    font-weight: 700;

    html.dark & {
      background-color: $color-gray-800;
    }
  }
}

.top-books__rank {
  margin-right: $spacing-3;
  font-weight: 700;
}

.top-books__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-books__count {
  color: $color-gray-600;
  font-weight: 600;

  html.dark & {
    color: $color-gray-400;
  }
}

.top-books__loading {
  color: $color-gray-500;
  font-style: italic;
}
</style>
