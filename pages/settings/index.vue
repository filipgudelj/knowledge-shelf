<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

// STATE
const { t, locale } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { showToast } = useToast()
const loading = ref(false)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
const trim = (s?: string) => (s ?? '').trim()
const emailDisplay = user.value?.email

const nameInput = ref<{ focus: () => void } | null>(null)
const surnameInput = ref<{ focus: () => void } | null>(null)

const lastSaved = ref({
  name: trim(user.value?.user_metadata?.name ?? ''),
  surname: trim(user.value?.user_metadata?.surname ?? ''),
})

// COMPUTEDS
const isChanged = computed(
  () =>
    trim(name.value) !== lastSaved.value.name ||
    trim(surname.value) !== lastSaved.value.surname,
)

// VALIDATION
const schema = yup.object({
  name: yup.string().required(t('validation.name.required')),
  surname: yup.string().required(t('validation.surname.required')),
})

const submitted = ref(false)
const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: user.value?.user_metadata.name,
    surname: user.value?.user_metadata.surname,
  },
})

const { value: name } = useField<string>('name')
const { value: surname } = useField<string>('surname')

// HANDLERS
const focusSurname = () => surnameInput.value?.focus()

// SUBMIT
const onSubmit = handleSubmit(
  async () => {
    loading.value = true

    try {
      const [res] = await Promise.all([
        supabase.auth.updateUser({
          data: { name: name.value, surname: surname.value },
        }),
        wait(500),
      ])

      if (!res?.error) {
        await supabase.auth.refreshSession()
        showToast('success', t('toast.profileUpdated'))
        lastSaved.value = {
          name: trim(name.value),
          surname: trim(surname.value),
        }
      }
    } finally {
      loading.value = false
    }
  },
  () => {
    submitted.value = true
  },
)

// HEAD
useHead(() => ({
  title: t('seo.settings.title'),
  meta: [{ name: 'description', content: t('seo.settings.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="settings">
    <form @submit.prevent="onSubmit" class="settings__form">
      <h1 class="settings__title">
        {{ t('settings.title') }}
      </h1>

      <div class="settings__email-block">
        <div class="settings__label">{{ t('settings.email') }}</div>
        <p class="settings__email">{{ emailDisplay }}</p>
      </div>

      <FormInput
        ref="nameInput"
        id="name"
        v-model="name"
        :label="t('settings.name')"
        :placeholder="t('settings.placeholders.name')"
        @keydown.enter.prevent="focusSurname"
      >
        <template #icon><Icon name="mdi:account-outline" /></template>
        <template #error>
          <div v-if="errors.name">
            {{ errors.name }}
          </div>
        </template>
      </FormInput>

      <FormInput
        ref="surnameInput"
        id="surname"
        v-model="surname"
        :label="t('settings.surname')"
        :placeholder="t('settings.placeholders.surname')"
      >
        <template #icon><Icon name="mdi:account-outline" /></template>
        <template #error>
          <div v-if="errors.surname">
            {{ errors.surname }}
          </div>
        </template>
      </FormInput>

      <FormButton
        type="submit"
        variant="primary"
        size="lg"
        :disabled="loading || !isChanged"
        class="settings__submit"
      >
        <template v-if="loading">
          <Icon name="mdi:loading" class="spin" />&nbsp;{{
            t('settings.loading')
          }}
        </template>
        <template v-else>
          {{ t('settings.save') }}
        </template>
      </FormButton>
    </form>

    <div class="settings__image" />
  </div>
</template>

<style lang="scss" scoped>
.settings {
  @include flex(row);
  gap: $spacing-5;
  width: 100%;
  height: 360px;
  margin-top: $spacing-6;
}

.settings__form {
  @include flex(column, center, flex-start);
  gap: $spacing-1;
  width: 100%;

  @media (min-width: $screen-lg) {
    width: 50%;
  }
}

.settings__email-block {
  width: 100%;
  margin-block: $spacing-3;
}

.settings__label {
  font-size: $font-size-sm;
}

.settings__email {
  padding-bottom: $spacing-3;
  font-size: $font-size-lg;
}

.settings__submit {
  margin-top: $spacing-3;
}

.settings__image {
  display: none;
  width: 50%;
  height: 100%;
  border-radius: $radius-4;
  background-image: url('/svgs/settings.svg');
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
