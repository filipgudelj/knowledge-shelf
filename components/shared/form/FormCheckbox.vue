<script lang="ts" setup>
// PROPS
const props = defineProps<{
  id: string
  label: string
  modelValue: boolean | undefined
}>()

// EMITS
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// HANDLERS
const onCheck = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div class="checkbox">
    <input
      type="checkbox"
      class="checkbox__input"
      :id="props.id"
      :checked="props.modelValue"
      @change="onCheck"
    />
    <label class="checkbox__box" :for="props.id"></label>
    <label class="checkbox__label" :for="props.id">{{ props.label }}</label>
  </div>
</template>

<style lang="scss" scoped>
.checkbox {
  @include flex(row, flex-start, center);
  width: fit-content;
}

.checkbox__input {
  display: none;
}

.checkbox__box {
  position: relative;
  width: 17px;
  height: 17px;
  border: 1px solid $color-gray-300;
  border-radius: $radius-2;
  cursor: pointer;
  transition: all 0.1s ease;

  html.dark & {
    border: 1px solid $color-gray-700;

    &:hover {
      border: 1px solid $color-gray-500;
    }
  }

  .checkbox:hover & {
    border: 1px solid $color-gray-500;
  }

  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 5px;
    width: 5px;
    height: 11px;
    border-right: 2px solid $color-gray-100;
    border-bottom: 2px solid $color-gray-100;
    opacity: 0;
    transition: all 0.3s ease;
    transition-delay: 0.15s;
    transform: rotate(45deg) scale(0);
  }
}

.checkbox__label {
  @include flex(row, center, center);
  height: 17px;
  padding-inline: $spacing-3;
  user-select: none;
  cursor: pointer;
  font-size: $font-size-sm;
}

.checkbox__input:checked ~ .checkbox__box {
  border-color: transparent;
  background-color: $color-blue-500;
  animation: jelly 0.6s ease;

  &::after {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
}

@keyframes jelly {
  0% {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
