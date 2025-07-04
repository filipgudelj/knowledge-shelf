<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// STATE
const authStore = useAuthStore()
const { t } = useI18n()

// VALIDATION
const schema = yup.object({
  email: yup.string().required(t('validation.email.required')),
  password: yup.string().required(t('validation.password.required')),
})

const submitted = ref(false)
const { handleSubmit } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } =
  useField<string>('password')

// SUBMIT
const onSubmit = handleSubmit(
  () => {
    authStore.login(email.value, password.value)
  },
  () => {
    submitted.value = true
  },
)
</script>

<template>
  <form @submit.prevent="onSubmit()" class="login">
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

      <template #error>
        <div v-if="submitted && emailError">{{ emailError }}</div>
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

      <template #error>
        <div v-if="submitted && passwordError">{{ passwordError }}</div>
      </template>
    </FormInput>

    <SubmitButton class="login__submit">{{ $t('login.submit') }}</SubmitButton>
  </form>
</template>

<style lang="scss" scoped>
.login {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
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
  margin-bottom: $spacing-6;
}

.login__submit {
  margin-top: $spacing-3;
}
</style>
