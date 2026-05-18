import { AnimatePresence, motion } from 'framer-motion'
import useToastStore from '../store/useToastStore'

const toneMap = {
  info: 'toast toast-info',
  warn: 'toast toast-warn',
  alarm: 'toast toast-alarm',
}

export default function ToastStack() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={toneMap[toast.tone] ?? toneMap.info}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
                {toast.title ?? 'Notification'}
              </p>
              <p className="mt-2 text-sm text-ink-50">{toast.message}</p>
            </div>
            <button
              type="button"
              className="text-xs text-ink-200"
              onClick={() => removeToast(toast.id)}
            >
              Close
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
