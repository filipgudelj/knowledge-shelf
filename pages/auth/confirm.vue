<script setup lang="ts">
const user = useSupabaseUser()
const { showToast } = useToast()
const { t } = useI18n()

// WATCHERS
watch(
  user,
  () => {
    if (user.value) {
      showToast('success', t('toast.emailConfirmed'))
      return navigateTo('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="confirm">
    <p class="confirm__text">
      {{ $t('confirm.waitingForLogin') }}<span class="confirm__dots--animate" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  margin-top: $spacing-10;
}

.confirm__text {
  font-size: $font-size-xl;
}

.confirm__dots--animate {
  display: inline-block;
  width: 1.5rem;

  &::before {
    content: '';
    animation: dots 1s steps(3, end) infinite;
  }
}

@keyframes dots {
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }

  100% {
    content: '...';
  }
}
</style>
