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
    <form @submit.prevent="onSubmitThrottled" class="forgot-password__form">
      <h1 class="forgot-password__title">{{ $t('forgot-password.title') }}</h1>
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

      <SubmitButton type="primary" size="lg" class="forgot-password__submit">{{
        $t('forgot-password.sendResetLink')
      }}</SubmitButton>
    </form>

    <div class="forgot-password__image" />
  </div>
</template>

<style lang="scss" scoped>
.forgot-password {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 216px;
  margin-top: $spacing-6;
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
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-image: url('/svgs/forgot-password.svg');
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (min-width: $screen-lg) {
    display: block;
  }
}
</style>
