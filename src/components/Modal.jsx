import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ isOpen, title, children, onClose }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel w-full max-w-lg border border-white/10 bg-ink-900/90 p-6"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ink-300">
                  Panel
                </p>
                <h3 className="mt-2 text-lg font-display text-ink-50">{title}</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="mt-4 text-sm text-ink-200">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
