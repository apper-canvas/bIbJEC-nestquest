import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { authService } from '../services/apperService';
import { setUser, setLoading, setError, selectIsAuthenticated } from '../store/userSlice';

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [authError, setAuthError] = useState(null);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Initialize authentication UI
  useEffect(() => {
    dispatch(setLoading(true));
    
    try {
      authService.setupAuth('#authentication', 'signup', 
        // Success callback
        (user, account) => {
          dispatch(setUser(user));
          navigate('/dashboard', { replace: true });
        },
        // Error callback
        (error) => {
          console.error("Registration failed:", error);
          setAuthError("Registration failed. Please try again with a different email address.");
          dispatch(setError("Registration failed"));
        }
      );
    } catch (error) {
      console.error("Error setting up authentication:", error);
      setAuthError("An error occurred while setting up authentication. Please try again later.");
      dispatch(setError("Authentication setup failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex flex-grow items-center justify-center">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden"
          >
            <div className="px-6 py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">Create your NestQuest account</h1>
              
              {authError && (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4">
                  {authError}
                </div>
              )}
              
              <div 
                id="authentication" 
                className="min-h-[400px] flex items-center justify-center" 
              />
              
              <div className="mt-6 text-center">
                <p className="text-surface-600 dark:text-surface-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary dark:text-primary-light font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Signup;