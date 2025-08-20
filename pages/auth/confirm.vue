<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
const { showToast } = useToast()
const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const authStore = useAuthStore()
const route = useRoute()

// WATCHERS
watch(
  user,
  async () => {
    if (user.value) {
      await authStore.migrateAnonymousFavourites(user.value.id)
      await nextTick()
      showToast('success', t('toast.emailConfirmed'))
      router.push(localePath('/'))
    } else {
      const { error, error_code, error_description } = route.query
      router.push({
        path: localePath('/'),
        query: error_code
          ? { error, error_code, error_description }
          : undefined,
      })
    }
  },
  { immediate: true },
)

// HEAD
useHead(() => ({
  title: t('seo.confirm.title'),
  meta: [{ name: 'description', content: t('seo.confirm.description') }],
  htmlAttrs: { lang: locale.value },
}))
</script>

<template>
  <!-- <Loader /> -->
</template>
