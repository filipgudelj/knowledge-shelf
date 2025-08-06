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

const onSubmit = handleSubmit(
  async () => {
    const { error } = await authStore.updateUserPassword(password.value)

    if (error?.message === 'Auth session missing!') {
      showToast('error', t('toast.authSessionMissing'))
    } else if (error?.code === 'same_password') {
      showToast('error', t('toast.passwordSameAsOld'))
    } else if (!error) {
      showToast('success', t('toast.passwordUpdated'))
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
  title: 'Reset Password | Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Set a new password to access your account.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <div v-if="shouldRender" class="reset-password">
    <form @submit.prevent="onSubmitThrottled" class="reset-password__form">
      <h1 class="reset-password__title">{{ $t('reset-password.title') }}</h1>

      <FormInput
        :label="$t('reset-password.newPasswordLabel')"
        v-model="password"
        id="new-password"
        type="password"
        :placeholder="$t('reset-password.newPasswordPlaceholder')"
      >
        <template #icon>
          <Icon name="mdi:password-outline" />
        </template>

        <template #error>
          <div v-if="submitted && passwordError">{{ passwordError }}</div>
        </template>
      </FormInput>

      <SubmitButton type="primary" size="lg" class="reset-password__submit">{{
        $t('reset-password.setNewPassword')
      }}</SubmitButton>
    </form>

    <div class="reset-password__image" />
  </div>
</template>

<style lang="scss" scoped>
.reset-password {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 216px;
  margin-top: $spacing-6;
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
</style>
