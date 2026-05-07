import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedValue({ value, className = '' }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        className={className}
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -6, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}
