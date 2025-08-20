<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'
import boyWritingSvgUrl from '@/public/svgs/boy-writing.svg?url'

// STATE
const authStore = useAuthStore()
const { showToast } = useToast()
const { t, locale } = useI18n()
const loading = ref(false)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const passwordInput = ref<{ focus: () => void } | null>(null)
const confirmPasswordInput = ref<{ focus: () => void } | null>(null)
const imageLoaded = ref(false)

// LCH
onMounted(() => {
  const img = new Image()
  img.src = boyWritingSvgUrl
  if (img.complete && img.naturalWidth > 0) {
    imageLoaded.value = true
  } else {
    img.onload = () => (imageLoaded.value = true)
    img.onerror = () => (imageLoaded.value = true)
  }
})

// HANDLERS
const focusPassword = () => {
  passwordInput.value?.focus()
}
const focusConfirmPassword = () => {
  confirmPasswordInput.value?.focus()
}

// VALIDATION
const schema = yup.object({
  email: yup
    .string()
    .required(t('validation.email.required'))
    .email(t('validation.email.invalid')),
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
const { handleSubmit, resetForm } = useForm({
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
  async () => {
    loading.value = true
    try {
      const [{ data, error }] = await Promise.all([
        authStore.register(email.value, password.value),
        wait(500),
      ])

      if (error?.code === 'over_email_send_rate_limit') {
        showToast('error', t('toast.requestTooSoon'))
        resetForm()
      } else if (!error && data.user?.identities?.length === 0) {
        showToast('info', t('toast.alreadyRegistered'))
        resetForm()
      } else if (!error && data.user?.identities?.length !== 0) {
        showToast('success', t('toast.confirmationSent'))
        resetForm()
      }
    } finally {
      await nextTick()
      loading.value = false
    }
  },
  () => {
    submitted.value = true
  },
)

const onSubmitThrottled = useThrottleFn((e: Event) => {
  e.preventDefault()
  onSubmit()
}, 500)

// HEAD
useHead(() => ({
  title: t('seo.register.title'),
  meta: [{ name: 'description', content: t('seo.register.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="register">
    <form @submit.prevent="onSubmitThrottled" class="register__form">
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
        :label="$t('register.passwordLabel')"
        v-model="password"
        id="password"
        type="password"
        :placeholder="$t('register.passwordPlaceholder')"
        @keydown.enter.prevent="focusConfirmPassword"
      >
        <template #icon>
          <Icon name="mdi:password-outline" />
        </template>

        <template #error>
          <div v-if="submitted && passwordError">{{ passwordError }}</div>
        </template>
      </FormInput>

      <FormInput
        ref="confirmPasswordInput"
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

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="loading"
        class="register__submit"
      >
        <template v-if="loading">
          <Icon name="mdi:loading" class="spin" /> &nbsp;{{
            $t('register.loading')
          }}
        </template>
        <template v-else> {{ $t('register.submit') }} </template>
      </FormButton>
    </form>

    <div
      class="register__image"
      :class="{ 'register__image--loaded': imageLoaded }"
      :style="{ backgroundImage: `url('${boyWritingSvgUrl}')` }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 429px;
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

.register__image {
  position: relative;
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0;
  transition: opacity 0.35s ease;

  &--loaded {
    opacity: 1;
  }

  @media (min-width: $screen-lg) {
    display: block;
  }
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
