<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'

// STATE
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const { showToast } = useToast()
const localePath = useLocalePath()
const shouldRender = ref(false)
const loading = ref(false)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const { error_description } = route.query as Record<string, string>

// LCH
onMounted(async () => {
  if (error_description === 'Email link is invalid or has expired') {
    await nextTick()
    showToast('error', t('toast.linkExpired'))
    router.push(localePath('/'))
  } else {
    shouldRender.value = true
  }
})

// VALIDATION
const schema = yup.object({
  password: yup
    .string()
    .min(6, t('validation.password.min'))
    .required(t('validation.password.required')),
})

const submitted = ref(false)
const { handleSubmit } = useForm({ validationSchema: schema })
const { value: password, errorMessage: passwordError } =
  useField<string>('password')

// SUBMIT
const onSubmit = handleSubmit(
  async () => {
    loading.value = true
    try {
      const [res] = await Promise.all([
        authStore.updateUserPassword(password.value),
        wait(500),
      ])

      if (res?.error?.message === 'Auth session missing!') {
        showToast('error', t('toast.authSessionMissing'))
        await nextTick()
        loading.value = false
        return
      }

      if (res?.error?.code === 'same_password') {
        showToast('error', t('toast.passwordSameAsOld'))
        await nextTick()
        loading.value = false
        return
      }

      if (!res?.error) {
        showToast('success', t('toast.passwordUpdated'))
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
  title: t('seo.resetPassword.title'),
  meta: [{ name: 'description', content: t('seo.resetPassword.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div v-if="shouldRender" class="reset-password">
    <form @submit.prevent="onSubmitThrottled" class="reset-password__form">
      <h1 class="reset-password__title">{{ $t('resetPassword.title') }}</h1>

      <FormInput
        :label="$t('resetPassword.newPasswordLabel')"
        v-model="password"
        id="new-password"
        type="password"
        :placeholder="$t('resetPassword.newPasswordPlaceholder')"
      >
        <template #icon>
          <Icon name="mdi:password-outline" />
        </template>

        <template #error>
          <div v-if="submitted && passwordError">{{ passwordError }}</div>
        </template>
      </FormInput>

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="loading"
        class="reset-password__submit"
      >
        <template v-if="loading">
          <Icon name="mdi:loading" class="spin" /> &nbsp;{{
            $t('resetPassword.loading')
          }}
        </template>
        <template v-else> {{ $t('resetPassword.setNewPassword') }} </template>
      </FormButton>
    </form>

    <div class="reset-password__image" />
  </div>
</template>

<style lang="scss" scoped>
.reset-password {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
}

.reset-password__form {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
  width: 100%;

  @media (min-width: $screen-lg) {
    width: 50%;
  }
}

.reset-password__title {
  margin-bottom: $spacing-5;
}

.reset-password__submit {
  margin-top: $spacing-3;
}

.reset-password__image {
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-image: url('/svgs/guy-with-key.svg');
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;

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
