<script lang="ts" setup>
// STATE
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

// HANDLERS
const handleRegister = () => {
  authStore.register(email.value, password.value)
}
</script>

<template>
  <form @submit.prevent="handleRegister()" class="register">
    <div class="register__head">
      <h1>{{ $t('register.title') }}</h1>
      <p>{{ $t('register.subtitle') }}</p>
    </div>

    <FormInput
      :label="$t('register.emailLabel')"
      v-model="email"
      id="email"
      type="text"
      :placeholder="$t('register.emailPlaceholder')"
    >
      <template #icon>
        <Icon name="mdi:email-outline" />
      </template>
    </FormInput>
    <FormInput
      :label="$t('register.passwordLabel')"
      v-model="password"
      id="password"
      type="password"
      :placeholder="$t('register.passwordPlaceholder')"
    >
      <template #icon>
        <Icon name="mdi:password-outline" />
      </template>
    </FormInput>
    <SubmitButton>{{ $t('register.submit') }}</SubmitButton>
  </form>
</template>

<style lang="scss" scoped>
.register {
  @include flex(column, center, flex-start);
  gap: $spacing-5;
  margin-top: $spacing-10;
  width: 250px;

  @media (min-width: $screen-sm) {
    width: 325px;
  }

  @media (min-width: $screen-md) {
    width: 400px;
  }

  @media (min-width: $screen-lg) {
    width: 550px;
  }

  @media (min-width: $screen-xl) {
    width: 650px;
  }
}

.register__head {
  @include flex(column, center, flex-start);
  gap: $spacing-3;
}
</style>
