import { motion } from 'framer-motion'

export default function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === activeCategory
        return (
          <motion.button
            key={category}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(category)}
            className={`category-tab ${isActive ? 'category-tab-active' : ''}`}
          >
            {formatLabel(category)}
          </motion.button>
        )
      })}
    </div>
  )
}

const formatLabel = (value) => value.replace(/_/g, ' ').toUpperCase()
