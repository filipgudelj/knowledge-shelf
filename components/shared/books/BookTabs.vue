<script lang="ts" setup>
// PROPS
const props = defineProps<{
  description: Record<'en' | 'hr', string>
  authorBio: Record<'en' | 'hr', string>
}>()

//STATE
const { t, locale } = useI18n()
const currentLang = computed(() => locale.value as 'en' | 'hr')
const activeTab = ref<'description' | 'authorBio'>('description')
</script>

<template>
  <div class="book-tabs">
    <div class="book-tabs__nav">
      <button
        :class="[
          'book-tabs__tab',
          { 'book-tabs__tab--active': activeTab === 'description' },
        ]"
        @click="activeTab = 'description'"
      >
        {{ t('book.tabs.description') }}
      </button>
      <button
        :class="[
          'book-tabs__tab',
          { 'book-tabs__tab--active': activeTab === 'authorBio' },
        ]"
        @click="activeTab = 'authorBio'"
      >
        {{ t('book.tabs.authorBio') }}
      </button>
    </div>

    <div class="book-tabs__content">
      <Transition name="fade-slide" mode="out-in">
        <p :key="activeTab">
          {{
            activeTab === 'description'
              ? props.description[currentLang]
              : props.authorBio[currentLang]
          }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.book-tabs__nav {
  display: flex;
  gap: $spacing-6;
  border-bottom: 1px solid $color-gray-300;

  html.dark & {
    border-bottom: 1px solid $color-gray-700;
  }
}

.book-tabs__tab {
  padding-bottom: $spacing-2;
  border: none;
  cursor: pointer;

  &--active {
    border-bottom: 2px solid $color-blue-500;
    color: $color-blue-500;
  }
}

.book-tabs__content {
  margin-top: $spacing-4;
  color: $color-gray-700;
  line-height: 1.7;

  html.dark & {
    color: $color-gray-300;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
