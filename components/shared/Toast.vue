<script setup lang="ts">
// STATE
const { toastType, toastMessage, isToastClosing, closeToast } = useToast()
const { t } = useI18n()

// COMPUTEDS
const typeLabel = computed(() => {
  return t(`toast.${toastType.value}`)
})

const iconName = computed(() => {
  switch (toastType.value) {
    case 'success':
      return 'mdi:success-circle-outline'
    case 'error':
      return 'mdi:error-outline'
    case 'info':
    default:
      return 'mdi:information-outline'
  }
})
</script>

<template>
  <div
    v-if="toastMessage"
    :class="[
      'toast',
      `toast--${toastType}`,
      { 'toast--closing': isToastClosing },
    ]"
  >
    <div class="toast__icon">
      <Icon :name="iconName" size="24px" />
    </div>
    <div class="toast__content">
      <p class="toast__type">{{ typeLabel }}</p>
      <p class="toast__message">{{ toastMessage }}</p>
    </div>
    <button @click="closeToast" class="toast__close">
      <Icon name="mdi:remove" size="24px" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  top: 96px;
  right: 16px;
  z-index: 1000;
  @include flex(row, space-between, center);
  gap: $spacing-5;
  min-width: 250px;
  padding: $spacing-4;
  border-radius: $radius-5;
  color: $color-gray-900;
  animation: slide-in 0.3s ease forwards;
}

.toast--success {
  background-color: $color-green-300;
}

.toast--error {
  background-color: $color-red-300;
}

.toast--info {
  background-color: $color-blue-200;
}

.toast--closing {
  animation: slide-out 0.3s ease forwards;
}

.toast__icon {
  width: 24px;
  height: 24px;
}

.toast__content {
  @include flex(column, flex-start, flex-start);
  gap: $spacing-2;
  width: 100%;
}

.toast__type {
  font-size: $font-size-lg;
}

.toast__message {
  font-size: $font-size-sm;
}

.toast__close {
  width: 24px;
  height: 24px;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
