<script lang="ts" setup>
import type { Author } from '@/types'
import VueSkeletonLoader from 'vue3-skeleton-loader'
import 'vue3-skeleton-loader/dist/style.css'

// STATE
const route = useRoute()
const booksStore = useBooksStore()
const { t, locale } = useI18n()
const currentLang = computed(() => locale.value as 'en' | 'hr')
const authorId = Number(route.params.id)
const author = ref<Author | null>(null)
const showSkeleton = ref(true)
const imageLoaded = ref(false)

if (!isNaN(authorId)) {
  author.value = await booksStore.getAuthorById(authorId)
} else {
  throw createError({
    statusCode: 404,
    statusMessage: t('errors.invalidAuthorId'),
  })
}

// COMPUTEDS
const isInitialLoading = computed(
  () => booksStore.isLoading && booksStore.books.length === 0,
)

// WATCHERS
watch(
  () => authorId,
  async () => {
    booksStore.resetBooks()
    await booksStore.loadMoreBooks(
      undefined,
      undefined,
      undefined,
      undefined,
      authorId,
    )
  },
  { immediate: true },
)

// INFINITE SCROLL
const onScroll = async () => {
  if (!booksStore.hasMoreBooks) return

  const scrollPos = window.innerHeight + window.scrollY
  const threshold = document.documentElement.offsetHeight - 200

  if (scrollPos >= threshold) {
    await booksStore.loadMoreBooks(
      undefined,
      undefined,
      undefined,
      undefined,
      authorId,
    )
  }
}

// LCH
onMounted(() => {
  let minDelayDone = false
  let imageDone = false

  const finish = () => {
    if (minDelayDone && imageDone) {
      showSkeleton.value = false
      imageLoaded.value = true
    }
  }

  setTimeout(() => {
    minDelayDone = true
    finish()
  }, 500)

  if (author.value?.avatar_url) {
    const img = new Image()
    img.src = author.value.avatar_url
    img.onload = () => {
      imageDone = true
      finish()
    }
  } else {
    imageDone = true
    finish()
  }
})

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// HEAD

useHead(() => ({
  title: t('seo.author.title', { name: author.value?.name ?? '' }),
  meta: [{ name: 'description', content: t('seo.author.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <div class="author">
    <div v-if="!showSkeleton && author" class="author__details">
      <h1 class="author__name">
        {{ author?.name }}
      </h1>

      <p class="author__bio">
        {{ author?.bio[currentLang] }}
      </p>

      <div
        class="author__avatar"
        :class="{ visible: imageLoaded || !author?.avatar_url }"
      >
        <img
          v-if="author?.avatar_url"
          :src="author?.avatar_url"
          :alt="author?.name"
          class="author__avatar-image"
          @load="imageLoaded = true"
        />

        <icon
          v-else
          name="mdi:user-circle"
          class="author__avatar-image author__avatar-image--icon"
        />
      </div>

      <h3 class="author__titles">{{ t('author.titles') }}</h3>
    </div>

    <div v-else class="author__skeleton">
      <VueSkeletonLoader
        type="text@1"
        height="50px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="author__skeleton-name"
      />
      <VueSkeletonLoader
        type="text@1"
        height="80px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="author__skeleton-bio"
      />
      <VueSkeletonLoader
        type="avatar@1"
        width="96px"
        height="96px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="author__skeleton-avatar"
      />
      <VueSkeletonLoader
        type="text@1"
        height="50px"
        base-color="var(--skel-base)"
        highlight-color="var(--skel-highlight)"
        class="author__skeleton-titles"
      />
    </div>

    <BooksList
      :books="booksStore.books"
      :noResultsText="t('author.noBooks')"
      :isInitialLoading="isInitialLoading"
      class="author__books"
    />
  </div>
</template>

<style lang="scss" scoped>
.author {
  width: 100%;
}

.author__details {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  column-gap: $spacing-16;
  margin-top: $spacing-6;

  .author__name {
    grid-column: 1;
  }

  .author__bio {
    grid-column: 1;
  }

  .author__avatar {
    grid-column: 1;
    grid-row: 1;
  }

  @media (min-width: $screen-lg) {
    display: grid;
    grid-template-columns: 1fr 128px;

    .author__name {
      grid-column: 1;
    }

    .author__bio {
      grid-column: 1;
    }

    .author__avatar {
      grid-column: 2;
      grid-row: 1 / span 2;
      justify-self: end;
      align-self: center;
    }
  }
}

.author__name {
  align-self: flex-start;
}

.author__bio {
  align-self: center;
  margin-top: $spacing-6;
  text-align: justify;
}

.author__titles {
  margin-top: $spacing-6;
}

.author__avatar {
  width: 80px;
  height: 80px;
  margin-bottom: $spacing-4;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.visible {
    opacity: 1;
  }

  @media (min-width: $screen-sm) {
    width: 96px;
    height: 96px;
  }

  @media (min-width: $screen-lg) {
    width: 128px;
    height: 128px;
    margin-bottom: 0;
  }
}

.author__avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;

  &--icon {
    color: $color-gray-300;

    html.dark & {
      color: $color-gray-700;
    }
  }
}

.author__books {
  margin-top: $spacing-6;
}

.author__skeleton {
  min-height: 200px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
  width: 100%;
  column-gap: $spacing-12;
  margin-top: $spacing-6;

  .author__skeleton-name {
    grid-column: 1;
  }

  .author__skeleton-bio {
    grid-column: 1;
  }

  .author__skeleton-avatar {
    grid-column: 1;
    grid-row: 1;
  }

  @media (min-width: $screen-lg) {
    display: grid;
    grid-template-columns: 1fr 128px;

    .author__skeleton-name {
      grid-column: 1;
    }

    .author__skeleton-bio {
      grid-column: 1;
    }

    .author__skeleton-avatar {
      grid-column: 2;
      grid-row: 1 / span 2;
      justify-self: center;
      align-self: center;
    }
  }
}

.author__skeleton-name {
  align-self: flex-end;
}

.author__skeleton-bio {
  align-self: center;
  margin-top: $spacing-6;
}

.author__skeleton-titles {
  margin-top: $spacing-6;
}

.author__skeleton-avatar {
  align-self: center;
  border-radius: 50%;
}
</style>
