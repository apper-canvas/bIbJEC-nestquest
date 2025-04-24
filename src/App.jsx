import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Sun, Moon, Home, Search, Heart, User, Menu, X, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Pages
import HomePage from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PropertyDetail from './pages/PropertyDetail'
import PropertySearch from './pages/PropertySearch'
import UserDashboard from './pages/UserDashboard'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Redux selectors
import { selectUser, selectIsAuthenticated, clearUser } from './store/userSlice'

function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }
  
  const handleLogout = () => {
    dispatch(clearUser())
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NestQuest
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 font-medium text-surface-700 dark:text-surface-200 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/search" className="flex items-center gap-1.5 font-medium text-surface-700 dark:text-surface-200 hover:text-primary dark:hover:text-primary-light transition-colors">
              <Search size={18} />
              <span>Search</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="flex items-center gap-1.5 font-medium text-surface-700 dark:text-surface-200 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <Heart size={18} />
                  <span>Favorites</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-1.5 font-medium text-surface-700 dark:text-surface-200 hover:text-primary dark:hover:text-primary-light transition-colors">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              className="md:hidden p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="hidden md:flex items-center justify-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:flex items-center justify-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col py-3 px-4 space-y-3 border-t border-surface-200 dark:border-surface-700">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <Home size={18} />
                  <span>Home</span>
                </Link>
                <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                  <Search size={18} />
                  <span>Search</span>
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <Heart size={18} />
                      <span>Favorites</span>
                    </Link>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left w-full"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<PropertySearch />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-400">
                © {new Date().getFullYear()} NestQuest. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#terms" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                Terms
              </a>
              <a href="#privacy" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                Privacy
              </a>
              <a href="#contact" className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App