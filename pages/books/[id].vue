<script lang="ts" setup>
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'

// STATE
const route = useRoute()
const { t, locale } = useI18n()
const booksStore = useBooksStore()
const bookId = Number(route.params.id)
const book = ref<Book | null>(null)
const showSkeleton = ref(true)
const user = useSupabaseUser()
const cartStore = useCartStore()
const favouritesStore = useFavouritesStore()

// COMPUTEDS
const inCart = computed(() =>
  book.value ? cartStore.isInCart(book.value.id) : false,
)

// API
if (!isNaN(bookId)) {
  book.value = await booksStore.getBookDetails(bookId)
} else {
  throw createError({
    statusCode: 404,
    statusMessage: t('errors.invalidBookId'),
  })
}

// LCH
onMounted(async () => {
  await favouritesStore.loadFavourites()
  await cartStore.loadCart()
})

onMounted(() => {
  setTimeout(() => {
    showSkeleton.value = false
  }, 500)
})

// HEAD
useHead(() => ({
  title: t('seo.book.title', { title: book.value?.title ?? '' }),
  meta: [{ name: 'description', content: t('seo.book.description') }],
  htmlAttrs: { lang: locale.value },
}))
const quantity = ref(book.value?.stock === 0 ? 0 : 1)
</script>

<template>
  <template v-if="book && !showSkeleton">
    <div class="book">
      <div class="book__summary">
        <NuxtLinkLocale
          :to="`/authors/${book.author.id}`"
          class="book__summary-author"
          :aria-label="`View details about author ${book.author.name}`"
        >
          {{ book.author.name }}
        </NuxtLinkLocale>

        <h1 class="book__summary-title">{{ book.title }}</h1>

        <div class="book__summary-price">
          <span v-if="book.sale_price" class="book__summary-price--old">
            {{ formatNumberToEuro(book.price, locale) }}
          </span>
          <span class="book__summary-price--current">
            {{ formatNumberToEuro(book.sale_price ?? book.price, locale) }}
          </span>
        </div>

        <div class="book__summary-actions">
          <FormInputNumber
            id="quantity"
            v-model="quantity"
            :label="t('book.quantity')"
            :min="book.stock === 0 ? 0 : 1"
            :max="book.stock"
            :step="1"
            class="book__summary-quantity"
          />

          <FormButton
            @click="cartStore.addToCart(book.id, quantity)"
            type="button"
            :variant="inCart ? 'tertiary' : 'primary'"
            size="lg"
            :disabled="!user || book.stock === 0 || inCart"
            class="book__summary-submit"
          >
            {{
              !user
                ? t('book.actions.loginToAdd')
                : cartStore.isInCart(book.id)
                  ? t('book.actions.addedToBasket')
                  : book.stock > 0
                    ? t('book.actions.addToBasket')
                    : t('book.actions.unavailable')
            }}
          </FormButton>

          <AddToFavourites
            variant="rectangle"
            :book-id="book.id"
            class="book__summary-favourite"
          />
        </div>
      </div>

      <div class="book__media">
        <img :src="book.cover_url" :alt="book.title" />
      </div>

      <div class="book__meta">
        <div class="book__meta-item" v-if="book.original_title">
          <Icon name="mdi:flag-variant" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.originalTitle') }}</p>
            <p class="book__meta-value">{{ book.original_title }}</p>
          </div>
        </div>

        <div class="book__meta-item" v-if="book.translator">
          <Icon name="mdi:translate" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.translator') }}</p>
            <p class="book__meta-value">{{ book.translator }}</p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon
            name="mdi:calendar-month-outline"
            size="24px"
            class="book__meta-icon"
          />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.yearPublished') }}</p>
            <p class="book__meta-value">{{ book.year_published }}</p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon name="mdi:language" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.language') }}</p>
            <p class="book__meta-value">
              {{ t(`book.values.language.${book.language}`) }}
            </p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon name="mdi:bank" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.publisher') }}</p>
            <p class="book__meta-value">{{ book.publisher }}</p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon name="mdi:cube-outline" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.format') }}</p>
            <p class="book__meta-value">
              {{ book.format_width_mm }} × {{ book.format_height_mm }} mm
            </p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon
            name="mdi:format-align-justify"
            size="24px"
            class="book__meta-icon"
          />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.pagesCount') }}</p>
            <p class="book__meta-value">{{ book.pages_count }}</p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon
            name="mdi:book-open-variant"
            size="24px"
            class="book__meta-icon"
          />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.bindingType') }}</p>
            <p class="book__meta-value">
              {{ t(`book.values.bindingType.${book.binding_type}`) }}
            </p>
          </div>
        </div>

        <div class="book__meta-item">
          <Icon name="mdi:scale-balance" size="24px" class="book__meta-icon" />
          <div class="book__meta-content">
            <p class="book__meta-label">{{ t('book.meta.weight') }}</p>
            <p class="book__meta-value">{{ book.weight_kg }} kg</p>
          </div>
        </div>
      </div>

      <div class="book__insight">
        <BookTabs
          :description="book.description"
          :author-bio="book.author.bio"
        />
      </div>
    </div>
  </template>

  <div v-else class="book__skeleton">
    <VueSkeletonLoader
      type="text@5"
      height="30px"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
      class="book__skeleton-summary"
    />
    <VueSkeletonLoader
      type="image@1"
      height="500px"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
      class="book__skeleton-media"
    />
    <VueSkeletonLoader
      type="text@7"
      height="30px"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
      class="book__skeleton-meta"
    />
    <VueSkeletonLoader
      type="text@1"
      height="200px"
      base-color="var(--skel-base)"
      highlight-color="var(--skel-highlight)"
      class="book__skeleton-insight"
    />
  </div>
</template>

<style lang="scss" scoped>
.book {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  margin-top: $spacing-6;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1.5fr;
    gap: $spacing-8;

    .book__summary {
      grid-column: 2;
      grid-row: 1;
    }

    .book__media {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .book__meta {
      grid-column: 2;
      grid-row: 2;
    }

    .book__insight {
      grid-column: 1 / span 2;
      grid-row: 3;
    }
  }
}

.book__summary-author {
  font-size: $font-size-xl;
  color: $color-gray-700;
  transition: all 0.4s ease;

  html.dark & {
    color: $color-gray-300;

    &:hover {
      color: $color-blue-500;
    }
  }

  &:hover {
    color: $color-blue-500;
  }
}

.book__summary-price {
  display: flex;
  gap: $spacing-3;
  margin-top: $spacing-5;
  font-size: $font-size-2xl;
  font-weight: 700;

  &--old {
    align-self: center;
    color: $color-gray-700;
    text-decoration: line-through;
    font-size: $font-size-xl;

    html.dark & {
      color: $color-gray-400;
    }
  }
}

.book__summary-actions {
  display: grid;
  grid-template-columns: minmax(0, 550px) 80px;
  grid-template-rows: auto auto;
  gap: $spacing-4;
  margin-top: $spacing-5;
}

.book__summary-quantity {
  grid-column: 1 / span 2;
  grid-row: 1;
  width: 100%;
}

.book__summary-submit {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
}

.book__summary-favourite {
  grid-column: 2;
  grid-row: 2;
  width: auto;
}

.book__media img {
  display: block;
  margin: $spacing-8 auto;
  max-width: 100%;
  border-radius: $radius-5;

  @media (min-width: 900px) {
    margin: 0 auto;
  }
}

.book__meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-5;

  @media (min-width: $screen-xl) {
    grid-template-columns: min(250px) min(250px);
  }
}

.book__meta-item {
  @include flex(row, flex-start, center);
  gap: $spacing-4;
  font-size: $font-size-lg;
}

.book__meta-content {
  @include flex(column, flex-start, flex-start);
  gap: $spacing-2;
}

.book__meta-label {
  font-weight: 700;
}

.book__insight {
  margin-top: $spacing-8;
}

.book__skeleton {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  margin-top: $spacing-6;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1.5fr;
    gap: $spacing-8;

    .book__skeleton-summary {
      @include flex(column, flex-start);
      grid-column: 2;
      grid-row: 1;
    }

    .book__skeleton-media {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .book__skeleton-meta {
      @include flex(column, flex-start);
      grid-column: 2;
      grid-row: 2;
    }

    .book__skeleton-insight {
      grid-column: 1 / span 2;
      grid-row: 3;
    }
  }
}

.book__skeleton-summary {
  @include flex(column);
  gap: $spacing-3;
}

.book__skeleton-media {
  margin: $spacing-8 0;

  @media (min-width: 900px) {
    margin: 0;
  }
}

.book__skeleton-meta {
  @include flex(column);
  gap: $spacing-3;
}

.book__skeleton-insight {
  margin-top: $spacing-8;
}
</style>
