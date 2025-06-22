<script lang="ts" setup>
// STATE
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

// HANDLERS
const handleLogin = () => {
  authStore.login(email.value, password.value)
  navigateTo('/')
}
</script>

<template>
  <form @submit.prevent="handleLogin()" class="login">
    <div class="login__head">
      <h1>{{ $t('login.title') }}</h1>
      <p>{{ $t('login.subtitle') }}</p>
    </div>

    <FormInput
      :label="$t('login.emailLabel')"
      v-model="email"
      id="email"
      type="text"
      :placeholder="$t('login.emailPlaceholder')"
    >
      <template #icon>
        <Icon name="mdi:email-outline" />
      </template>
    </FormInput>
    <FormInput
      :label="$t('login.passwordLabel')"
      v-model="password"
      id="password"
      type="password"
      :placeholder="$t('login.passwordPlaceholder')"
    >
      <template #icon>
        <Icon name="mdi:password-outline" />
      </template>
    </FormInput>
    <SubmitButton>{{ $t('login.submit') }}</SubmitButton>
  </form>
</template>

<style lang="scss" scoped>
.login {
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

.login__head {
  @include flex(column, center, flex-start);
  gap: $spacing-3;
}
</style>
