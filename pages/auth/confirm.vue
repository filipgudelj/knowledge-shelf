<script setup lang="ts">
// META
definePageMeta({
  layout: false,
})

// STATE
const user = useSupabaseUser()

// WATCHERS
watch(
  user,
  async () => {
    if (user.value) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return navigateTo('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="confirm">
    <Icon name="mdi:success-circle" size="64px" class="confirm__icon" />
    <p>Your email has been successfully verified!</p>
    <p>
      Hang tight! We're taking you back to the home page<span
        class="confirm__dots--animate"
      />
    </p>
  </div>
</template>

<style lang="scss" scoped>
.confirm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @include flex(column, center, center);
  gap: $spacing-5;
}

.confirm__icon {
  color: $color-green;
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
