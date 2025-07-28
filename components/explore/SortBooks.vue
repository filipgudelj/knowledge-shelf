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
  { label: 'Date (new → old)', sortBy: 'created_at', order: 'desc' },
  { label: 'Date (old → new)', sortBy: 'created_at', order: 'asc' },
  { label: 'Price (low → high)', sortBy: 'price', order: 'asc' },
  { label: 'Price (high → low)', sortBy: 'price', order: 'desc' },
  { label: 'Title (A → Z)', sortBy: 'title', order: 'asc' },
  { label: 'Title (Z → A)', sortBy: 'title', order: 'desc' },
]
const selected = ref(`${props.sortBy}-${props.order}`)

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
  <label for="sort">Sort by:</label>
  <select id="sort" v-model="selected">
    <option
      v-for="item in sortList"
      :key="`${item.sortBy}-${item.order}`"
      :value="`${item.sortBy}-${item.order}`"
    >
      {{ item.label }}
    </option>
  </select>
</template>
