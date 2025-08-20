<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'
import girlReadingSvgUrl from '@/public/svgs/girl-reading.svg?url'

// STATE
const authStore = useAuthStore()
const { showToast } = useToast()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const loading = ref(false)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const passwordInput = ref<{ focus: () => void } | null>(null)
const imageLoaded = ref(false)

// LCH
onMounted(() => {
  const img = new Image()
  img.src = girlReadingSvgUrl
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
  async () => {
    loading.value = true
    try {
      const [res] = await Promise.all([
        authStore.login(email.value, password.value),
        wait(500),
      ])

      if (res?.error?.code === 'invalid_credentials') {
        showToast('error', t('toast.invalidLoginCredentials'))
        await nextTick()
        loading.value = false
        return
      }

      if (!res?.error) {
        await router.push(localePath('/'))
        return
      }
    } catch (e) {
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
  title: t('seo.login.title'),
  meta: [{ name: 'description', content: t('seo.login.description') }],
  htmlAttrs: { lang: locale.value },
}))
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

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="loading"
        class="login__submit"
      >
        <template v-if="loading">
          <Icon name="mdi:loading" class="spin" /> &nbsp;{{
            $t('login.loading')
          }}
        </template>
        <template v-else> {{ $t('login.submit') }} </template>
      </FormButton>
    </form>

    <div
      class="login__image"
      :class="{ 'login__image--loaded': imageLoaded }"
      :style="{ backgroundImage: `url('${girlReadingSvgUrl}')` }"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 361px;
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
