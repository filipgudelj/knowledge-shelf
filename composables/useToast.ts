// TYPES
type ToastType = 'success' | 'error' | 'info'

// STATE
const toastType = ref<ToastType>('info')
const toastMessage = ref('')
const isToastClosing = ref(false)

export function useToast() {
  const showToast = (type: ToastType = 'info', msg: string) => {
    toastType.value = type
    toastMessage.value = msg
    isToastClosing.value = false

    setTimeout(() => {
      closeToast()
    }, 3000)
  }

  const closeToast = () => {
    if (isToastClosing.value) return
    isToastClosing.value = true
    setTimeout(() => {
      toastMessage.value = ''
    }, 300)
  }

  return {
    toastType,
    toastMessage,
    showToast,
    isToastClosing,
    closeToast,
  }
}
