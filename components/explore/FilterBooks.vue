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
      <label>Language</label>
      <select v-model="localFilters.language" placeholder="choose">
        <option disabled value="">-- Choose an option --</option>
        <option value="english">English</option>
        <option value="croatian">Croatian</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Binding</label>
      <select v-model="localFilters.binding">
        <option disabled value="">-- Choose an option --</option>
        <option value="softcover">Softcover</option>
        <option value="hardcover">Hardcover</option>
      </select>
    </div>

    <div class="filter-group">
      <label>
        <input type="checkbox" v-model="localFilters.inStockOnly" />
        In Stock Only
      </label>
    </div>

    <div class="filter-actions">
      <button @click="applyFilters">Apply Filters</button>
      <button @click="resetFilters" type="button">Reset Filters</button>
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
