import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        <div className="mb-6 bg-primary/10 dark:bg-primary/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
          <span className="text-primary text-5xl font-bold">404</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track to finding your dream home.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 btn btn-primary"
          >
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className="flex items-center justify-center gap-2 btn btn-outline"
          >
            <Search size={18} />
            <span>Search Properties</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;