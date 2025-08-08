<script lang="ts" setup>
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'
import type { Book } from '~/types'
import { formatNumberToEuro } from '~/helpers/formatters'

// STATE
const route = useRoute()
const { t, locale } = useI18n()
const booksStore = useBooksStore()
const bookId = Number(route.params.id)
const book = ref<Book | null>(null)
const showSkeleton = ref(true)
const user = useSupabaseUser()

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
      <div class="book-summary">
        <NuxtLinkLocale
          :to="`/authors/${book.author.id}`"
          class="book-summary__author"
          :aria-label="`View details about author ${book.author.name}`"
          >{{ book.author.name }}
        </NuxtLinkLocale>
        <h1>{{ book.title }}</h1>
        <div class="book-summary__price">
          {{ formatNumberToEuro(book.price) }}
        </div>

        <div class="book__actions">
          <FormInputNumber
            id="quantity"
            v-model="quantity"
            :label="t('book.quantity')"
            :min="book.stock === 0 ? 0 : 1"
            :max="book.stock"
            :step="1"
            class="book__quantity"
          />

          <FormButton
            type="button"
            variant="primary"
            size="lg"
            :disabled="!user || book.stock === 0"
            class="book__submit"
          >
            {{
              !user
                ? t('book.actions.loginToAdd')
                : book.stock > 0
                  ? t('book.actions.addToBasket')
                  : t('book.actions.unavailable')
            }}
          </FormButton>

          <AddToFavourites
            variant="rectangle"
            :book-id="book.id"
            class="book__favourite"
          />
        </div>
      </div>

      <div class="book-media">
        <img :src="book.cover_url" :alt="book.title" />
      </div>

      <div class="book-meta">
        <div class="book-meta__item" v-if="book.original_title">
          <Icon name="mdi:flag-variant" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.originalTitle') }}</p>
            <p class="book-meta__value">{{ book.original_title }}</p>
          </div>
        </div>

        <div class="book-meta__item" v-if="book.translator">
          <Icon name="mdi:translate" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.translator') }}</p>
            <p class="book-meta__value">{{ book.translator }}</p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon
            name="mdi:calendar-month-outline"
            size="24px"
            class="book-meta__icon"
          />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.yearPublished') }}</p>
            <p class="book-meta__value">{{ book.year_published }}</p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon name="mdi:language" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.language') }}</p>
            <p class="book-meta__value">
              {{ t(`book.values.language.${book.language}`) }}
            </p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon name="mdi:bank" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.publisher') }}</p>
            <p class="book-meta__value">{{ book.publisher }}</p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon name="mdi:cube-outline" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.format') }}</p>
            <p class="book-meta__value">
              {{ book.format_width_mm }} × {{ book.format_height_mm }} mm
            </p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon
            name="mdi:format-align-justify"
            size="24px"
            class="book-meta__icon"
          />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.pagesCount') }}</p>
            <p class="book-meta__value">{{ book.pages_count }}</p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon
            name="mdi:book-open-variant"
            size="24px"
            class="book-meta__icon"
          />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.bindingType') }}</p>
            <p class="book-meta__value">
              {{ t(`book.values.bindingType.${book.binding_type}`) }}
            </p>
          </div>
        </div>

        <div class="book-meta__item">
          <Icon name="mdi:scale-balance" size="24px" class="book-meta__icon" />
          <div class="book-meta__content">
            <p class="book-meta__label">{{ t('book.meta.weight') }}</p>
            <p class="book-meta__value">{{ book.weight_kg }} kg</p>
          </div>
        </div>
      </div>

      <div class="book-insight">
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

    .book-summary {
      grid-column: 2;
      grid-row: 1;
    }

    .book-media {
      grid-column: 1;
      grid-row: 1 / span 2;
    }

    .book-meta {
      grid-column: 2;
      grid-row: 2;
    }

    .book-insight {
      grid-column: 1 / span 2;
      grid-row: 3;
    }
  }
}

.book-summary__author {
  font-size: $font-size-xl;
  color: $color-gray-700;

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

.book-summary__price {
  margin-top: $spacing-5;
  font-size: $font-size-2xl;
  font-weight: 700;
}

.book__actions {
  display: grid;
  grid-template-columns: minmax(0, 550px) 80px;
  grid-template-rows: auto auto;
  gap: $spacing-4;
  margin-top: $spacing-5;
}

.book__quantity {
  grid-column: 1 / span 2;
  grid-row: 1;
  width: 100%;
}

.book__submit {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
}

.book__favourite {
  grid-column: 2;
  grid-row: 2;
  width: auto;
}

.book-media img {
  display: block;
  margin: $spacing-8 auto;
  max-width: 100%;
  border-radius: $radius-5;

  @media (min-width: 900px) {
    margin: 0 auto;
  }
}

.book-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-5;

  @media (min-width: $screen-xl) {
    grid-template-columns: min(250px) min(250px);
  }
}

.book-meta__item {
  @include flex(row, flex-start, center);
  gap: $spacing-4;
  font-size: $font-size-lg;
}

.book-meta__content {
  @include flex(column, flex-start, flex-start);
  gap: $spacing-2;
}

.book-meta__label {
  font-weight: 700;
}

.book-insight {
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
