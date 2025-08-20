<script lang="ts" setup>
import type { Book } from '@/types'
import { formatNumberToEuro } from '~/helpers/formatters'
import { onClickOutside } from '@vueuse/core'

// STATE
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const booksStore = useBooksStore()
const searchQuery = ref(String(route.params.searchQuery || ''))
const searchResults = ref<Book[]>([])
const searchResultsDropdownRef = ref(null)
const isSearching = ref(false)
let abortController: AbortController | null = null

// API
const getSearchResults = async (query: string) => {
  abortController?.abort()
  abortController = new AbortController()
  const signal = abortController.signal

  isSearching.value = true
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (signal.aborted) return

  const books = await booksStore.searchBooks(query)
  if (signal.aborted) return

  searchResults.value = books ?? []
  isSearching.value = false
}

// WATCHERS
watch(searchQuery, (newSearchQuery) => {
  const trimmedNewSearchQuery = newSearchQuery.trim()
  if (!trimmedNewSearchQuery) {
    searchResults.value = []
    return
  }
  getSearchResults(trimmedNewSearchQuery)
})

// HANDLERS
const doSearch = () => {
  const trimmedSearchQuery = searchQuery.value.trim()
  if (!trimmedSearchQuery) return

  abortController?.abort()
  abortController = null
  isSearching.value = false
  searchResults.value = []
  searchQuery.value = ''

  router.push(localePath(`/search/${trimmedSearchQuery}`))
}

const goToBook = (id: number) => {
  abortController?.abort()
  abortController = null
  isSearching.value = false
  searchResults.value = []
  searchQuery.value = ''

  router.push(localePath(`/books/${id}`))
}

const clearSearch = () => {
  abortController?.abort()
  searchQuery.value = ''
  searchResults.value = []
}

onClickOutside(searchResultsDropdownRef, () => {
  searchResults.value = []
})
</script>

<template>
  <div class="search">
    <input
      type="text"
      name="search"
      v-model="searchQuery"
      @keydown.enter="doSearch"
      :placeholder="$t('search.placeholder')"
      autocomplete="off"
      class="search__input"
    />

    <button @click="doSearch" class="search__button" aria-label="Search">
      <Icon name="mdi:search" size="24px" />
    </button>

    <button
      v-if="searchQuery"
      @click="clearSearch"
      class="search__button--clear"
      aria-label="Clear search"
    >
      <Icon name="mdi:remove" size="24px" />
    </button>

    <div
      v-if="searchQuery.trim() && (searchResults.length || isSearching)"
      ref="searchResultsDropdownRef"
      class="search__results"
    >
      <div v-if="isSearching" class="search__loading">
        <div class="search__loading-item" v-for="n in 3" :key="n" />
      </div>

      <div
        v-else
        v-for="book in searchResults"
        :key="book.id"
        @click="goToBook(book.id)"
        class="search__result"
      >
        <img
          class="search__result-image"
          :src="book.cover_url"
          :alt="book.title"
        />
        <div class="search__result-details">
          <p class="search__result-author">{{ book.author_name }}</p>
          <p class="search__result-title">{{ book.title }}</p>
          <p class="search__result-price">
            <span v-if="book.sale_price" class="search__result-price--old">
              {{ formatNumberToEuro(book.price, locale) }}
            </span>
            <span class="search__result-price--current">
              {{ formatNumberToEuro(book.sale_price ?? book.price, locale) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search {
  position: relative;
}

.search:hover .search__input:focus {
  border: 1px solid $color-blue-500;
}

.search__input {
  width: 128px;
  height: 40px;
  padding-inline: $spacing-10;
  border: 1px solid $color-gray-200;
  border-radius: $radius-5;
  background-color: $color-gray-200;
  color: $color-gray-900;
  line-height: 48px;
  font-size: $font-size-sm;
  transition: all 0.3s ease;

  html.dark & {
    border: 1px solid $color-gray-800;
    background-color: $color-gray-800;
    color: $color-gray-200;
  }

  &:hover {
    border: 1px solid $color-gray-400;

    html.dark & {
      border: 1px solid $color-gray-600;
    }
  }

  &:focus {
    outline: none;
    border: 1px solid $color-blue-500;

    html.dark & {
      border: 1px solid $color-blue-500;
    }
  }

  &::placeholder {
    color: $color-gray-600;

    html.dark & {
      color: $color-gray-500;
    }
  }

  @media (min-width: 430px) {
    width: 185px;
  }

  @media (min-width: $screen-xs) {
    width: 215px;
  }

  @media (min-width: $screen-sm) {
    width: 300px;
    height: 48px;
    padding-inline: $spacing-11;
    font-size: $font-size-md;
  }

  @media (min-width: $screen-md) {
    width: 340px;
  }

  @media (min-width: $screen-lg) {
    width: 420px;
  }
}

%icon-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: $color-gray-800;

  html.dark & {
    color: $color-gray-500;
  }
}

.search__button {
  @extend %icon-btn;
  left: 0;
  margin: 0 $spacing-3 0 $spacing-3;

  @media (min-width: $screen-sm) {
    margin: 0 $spacing-3 0 $spacing-5;
  }

  &--clear {
    @extend %icon-btn;
    right: 0;
    margin: 0 $spacing-3 0 $spacing-3;

    @media (min-width: $screen-sm) {
      margin: 0 $spacing-5 0 $spacing-3;
    }
  }
}

.search__results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  min-width: 185px;
  max-height: 300px;
  margin-top: $spacing-2;
  border-radius: $radius-5;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.4);
  background-color: $color-gray-100;
  overflow-y: auto;

  html.dark & {
    background-color: $color-gray-900;
  }

  &::-webkit-scrollbar {
    width: 8px;

    @media (min-width: 430px) {
      width: 12px;
    }
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $radius-3;
    background-color: $color-gray-300;

    &:hover {
      cursor: pointer;
      background-color: $color-gray-400;

      html.dark & {
        background-color: $color-gray-600;
      }
    }

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
}

.search__result {
  @include flex(row, flex-start, center);
  gap: $spacing-5;
  padding: $spacing-3 $spacing-4;
  border-bottom: 1px solid $color-gray-300;
  cursor: pointer;
  transition: all 0.3s ease;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }

  &:last-child {
    border-bottom: none;

    html.dark & {
      border-bottom: none;
    }
  }

  &:hover {
    background-color: $color-gray-200;

    html.dark & {
      background-color: $color-gray-800;
    }
  }

  @media (min-width: $screen-sm) {
    border-bottom: none;

    html.dark & {
      border-bottom: none;
    }
  }
}

.search__result-image {
  display: none;
  width: 70px;
  height: 110px;
  border-radius: $spacing-2;
  object-fit: cover;

  @media (min-width: $screen-sm) {
    display: block;
  }
}

.search__result-author {
  color: $color-gray-600;
  font-size: $font-size-xs;

  html.dark & {
    color: $color-gray-400;
  }
}

.search__result-title {
  font-size: $font-size-md;
  font-weight: 700;
}

.search__result-price {
  display: flex;
  gap: $spacing-2;
  margin-top: $spacing-1;

  &--old {
    align-self: center;
    color: $color-gray-700;
    text-decoration: line-through;
    font-size: $font-size-sm;

    html.dark & {
      color: $color-gray-400;
    }
  }
}

.search__loading {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: $spacing-3;
  padding: $spacing-3;
}

.search__loading-item {
  height: 85px;
  border-radius: $radius-4;
  background: linear-gradient(
    90deg,
    $color-gray-300 25%,
    $color-gray-200 50%,
    $color-gray-300 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1s infinite;

  html.dark & {
    background: linear-gradient(
      90deg,
      $color-gray-800 25%,
      $color-gray-700 50%,
      $color-gray-800 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1s infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
