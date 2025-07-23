<script lang="ts" setup>
// PROPS
const props = defineProps<{
  id?: string
  type?: string
  placeholder?: string
  modelValue?: string
  label?: string
}>()

// STATE
const inputRef = ref<HTMLInputElement | null>(null)
const slots = useSlots()

// EXPOSE
defineExpose({
  focus: () => inputRef.value?.focus(),
})

// EMITS
const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input__wrapper">
    <label v-if="props.label" :for="props.id" class="input__label">
      {{ props.label }}</label
    >
    <input
      ref="inputRef"
      :id="props.id"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="onInput"
      autocomplete="off"
      class="input"
    />
    <div v-if="slots.icon" class="input__icon">
      <slot name="icon" />
    </div>
    <div class="input__error"><slot name="error" /></div>
  </div>
</template>

<style lang="scss" scoped>
.input__wrapper {
  position: relative;
  @include flex(column, flex-start, flex-start);
  gap: $spacing-1;
  width: 100%;
}

.input__label {
  font-size: $font-size-sm;
}

.input {
  width: 100%;
  border: 1px solid $color-gray-300;
  border-radius: $spacing-2;
  padding-inline: $spacing-4;
  padding-block: $spacing-4;
  background-color: $color-gray-100;
  color: $color-gray-900;
  font-size: $font-size-md;
  transition: all 0.3s ease;

  html.dark & {
    border: 1px solid $color-gray-700;
    background-color: $color-gray-900;
    color: $color-gray-200;

    &:hover {
      border: 1px solid $color-gray-500;
    }
  }

  &:hover {
    border: 1px solid $color-gray-500;
  }

  &:focus {
    outline: none;
    border: 1px solid $color-blue-500;
  }

  &::placeholder {
    color: $color-gray-600;
  }
}

.input__icon {
  position: absolute;
  top: 35%;
  @include flex();
  width: 32px;
  height: 24px;
  color: $color-gray-600;
}

.input__wrapper:has(.input__icon) .input {
  padding-left: $spacing-9;
}

.input__error {
  height: 20px;
  margin-top: $spacing-1;
  color: $color-red-500;
  font-size: $font-size-sm;
}
</style>
