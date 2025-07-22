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
  <div class="login">
    <form @submit.prevent="onSubmit()" class="login__form">
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

      <SubmitButton class="login__submit">{{
        $t('login.submit')
      }}</SubmitButton>
    </form>

    <div class="login__image" />
  </div>
</template>

<style lang="scss" scoped>
.login {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 344px;
  margin-top: $spacing-6;
}

.login__form {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
  width: 100%;

  @media (min-width: $screen-lg) {
    width: 50%;
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

.login__image {
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-image: url('/svgs/girl-reading.svg');
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (min-width: $screen-lg) {
    display: block;
  }
}
</style>
