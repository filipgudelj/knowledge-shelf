import type { Toast, ToastType } from '@/types'

// STATE
const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const showToast = (type: ToastType = 'info', msg: string) => {
    const id = toastId++

    toasts.value.push({
      id,
      type,
      message: msg,
      isClosing: false,
    })

    setTimeout(() => {
      closeToast(id)
    }, 2500)
  }

  const closeToast = (id: number) => {
    const toast = toasts.value.find((t) => t.id === id)

    if (!toast || toast.isClosing) return

    toast.isClosing = true
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 200)
  }

  return {
    toasts,
    showToast,
    closeToast,
  }
}
