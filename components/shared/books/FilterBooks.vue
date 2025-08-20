<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import type { BookFilters } from '@/types'

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
const { width } = useWindowSize()

// COMPUTEDS
const buttonsSize = computed(() => {
  if (width.value < 610) return 'sm'
  return 'md'
})

const actionsWidth = computed(() => {
  if (width.value < 430) return '100%'
  else if (width.value < 610) return '240px'
  return '350px'
})

// WATCHERS
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.language = newFilters.language
    localFilters.binding = newFilters.binding
    localFilters.inStockOnly = newFilters.inStockOnly
    localFilters.onSaleOnly = newFilters.onSaleOnly
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
  localFilters.onSaleOnly = false

  const current = JSON.stringify(localFilters)
  const original = JSON.stringify(props.filters)

  if (current !== original) {
    emits('update:filters', { ...localFilters })
  }
}
</script>

<template>
  <div class="filters">
    <div class="filters__select">
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
    </div>

    <div class="filters__bottom">
      <div class="filters__checkboxes">
        <FormCheckbox
          id="in-stock-checkbox"
          :label="t('filter.inStockOnly')"
          v-model="localFilters.inStockOnly"
        />

        <FormCheckbox
          id="on-sale-checkbox"
          :label="t('filter.onSaleOnly')"
          v-model="localFilters.onSaleOnly"
        />
      </div>

      <ClientOnly>
        <div class="filters__actions" :style="{ width: `${actionsWidth}` }">
          <FormButton
            type="reset"
            variant="secondary"
            :size="buttonsSize"
            @click="resetFilters"
          >
            {{ t('filter.reset') }}
          </FormButton>

          <FormButton
            type="submit"
            variant="primary"
            :size="buttonsSize"
            @click="applyFilters"
          >
            {{ t('filter.apply') }}
          </FormButton>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  @include flex(column, flex-start, stretch);
  width: 100%;
  padding: $spacing-4 $spacing-6;
  border: 1px solid $color-gray-300;
  border-radius: $radius-4;
  background-color: $color-gray-100;

  html.dark & {
    border: 1px solid $color-gray-700;
    background-color: $color-gray-900;
  }
}

.filters__select {
  @include flex(column, flex-start, stretch);
  font-size: $font-size-sm !important;

  @media (min-width: $screen-sm) {
    font-size: $font-size-md !important;
  }

  @media (min-width: $screen-lg) {
    @include flex(row, flex-start, stretch);
    gap: $spacing-4;
  }
}

.filters__bottom {
  @include flex(column, space-between, flex-start);
  gap: $spacing-4;

  @media (min-width: $screen-lg) {
    @include flex(row, space-between, flex-start);
  }
}

.filters__checkboxes {
  @include flex(column, flex-start, flex-start);
  gap: $spacing-3;
  margin-bottom: $spacing-3;

  @media (min-width: $screen-sm) {
    @include flex(row, flex-start, flex-start);
  }
}

.filters__actions {
  @include flex(column, center, center);
  gap: $spacing-3;
  margin-left: auto;
  white-space: nowrap;

  @media (min-width: 430px) {
    @include flex(row, flex-end, flex-start);
  }
}
</style>
