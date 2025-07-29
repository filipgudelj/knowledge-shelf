<script lang="ts" setup>
import type { BookFilters } from '~/types'

// PROPS
const props = defineProps<{
  filters: BookFilters
}>()

// EMITS
const emits = defineEmits<{
  (e: 'update:filters', value: BookFilters): void
}>()

// STATE
const localFilters = reactive<BookFilters>({ ...props.filters })
const { t } = useI18n()

// WATCHERS
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.language = newFilters.language
    localFilters.binding = newFilters.binding
    localFilters.inStockOnly = newFilters.inStockOnly
  },
)

// HANDLERS
const applyFilters = () => {
  const current = JSON.stringify(localFilters)
  const original = JSON.stringify(props.filters)

  if (current !== original) {
    emits('update:filters', { ...localFilters })
  }
}

const resetFilters = () => {
  localFilters.language = ''
  localFilters.binding = ''
  localFilters.inStockOnly = false

  const current = JSON.stringify(localFilters)
  const original = JSON.stringify(props.filters)

  if (current !== original) {
    emits('update:filters', { ...localFilters })
  }
}
</script>

<template>
  <div class="filters">
    <div class="filter-group">
      <label for="language-select">{{ t('filter.language') }}</label>
      <select id="language-select" v-model="localFilters.language">
        <option disabled value="">{{ t('filter.chooseOption') }}</option>
        <option value="en">{{ t('filter.english') }}</option>
        <option value="hr">{{ t('filter.croatian') }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="binding-select">{{ t('filter.binding') }}</label>
      <select id="binding-select" v-model="localFilters.binding">
        <option disabled value="">{{ t('filter.chooseOption') }}</option>
        <option value="softcover">{{ t('filter.softcover') }}</option>
        <option value="hardcover">{{ t('filter.hardcover') }}</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="in-stock-checkbox">
        <input
          id="in-stock-checkbox"
          type="checkbox"
          v-model="localFilters.inStockOnly"
        />
        {{ t('filter.inStockOnly') }}
      </label>
    </div>

    <div class="filter-actions">
      <button @click="applyFilters">{{ t('filter.apply') }}</button>
      <button @click="resetFilters" type="button">
        {{ t('filter.reset') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
