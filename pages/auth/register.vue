<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// STATE
const authStore = useAuthStore()
const { t } = useI18n()

// VALIDATION
const schema = yup.object({
  email: yup
    .string()
    .required(t('validation.email.required'))
    .matches(
      /^[^@]+?\.[^@]+?@[\w.-]+\.[a-zA-Z]{2,}$/,
      t('validation.email.invalid'),
    ),
  password: yup
    .string()
    .required(t('validation.password.required'))
    .min(6, t('validation.password.min')),
  confirmPassword: yup
    .string()
    .required(t('validation.confirmPassword.required'))
    .oneOf([yup.ref('password')], t('validation.confirmPassword.match')),
})

const submitted = ref(false)
const { handleSubmit } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } =
  useField<string>('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField<string>('confirmPassword')

// SUBMIT
const onSubmit = handleSubmit(
  () => {
    authStore.register(email.value, password.value)
  },
  () => {
    submitted.value = true
  },
)
</script>

<template>
  <form @submit.prevent="onSubmit()" class="register">
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

      <template #error>
        <div v-if="submitted && emailError">{{ emailError }}</div>
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

      <template #error>
        <div v-if="submitted && passwordError">{{ passwordError }}</div>
      </template>
    </FormInput>

    <FormInput
      :label="$t('register.confirmPasswordLabel')"
      v-model="confirmPassword"
      id="confirmPassword"
      type="password"
      :placeholder="$t('register.confirmPasswordPlaceholder')"
    >
      <template #icon>
        <Icon name="mdi:lock-check-outline" />
      </template>

      <template #error>
        <div v-if="submitted && confirmPasswordError">
          {{ confirmPasswordError }}
        </div>
      </template>
    </FormInput>

    <SubmitButton class="register__submit">{{
      $t('register.submit')
    }}</SubmitButton>
  </form>
</template>

<style lang="scss" scoped>
.register {
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

.register__head {
  @include flex(column, center, flex-start);
  gap: $spacing-3;
  margin-bottom: $spacing-6;
}

.register__submit {
  margin-top: $spacing-3;
}
</style>
