<script lang="ts" setup>
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'

// STATE
const authStore = useAuthStore()
const { t, locale } = useI18n()
const { showToast } = useToast()

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

const onSubmit = handleSubmit(
  async () => {
    await authStore.sendPasswordResetLink(email.value)
    resetForm()
    showToast('success', t('toast.resetLinkSent'))
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
  title: 'Forgot Password | Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content:
        'Forgot your password? Enter your email to receive a reset link.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <div class="forgot-password">
    <form @submit.prevent="onSubmitThrottled">
      <h1>{{ $t('forgot-password.title') }}</h1>
      <FormInput
        :label="$t('forgot-password.emailLabel')"
        v-model="email"
        id="email"
        type="text"
        :placeholder="$t('forgot-password.emailPlaceholder')"
      >
        <template #icon>
          <Icon name="mdi:email-outline" />
        </template>

        <template #error>
          <div v-if="submitted && emailError">{{ emailError }}</div>
        </template>
      </FormInput>

      <SubmitButton type="primary" size="lg">{{
        $t('forgot-password.sendResetLink')
      }}</SubmitButton>
    </form>
  </div>
</template>
