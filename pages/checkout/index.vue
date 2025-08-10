<script setup lang="ts">
import { formatNumberToEuro } from '~/helpers/formatters'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useThrottleFn } from '@vueuse/core'

// STATE
const { t, locale } = useI18n()
const cartStore = useCartStore()
const showSkeleton = ref(true)

const nameInput = ref<{ focus: () => void } | null>(null)
const surnameInput = ref<{ focus: () => void } | null>(null)
const phoneInput = ref<{ focus: () => void } | null>(null)
const cityInput = ref<{ focus: () => void } | null>(null)
const zipInput = ref<{ focus: () => void } | null>(null)
const addressInput = ref<{ focus: () => void } | null>(null)
const notesInput = ref<{ focus: () => void } | null>(null)

const euCountryCodes = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]

const countries = computed(() =>
  euCountryCodes.map((code) => ({
    label: t(`countries.${code}`),
    value: code,
  })),
)
const shippingMethods = [
  {
    label: t('checkout.shipping.methods.standard'),
    value: 'standard',
    price: 5,
  },
  {
    label: t('checkout.shipping.methods.express'),
    value: 'express',
    price: 15,
  },
]

// COMPUTEDS
const subtotal = computed(() =>
  cartStore.items.reduce(
    (sum, i) => sum + (i.book?.price ?? 0) * i.quantity,
    0,
  ),
)

const shippingPrice = computed(() => {
  const sel = shippingMethods.find((m) => m.value === shippingMethod.value)
  return sel?.price ?? 0
})

const total = computed(() => subtotal.value + shippingPrice.value)

// VALIDATION
const schema = yup.object({
  email: yup
    .string()
    .required(t('validation.email.required'))
    .matches(
      /^[^@]+?\.[^@]+?@[\w.-]+\.[a-zA-Z]{2,}$/,
      t('validation.email.invalid'),
    ),
  name: yup.string().required(t('validation.name.required')),
  surname: yup.string().required(t('validation.surname.required')),
  phone: yup.string().optional(),
  country: yup.string().required(t('validation.country.required')),
  city: yup.string().required(t('validation.city.required')),
  zip: yup.string().required(t('validation.zip.required')),
  address: yup.string().required(t('validation.address.required')),
  shippingMethod: yup
    .string()
    .required(t('validation.shippingMethod.required')),
  notes: yup.string().optional(),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    name: '',
    surname: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'HR',
    shippingMethod: 'standard',
    notes: '',
  },
})

const { value: email } = useField<string>('email')
const { value: name } = useField<string>('name')
const { value: surname } = useField<string>('surname')
const { value: phone } = useField<string>('phone')
const { value: country } = useField<string>('country')
const { value: city } = useField<string>('city')
const { value: zip } = useField<string>('zip')
const { value: address } = useField<string>('address')
const { value: shippingMethod } = useField<string>('shippingMethod')
const { value: notes } = useField<string>('notes')

// HANDLERS
const focusName = () => nameInput.value?.focus()
const focusSurname = () => surnameInput.value?.focus()
const focusPhone = () => phoneInput.value?.focus()
const focusCity = () => cityInput.value?.focus()
const focusZip = () => zipInput.value?.focus()
const focusAddress = () => addressInput.value?.focus()
const focusNotes = () => notesInput.value?.focus()

// SUBMIT
const onSubmit = handleSubmit(() => {
  console.log('Submitted')
})

const onSubmitThrottled = useThrottleFn((e: Event) => {
  e.preventDefault()
  onSubmit()
}, 1000)

// LCH
onMounted(async () => {
  await cartStore.loadCart()
  setTimeout(() => (showSkeleton.value = false), 500)
})

// HEAD
useHead(() => ({
  title: t('seo.checkout.title'),
  meta: [{ name: 'description', content: t('seo.checkout.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="checkout">
    <h1 class="checkout__title">{{ t('checkout.title') }}</h1>

    <div v-if="showSkeleton" class="checkout__skeleton">
      <VueSkeletonLoader
        type="text@3"
        height="280px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="skeleton__left"
      />
      <VueSkeletonLoader
        type="text@1"
        height="400px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="skeleton__right"
      />
    </div>

    <div v-else>
      <div v-if="cartStore.items.length === 0" class="checkout__empty">
        {{ t('checkout.empty') }}
      </div>

      <div v-else class="checkout__grid">
        <form class="checkout__form" @submit.prevent="onSubmitThrottled">
          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.contact.title') }}
            </h2>

            <FormInput
              id="email"
              v-model="email"
              type="email"
              :label="t('checkout.contact.email')"
              :placeholder="t('checkout.contact.placeholders.email')"
              @keydown.enter.prevent="focusName"
            >
              <template #icon><Icon name="mdi:email-outline" /></template>
              <template #error>
                <div v-if="errors.email">
                  {{ errors.email }}
                </div>
              </template>
            </FormInput>

            <div class="checkout__row">
              <FormInput
                ref="nameInput"
                id="name"
                v-model="name"
                :label="t('checkout.contact.name')"
                :placeholder="t('checkout.contact.placeholders.name')"
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
                :label="t('checkout.contact.surname')"
                :placeholder="t('checkout.contact.placeholders.surname')"
                @keydown.enter.prevent="focusPhone"
              >
                <template #icon><Icon name="mdi:account-outline" /></template>
                <template #error>
                  <div v-if="errors.surname">
                    {{ errors.surname }}
                  </div>
                </template>
              </FormInput>
            </div>

            <FormInput
              ref="phoneInput"
              id="phone"
              v-model="phone"
              type="tel"
              :label="t('checkout.contact.phoneOptional')"
              :placeholder="t('checkout.contact.placeholders.phone')"
              @keydown.enter.prevent="focusCity"
            >
              <template #icon><Icon name="mdi:phone" /></template>
              <template #error>
                <div v-if="errors.phone">
                  {{ errors.phone }}
                </div>
              </template>
            </FormInput>
          </div>

          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.shipping.title') }}
            </h2>

            <FormSelect
              id="country"
              v-model="country"
              :label="t('checkout.shipping.country')"
              :options="countries"
            />

            <div class="checkout__row">
              <FormInput
                ref="cityInput"
                id="city"
                v-model="city"
                :label="t('checkout.shipping.city')"
                :placeholder="t('checkout.shipping.placeholders.city')"
                @keydown.enter.prevent="focusZip"
              >
                <template #icon>
                  <Icon name="mdi:office-building-location-outline" />
                </template>
                <template #error>
                  <div v-if="errors.city">
                    {{ errors.city }}
                  </div>
                </template>
              </FormInput>

              <FormInput
                ref="zipInput"
                id="zip"
                v-model="zip"
                :label="t('checkout.shipping.zip')"
                :placeholder="t('checkout.shipping.placeholders.zip')"
                @keydown.enter.prevent="focusAddress"
              >
                <template #icon><Icon name="mdi:map-marker-path" /></template>
                <template #error>
                  <div v-if="errors.zip">
                    {{ errors.zip }}
                  </div>
                </template>
              </FormInput>
            </div>

            <FormInput
              ref="addressInput"
              id="address"
              v-model="address"
              :label="t('checkout.shipping.address')"
              :placeholder="t('checkout.shipping.placeholders.address')"
              @keydown.enter.prevent="focusNotes"
            >
              <template #icon>
                <Icon name="mdi:address-marker-outline" />
              </template>
              <template #error>
                <div v-if="errors.address">
                  {{ errors.address }}
                </div>
              </template>
            </FormInput>
          </div>

          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.shipping.methodTitle') }}
            </h2>

            <FormSelect
              id="shipping"
              v-model="shippingMethod"
              :label="t('checkout.shipping.chooseMethod')"
              :options="
                shippingMethods.map((m) => ({
                  label: `${m.label} (${formatNumberToEuro(m.price)})`,
                  value: m.value,
                }))
              "
            />

            <FormInput
              ref="notesInput"
              id="notes"
              v-model="notes"
              :label="t('checkout.shipping.notesOptional')"
              :placeholder="t('checkout.shipping.placeholders.notes')"
            >
              <template #icon><Icon name="mdi:pencil" /></template>
              <template #error>
                <div v-if="errors.notes">
                  {{ errors.notes }}
                </div>
              </template>
            </FormInput>
          </div>

          <FormButton type="submit" variant="primary" class="checkout__submit">
            {{ t('checkout.placeOrder') }}
          </FormButton>
        </form>

        <aside class="checkout__summary">
          <h2 class="checkout__section-title">
            {{ t('checkout.orderSummary') }}
          </h2>
          <div class="summary__list">
            <div
              v-for="i in cartStore.items"
              :key="i.book_id"
              class="summary__item"
            >
              <img
                :src="i.book?.cover_url"
                :alt="i.book?.title"
                class="summary__image"
              />
              <div class="summary__info">
                <NuxtLinkLocale
                  :to="`/books/${i.book?.id}`"
                  class="summary__title"
                  >{{ i.book?.title }}</NuxtLinkLocale
                >
                <p class="summary__meta">× {{ i.quantity }}</p>
              </div>
              <div class="summary__price">
                {{ formatNumberToEuro((i.book?.price ?? 0) * i.quantity) }}
              </div>
            </div>
          </div>

          <div class="summary__row summary__row--subtotal">
            <span>{{ t('checkout.subtotal') }}</span>
            <strong>{{ formatNumberToEuro(subtotal) }}</strong>
          </div>

          <div class="summary__row">
            <span>{{ t('checkout.shippingTotal') }}</span>
            <strong>{{ formatNumberToEuro(shippingPrice) }}</strong>
          </div>

          <div class="summary__row summary__row--total">
            <span>{{ t('checkout.total') }}</span>
            <strong>{{ formatNumberToEuro(total) }}</strong>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  width: 100%;
}

.checkout__title {
  margin-top: $spacing-6;
}

.checkout__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;
  margin-top: $spacing-6;

  @media (min-width: $screen-lg) {
    grid-template-columns: 1.5fr 1fr;
  }
}

.checkout__form {
  display: grid;
  gap: $spacing-6;
}

.checkout__section {
  display: grid;
  gap: $spacing-4;
}

.checkout__section-title {
  font-size: $font-size-lg;
  font-weight: 700;
}

.checkout__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-4;

  @media (min-width: $screen-md) {
    grid-template-columns: 1fr 1fr;
  }
}

.checkout__submit {
  width: 100%;
}

.checkout__summary {
  position: sticky;
  top: 96px;
  display: grid;
  gap: $spacing-4;
  height: fit-content;
  padding: $spacing-6;
  border: 1px solid $color-gray-300;
  border-radius: $radius-4;

  html.dark & {
    border-color: $color-gray-700;
  }
}

.summary__list {
  display: grid;
  gap: $spacing-4;
}

.summary__item {
  display: grid;
  grid-template-columns: 65px 1fr auto;
  gap: $spacing-4;
  align-items: center;
}

.summary__image {
  width: 65px;
  height: 95px;
  border-radius: $radius-3;
  object-fit: cover;
}

.summary__info {
  overflow: hidden;
}

.summary__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    color: $color-blue-500;
  }
}

.summary__meta {
  color: $color-gray-700;
  font-size: $font-size-sm;

  html.dark & {
    color: $color-gray-300;
  }
}

.summary__price {
  font-weight: 700;
}

.summary__row {
  @include flex(row, space-between, center);

  &--subtotal {
    margin-top: $spacing-3;
  }

  &--total {
    margin-top: $spacing-2;
    padding-top: $spacing-4;
    border-top: 1px solid $color-gray-300;

    html.dark & {
      border-color: $color-gray-700;
    }
  }
}

.checkout__empty {
  margin-top: $spacing-6;
  font-size: $font-size-lg;
}

.select {
  margin-bottom: $spacing-6;
}

.checkout__skeleton {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-8;
  margin-top: $spacing-6;

  @media (min-width: $screen-xl) {
    grid-template-columns: 1.5fr 1fr;
  }
}

.skeleton__left {
  @include flex(column);
  gap: $spacing-6;
}
</style>
