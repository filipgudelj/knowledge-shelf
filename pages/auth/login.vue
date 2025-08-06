<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'

// STATE
const authStore = useAuthStore()
const { showToast } = useToast()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const passwordInput = ref<{ focus: () => void } | null>(null)

// HANDLERS
const focusPassword = () => {
  passwordInput.value?.focus()
}

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
})

const submitted = ref(false)
const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } =
  useField<string>('password')

// SUBMIT
const onSubmit = handleSubmit(
  async () => {
    const { error } = await authStore.login(email.value, password.value)
    if (error?.code === 'invalid_credentials') {
      showToast('error', t('toast.invalidLoginCredentials'))
    } else if (!error) {
      resetForm()
      router.push(localePath('/'))
    }
  },
  () => {
    submitted.value = true
  },
)

const onSubmitThrottled = useThrottleFn((e: Event) => {
  e.preventDefault()
  onSubmit()
}, 1000)

// HEAD
useHead({
  title: 'Login | Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Log in to continue using your account features.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <div class="login">
    <form @submit.prevent="onSubmitThrottled" class="login__form">
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
        @keydown.enter.prevent="focusPassword"
      >
        <template #icon>
          <Icon name="mdi:email-outline" />
        </template>

        <template #error>
          <div v-if="submitted && emailError">{{ emailError }}</div>
        </template>
      </FormInput>

      <FormInput
        ref="passwordInput"
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

      <NuxtLinkLocale to="/auth/forgot-password" class="login__forgot">
        {{ $t('login.forgotPassword') }}
      </NuxtLinkLocale>

      <SubmitButton type="primary" size="lg" class="login__submit">{{
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
  height: 357px;
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

.login__forgot {
  align-self: flex-end;
  font-size: $font-size-sm;
  transition: all 0.4s ease;

  &:hover {
    color: $color-blue-500;
  }
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
