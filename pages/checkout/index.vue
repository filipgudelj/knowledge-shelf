<script setup lang="ts">
import { formatNumberToEuro } from '~/helpers/formatters'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// STATE
const { t, locale } = useI18n()
const cartStore = useCartStore()
const showSkeleton = ref(true)

const form = reactive({
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
})

const countries = [
  { label: 'Croatia', value: 'HR' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Austria', value: 'AT' },
]

const shippingMethods = [
  {
    label: t('checkout.shipping.methods.standard'),
    value: 'standard',
    price: 0,
  },
  {
    label: t('checkout.shipping.methods.express'),
    value: 'express',
    price: 4.9,
  },
]

// COMPUTEDS
const subtotal = computed(() =>
  cartStore.items.reduce((sum, i) => {
    return sum + (i.book?.price ?? 0) * i.quantity
  }, 0),
)

const shippingPrice = computed(() => {
  const sel = shippingMethods.find((m) => m.value === form.shippingMethod)
  return sel?.price ?? 0
})

const total = computed(() => subtotal.value + shippingPrice.value)

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
        <form class="checkout__form">
          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.contact.title') }}
            </h2>

            <FormInput
              id="email"
              v-model="form.email"
              type="email"
              :label="t('checkout.contact.email')"
              :placeholder="t('checkout.contact.placeholders.email')"
            >
              <template #icon>
                <Icon name="mdi:email-outline" />
              </template>
            </FormInput>

            <div class="checkout__row">
              <FormInput
                id="name"
                v-model="form.name"
                :label="t('checkout.contact.name')"
                :placeholder="t('checkout.contact.placeholders.name')"
              >
                <template #icon>
                  <Icon name="mdi:person" />
                </template>
              </FormInput>

              <FormInput
                id="surname"
                v-model="form.surname"
                :label="t('checkout.contact.surname')"
                :placeholder="t('checkout.contact.placeholders.surname')"
              >
                <template #icon>
                  <Icon name="mdi:person" />
                </template>
              </FormInput>
            </div>

            <FormInput
              id="phone"
              v-model="form.phone"
              type="tel"
              :label="t('checkout.contact.phoneOptional')"
              :placeholder="t('checkout.contact.placeholders.phone')"
            >
              <template #icon>
                <Icon name="mdi:phone" />
              </template>
            </FormInput>
          </div>

          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.shipping.title') }}
            </h2>

            <FormSelect
              id="country"
              v-model="form.country"
              :label="t('checkout.shipping.country')"
              :options="countries"
            />

            <div class="checkout__row">
              <FormInput
                id="city"
                v-model="form.city"
                :label="t('checkout.shipping.city')"
                :placeholder="t('checkout.shipping.placeholders.city')"
              >
                <template #icon>
                  <Icon name="mdi:office-building-location-outline" />
                </template>
              </FormInput>

              <FormInput
                id="zip"
                v-model="form.zip"
                :label="t('checkout.shipping.zip')"
                :placeholder="t('checkout.shipping.placeholders.zip')"
              >
                <template #icon>
                  <Icon name="mdi:archive-location-outline" />
                </template>
              </FormInput>
            </div>

            <FormInput
              id="address"
              v-model="form.address"
              :label="t('checkout.shipping.address')"
              :placeholder="t('checkout.shipping.placeholders.address')"
            >
              <template #icon>
                <Icon name="mdi:address-marker-outline" />
              </template>
            </FormInput>
          </div>

          <div class="checkout__section">
            <h2 class="checkout__section-title">
              {{ t('checkout.shipping.methodTitle') }}
            </h2>

            <FormSelect
              id="shipping"
              v-model="form.shippingMethod"
              :label="t('checkout.shipping.chooseMethod')"
              :options="
                shippingMethods.map((m) => ({
                  label: `${m.label} (${formatNumberToEuro(m.price)})`,
                  value: m.value,
                }))
              "
            />

            <FormInput
              id="notes"
              v-model="form.notes"
              :label="t('checkout.shipping.notesOptional')"
              :placeholder="t('checkout.shipping.placeholders.notes')"
            >
              <template #icon>
                <Icon name="mdi:pencil" />
              </template>
            </FormInput>
          </div>

          <FormButton type="button" variant="primary" class="checkout__submit">
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
                <p class="summary__title">{{ i.book?.title }}</p>
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

  @media (min-width: $screen-xl) {
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
