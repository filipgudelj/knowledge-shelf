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
    <FormSelect
      id="language-select"
      :label="t('filter.language')"
      :placeholder="t('filter.chooseOption')"
      v-model="localFilters.language"
      :options="[
        { value: 'en', label: t('filter.english') },
        { value: 'hr', label: t('filter.croatian') },
      ]"
    />

    <FormSelect
      id="binding-select"
      :label="t('filter.binding')"
      :placeholder="t('filter.chooseOption')"
      v-model="localFilters.binding"
      :options="[
        { value: 'softcover', label: t('filter.softcover') },
        { value: 'hardcover', label: t('filter.hardcover') },
      ]"
    />

    <FormCheckbox
      id="in-stock-checkbox"
      :label="t('filter.inStockOnly')"
      v-model="localFilters.inStockOnly"
    />

    <div class="filters__actions">
      <SubmitButton type="primary" size="md" @click="applyFilters">
        {{ t('filter.apply') }}
      </SubmitButton>
      <SubmitButton type="secondary" size="md" @click="resetFilters">
        {{ t('filter.reset') }}
      </SubmitButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  @include flex(column, flex-start, stretch);
  gap: $spacing-5;
  width: 100%;
  margin-top: $spacing-6;
  padding: $spacing-4 $spacing-6;
  border: 1px solid $color-gray-200;

  html.dark & {
    border: 1px solid $color-gray-700;
  }
}

.filters__actions {
  @include flex(row, flex-end, flex-start);
  gap: $spacing-4;
  width: 300px;
  margin-left: auto;
}
</style>
