import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 relative">
          <div className="text-9xl font-bold text-primary/10 dark:text-primary/5">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-white">Page Not Found</div>
          </div>
        </div>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl -z-10"></div>
    </div>
  )
}

export default NotFound