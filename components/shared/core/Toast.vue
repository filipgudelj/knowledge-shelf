<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// STATE
const { toasts, closeToast } = useToast()
const { t } = useI18n()
const getTypeLabel = (type: string) => t(`toast.${type}`)
const getIconName = (type: string) => {
  switch (type) {
    case 'success':
      return 'mdi:success-circle-outline'
    case 'error':
      return 'mdi:error-outline'
    case 'info':
    default:
      return 'mdi:information-outline'
  }
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`]"
      >
        <div class="toast__icon">
          <Icon :name="getIconName(toast.type)" size="24px" />
        </div>

        <div class="toast__content">
          <p class="toast__type">{{ getTypeLabel(toast.type) }}</p>
          <p class="toast__message">{{ toast.message }}</p>
        </div>

        <button @click="closeToast(toast.id)" class="toast__close">
          <Icon name="mdi:remove" size="24px" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 96px;
  right: 16px;
  z-index: 1000;
}

.toast {
  @include flex(row, flex-start, center);
  gap: $spacing-5;
  margin-bottom: $spacing-3;
  padding: $spacing-4;
  border-radius: $radius-5;
  background-color: $color-blue-200;
  color: $color-gray-900;

  &--success {
    background-color: $color-green-300;
  }

  &--error {
    background-color: $color-red-300;
  }

  &--info {
    background-color: $color-blue-200;
  }
}

.toast__icon {
  width: 24px;
  height: 24px;
}

.toast__content {
  @include flex(column, flex-start, flex-start);
  gap: $spacing-2;
  width: 100%;
  min-width: 200px;

  @media (min-width: $screen-md) {
    min-width: 225px;
  }
}

.toast__type {
  font-size: $font-size-md;
  font-weight: 700;

  @media (min-width: $screen-md) {
    font-size: $font-size-lg;
  }
}

.toast__message {
  font-size: $font-size-xs;

  @media (min-width: $screen-md) {
    font-size: $font-size-sm;
  }
}

.toast__close {
  width: 24px;
  height: 24px;
}

.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-active {
  position: absolute;
  right: 0;
}
</style>
