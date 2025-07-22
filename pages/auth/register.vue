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
  <div class="register">
    <form @submit.prevent="onSubmit()" class="register__form">
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

    <div class="login__image" />
  </div>
</template>

<style lang="scss" scoped>
.register {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 435px;
  margin-top: $spacing-6;
}

.register__form {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
  width: 100%;

  @media (min-width: $screen-lg) {
    width: 50%;
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

.login__image {
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-image: url('/svgs/boy-writing.svg');
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (min-width: $screen-lg) {
    display: block;
  }
}
</style>
