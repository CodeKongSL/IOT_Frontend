import { create } from 'zustand'

const DEFAULT_TIMEOUT = 4500

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = toast.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))

    const duration = toast.duration ?? DEFAULT_TIMEOUT
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((item) => item.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((item) => item.id !== id),
    })),
}))

export default useToastStore
