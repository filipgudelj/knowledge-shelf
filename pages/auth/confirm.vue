<script lang="ts" setup>
// STATE
const user = useSupabaseUser()
const { showToast } = useToast()
const { t, locale } = useI18n()
const router = useRouter()
const localePath = useLocalePath()

// WATCHERS
watch(
  user,
  async () => {
    if (user.value) {
      await nextTick()
      showToast('success', t('toast.emailConfirmed'))
      router.push(localePath('/'))
    } else {
      router.push(localePath('/'))
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
