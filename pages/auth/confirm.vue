<script lang="ts" setup>
// PAGE META
definePageMeta({
  middleware: ['confirm'],
})

// STATE
const user = useSupabaseUser()
const { showToast } = useToast()
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { error_description } = route.query as Record<string, string>

// WATCHERS
watch(
  user,
  async () => {
    if (user.value) {
      await nextTick()
      showToast('success', t('toast.emailConfirmed'))
      router.push(localePath('/'))
    }
  },
  { immediate: true },
)

// LCH
onMounted(async () => {
  if (error_description === 'Email link is invalid or has expired') {
    await nextTick()
    showToast('error', t('toast.linkExpired'))
    router.push(localePath('/'))
  }
})

// HEAD
useHead({
  title: 'Confirm | Knowledge Shelf',
  meta: [
    {
      name: 'description',
      content: 'Please confirm your email address to activate your account.',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
})
</script>

<template>
  <Loader />
</template>
