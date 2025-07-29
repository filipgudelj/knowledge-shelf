<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

// PROPS
const props = defineProps<{
  id: string
  label: string
  placeholder: string
  modelValue: string | undefined
  options: { value: string; label: string }[]
}>()

// EMITS
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// STATE
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)

// COMPUTEDS
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

// HANDLERS
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

onClickOutside(triggerRef, () => {
  isOpen.value = false
})

const onSelect = (value: string) => {
  emits('update:modelValue', value)
  isOpen.value = false
}
</script>

<template>
  <div class="select">
    <label :for="props.id" class="select__label">{{ props.label }}</label>

    <button
      :id="props.id"
      class="select__trigger"
      ref="triggerRef"
      @click="toggleDropdown"
      type="button"
    >
      <span>{{ selectedLabel }}</span>
      <icon
        name="mdi:chevron-left"
        class="select__icon"
        :class="{ 'select__icon--rotated': isOpen }"
      />
    </button>

    <div v-if="isOpen" class="select__options">
      <div
        v-for="option in props.options"
        :key="option.value"
        @click="onSelect(option.value)"
        class="select__option"
        :class="{ selected: modelValue === option.value }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  width: 100%;
}

.select__label {
  display: inline-block;

  &:hover {
    cursor: pointer;
  }
}

.select__trigger {
  @include flex(row, space-between, center);
  width: 100%;
  padding: $spacing-3 $spacing-6 $spacing-3 $spacing-4;
  border: 1px solid $color-gray-300;
  border-radius: $radius-3;
  cursor: pointer;
  background-color: $color-gray-100;
  transition: border-color 0.2s ease;

  html.dark & {
    border: 1px solid $color-gray-700;
    background-color: $color-gray-900;

    &:hover {
      border-color: $color-gray-500;
    }

    &:focus {
      outline: none;
      border-color: $color-blue-500;
    }
  }

  &:hover {
    border-color: $color-gray-500;
  }

  &:focus {
    outline: none;
    border-color: $color-blue-500;
  }
}

.select__icon {
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  transition: transform 0.2s ease;

  &--rotated {
    transform: rotate(-90deg);
  }
}

.select__options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  width: 100%;
  border: 1px solid $color-gray-300;
  border-radius: $radius-3;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.2);
  background-color: $color-gray-100;
  overflow-y: auto;

  html.dark & {
    border: 1px solid $color-gray-700;
    background-color: $color-gray-900;
  }
}

.select__option {
  padding: $spacing-3 $spacing-4;
  cursor: pointer;
  transition: all 0.2s ease;

  &:not(.selected):hover {
    background-color: $color-gray-200;
  }

  html.dark &:not(.selected):hover {
    background-color: $color-gray-800;
  }

  &.selected {
    background-color: $color-blue-500;
    color: $color-gray-100;
  }
}
</style>
