<script lang="ts" setup>
// PROPS
const props = defineProps<{
  id: string
  modelValue: number
  label?: string
  min?: number
  max?: number
  step?: number
}>()

// STATE
const inputRef = ref<HTMLInputElement | null>(null)
const localValue = ref<number>(props.modelValue ?? props.min ?? 1)

// WATCH
watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val ?? props.min ?? 1
  },
)

// EXPOSE
defineExpose({
  focus: () => inputRef.value?.focus(),
})

// EMITS
const emits = defineEmits(['update:modelValue'])

// HANDLERS
function updateValue(newValue: number) {
  const min = props.min ?? 1
  const max = props.max

  if (newValue < min) newValue = min
  if (max !== undefined && newValue > max) newValue = max

  emits('update:modelValue', newValue)
  localValue.value = newValue
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()

  if (!/^\d*$/.test(raw)) {
    target.value = String(localValue.value)
    return
  }

  const parsed = parseInt(raw)
  if (!isNaN(parsed)) {
    const min = props.min ?? 1
    const max = props.max

    let newValue = parsed
    if (newValue < min) newValue = min
    if (max !== undefined && newValue > max) newValue = max

    target.value = String(newValue)
    updateValue(newValue)
  }
}

function onBlur() {
  const val = localValue.value
  const min = props.min ?? 1
  const max = props.max

  if (!val || isNaN(val)) {
    updateValue(min)
    return
  }

  if (val < min) updateValue(min)
  else if (max !== undefined && val > max) updateValue(max)
}

function increment(event: MouseEvent) {
  event.preventDefault()
  updateValue((localValue.value ?? 0) + (props.step ?? 1))
  inputRef.value?.focus()
}

function decrement(event: MouseEvent) {
  event.preventDefault()
  updateValue((localValue.value ?? 0) - (props.step ?? 1))
  inputRef.value?.focus()
}
</script>

<template>
  <div class="input-number">
    <label v-if="label" :for="id" class="input-number__label">{{
      label
    }}</label>

    <div class="input-number__wrapper">
      <input
        ref="inputRef"
        :id="id"
        type="text"
        :value="localValue"
        @input="onInput"
        @blur="onBlur"
        autocomplete="off"
        class="input-number__input"
      />

      <div class="input-number__controls">
        <button
          type="button"
          class="input-number__button"
          @mousedown.prevent
          @click="decrement"
        >
          &minus;
        </button>
        <div class="input-number__divider" />
        <button
          type="button"
          class="input-number__button"
          @mousedown.prevent
          @click="increment"
        >
          &plus;
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-number {
  @include flex(column, flex-start, flex-start);
  width: 100%;
}

.input-number__label {
  margin-bottom: $spacing-1;

  &:hover {
    cursor: pointer;
  }
}

.input-number__wrapper {
  position: relative;
  @include flex(row, center, center);
  width: 100%;
}

.input-number__input {
  width: 100%;
  padding: $spacing-3 $spacing-5;
  border: 1px solid $color-gray-300;
  border-radius: $spacing-2;
  background-color: $color-gray-100;
  color: $color-gray-900;
  font-size: $font-size-lg;
  text-align: start;
  transition: border 0.3s ease;

  html.dark & {
    border-color: $color-gray-700;
    background-color: $color-gray-900;
    color: $color-gray-100;

    &:hover {
      border: 1px solid $color-gray-500;
    }

    &:focus {
      border-color: $color-blue-500;
    }
  }

  &:hover {
    border: 1px solid $color-gray-500;
  }

  &:focus {
    outline: none;
    border: 1px solid $color-blue-500;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  // &[type='number'] {
  //   -moz-appearance: textfield;
  // }
}

.input-number__controls {
  position: absolute;
  right: 0;
  z-index: 10;
  @include flex(row);
  height: 100%;
}

.input-number__button {
  margin: 0 $spacing-2;
  padding: 0 $spacing-4;
  border-radius: $radius-3;
  background-color: transparent;
  font-size: $font-size-lg;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: $color-gray-200;
  }

  html.dark & {
    background-color: $color-gray-900;
    color: $color-gray-100;

    &:hover {
      background-color: $color-gray-800;
    }
  }
}

.input-number__divider {
  height: 50%;
  width: 1px;
  background-color: $color-gray-200;

  html.dark & {
    background-color: $color-gray-800;
  }
}
</style>
