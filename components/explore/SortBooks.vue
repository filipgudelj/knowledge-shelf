<script lang="ts" setup>
import { ref, watch } from 'vue'

// PROPS
const props = defineProps<{
  sortBy: string
  order: string
}>()

// EMITS
const emits = defineEmits<{
  (e: 'update:sortBy', value: string): void
  (e: 'update:order', value: string): void
}>()

// STATE
const sortList = [
  { label: 'dateDesc', sortBy: 'created_at', order: 'desc' },
  { label: 'dateAsc', sortBy: 'created_at', order: 'asc' },
  { label: 'priceAsc', sortBy: 'price', order: 'asc' },
  { label: 'priceDesc', sortBy: 'price', order: 'desc' },
  { label: 'titleAsc', sortBy: 'title', order: 'asc' },
  { label: 'titleDesc', sortBy: 'title', order: 'desc' },
]
const selected = ref(`${props.sortBy}-${props.order}`)
const { t } = useI18n()

// WATCHERS
watch(
  () => [props.sortBy, props.order],
  ([sortBy, order]) => {
    selected.value = `${sortBy}-${order}`
  },
)

watch(selected, (newSelectedValue) => {
  const [sortBy, order] = newSelectedValue.split('-')
  emits('update:sortBy', sortBy)
  emits('update:order', order)
})
</script>

<template>
  <label for="sort">{{ $t('sort.label') }}</label>
  <select id="sort" v-model="selected">
    <option
      v-for="item in sortList"
      :key="`${item.sortBy}-${item.order}`"
      :value="`${item.sortBy}-${item.order}`"
    >
      {{ t(`sort.sortBy.${item.label}`) }}
    </option>
  </select>
</template>
