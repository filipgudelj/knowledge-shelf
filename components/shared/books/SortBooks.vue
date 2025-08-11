<script lang="ts" setup>
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
  ([newSortBy, newOrder]) => {
    selected.value = `${newSortBy}-${newOrder}`
  },
)

watch(selected, (newSelectedValue) => {
  const [sortBy, order] = newSelectedValue.split('-')
  emits('update:sortBy', sortBy)
  emits('update:order', order)
})
</script>

<template>
  <FormSelect
    id="sort"
    :label="t('sort.label')"
    v-model="selected"
    :options="
      sortList.map((item) => ({
        value: `${item.sortBy}-${item.order}`,
        label: t(`sort.sortBy.${item.label}`),
      }))
    "
    class="sort__select"
  />
</template>

<style lang="scss" scoped>
.sort__select {
  max-width: 230px;
}
</style>
