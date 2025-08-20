<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'
import forgotPasswordSvgUrl from '@/public/svgs/forgot-password.svg?url'

// STATE
const authStore = useAuthStore()
const { t, locale } = useI18n()
const { showToast } = useToast()
const loading = ref(false)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const imageLoaded = ref(false)

// LCH
onMounted(() => {
  const img = new Image()
  img.src = forgotPasswordSvgUrl
  if (img.complete && img.naturalWidth > 0) {
    imageLoaded.value = true
  } else {
    img.onload = () => (imageLoaded.value = true)
    img.onerror = () => (imageLoaded.value = true)
  }
})

// VALIDATION
const schema = yup.object({
  email: yup
    .string()
    .required(t('validation.email.required'))
    .matches(
      /^[^@]+?\.[^@]+?@[\w.-]+\.[a-zA-Z]{2,}$/,
      t('validation.email.invalid'),
    ),
})

const submitted = ref(false)
const { handleSubmit, resetForm } = useForm({ validationSchema: schema })
const { value: email, errorMessage: emailError } = useField<string>('email')

// SUBMIT
const onSubmit = handleSubmit(
  async () => {
    loading.value = true
    try {
      const { error } = await Promise.all([
        authStore.sendPasswordResetLink(email.value),
        wait(500),
      ]).then(([res]) => res)

      if (error?.code === 'over_email_send_rate_limit') {
        showToast('error', t('toast.requestTooSoon'))
        resetForm()
        return
      }

      resetForm()
      showToast('success', t('toast.resetLinkSent'))
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
  title: t('seo.forgotPassword.title'),
  meta: [{ name: 'description', content: t('seo.forgotPassword.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="forgot-password">
    <form @submit.prevent="onSubmitThrottled" class="forgot-password__form">
      <h1 class="forgot-password__title">{{ $t('forgotPassword.title') }}</h1>
      <FormInput
        :label="$t('forgotPassword.emailLabel')"
        v-model="email"
        id="email"
        type="text"
        :placeholder="$t('forgotPassword.emailPlaceholder')"
      >
        <template #icon>
          <Icon name="mdi:email-outline" />
        </template>

        <template #error>
          <div v-if="submitted && emailError">{{ emailError }}</div>
        </template>
      </FormInput>

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="loading"
        class="forgot-password__submit"
      >
        <template v-if="loading">
          <Icon name="mdi:loading" class="spin" /> &nbsp;{{
            $t('forgotPassword.loading')
          }}
        </template>
        <template v-else>
          {{ $t('forgotPassword.sendResetLink') }}
        </template></FormButton
      >
    </form>

    <div
      class="forgot-password__image"
      :class="{ 'forgot-password__image--loaded': imageLoaded }"
      :style="{ backgroundImage: `url('${forgotPasswordSvgUrl}')` }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.forgot-password {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
}

.forgot-password__form {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
  width: 100%;

  @media (min-width: $screen-lg) {
    width: 50%;
  }
}

.forgot-password__title {
  margin-bottom: $spacing-5;
}

.forgot-password__submit {
  margin-top: $spacing-3;
}

.forgot-password__image {
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
