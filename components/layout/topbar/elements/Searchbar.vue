<script lang="ts" setup>
import type { Book } from '~/types'
import { useDebounceFn, onClickOutside } from '@vueuse/core'
import { formatNumberToEuro } from '~/helpers/formatters'

// STATE
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const booksStore = useBooksStore()
const searchQuery = ref(String(route.params.searchQuery || ''))
const searchResults = ref<Book[]>([])
const searchResultsDropdownRef = ref(null)

// API
const getSearchResults = useDebounceFn(async (searchQuery: string) => {
  const books = await booksStore.searchBooks(searchQuery)
  searchResults.value = books ?? []
}, 150)

// WATCHERS
watch(
  () => route.params.searchQuery,
  (query) => {
    searchQuery.value = String(query || '')
  },
)

watch(searchQuery, async (newSearchQuery) => {
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
  searchResults.value = []
  router.push(localePath(`/search/${trimmedSearchQuery}`))
}

const goToBook = (id: number) => {
  searchResults.value = []
  searchQuery.value = ''
  router.push(localePath(`/books/${id}`))
}

const clearSearch = () => {
  searchQuery.value = ''
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
      v-if="searchResults.length"
      ref="searchResultsDropdownRef"
      class="search__results"
    >
      <div
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
          <p class="search__result-author">{{ book.author.name }}</p>
          <p class="search__result-title">{{ book.title }}</p>
          <p class="search__result-price">
            {{ formatNumberToEuro(book.price) }}
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
  background-color: $color-gray-300;

  html.dark & {
    background-color: $color-gray-700;
  }
}

.search__input {
  width: 185px;
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
    border: 1px solid $color-gray-300;
    background-color: $color-gray-300;

    html.dark & {
      border: 1px solid $color-gray-700;
      background-color: $color-gray-700;
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
  z-index: 10;
  max-height: 300px;
  margin-top: $spacing-2;
  border-radius: $radius-5;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.2);
  background-color: $color-gray-200;
  overflow-y: auto;

  html.dark & {
    background-color: $color-gray-800;
  }

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: $radius-3;
    background-color: $color-gray-400;

    &:hover {
      cursor: pointer;
      background-color: $color-gray-500;

      html.dark & {
        background-color: $color-gray-500;
      }
    }

    html.dark & {
      background-color: $color-gray-600;
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
  border-bottom: 1px solid $color-gray-400;
  cursor: pointer;
  transition: all 0.3s ease;

  html.dark & {
    border-bottom: 1px solid $color-gray-600;
  }

  &:hover {
    background-color: $color-gray-300;

    html.dark & {
      background-color: $color-gray-700;
    }
  }

  @media (min-width: $screen-sm) {
    border-bottom: none;
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
  color: $color-gray-700;
  font-size: $font-size-xs;

  html.dark & {
    color: $color-gray-500;
  }
}

.search__result-title {
  font-size: $font-size-md;
  font-weight: 700;
}

.search__result-price {
  margin-top: $spacing-1;
}
</style>
