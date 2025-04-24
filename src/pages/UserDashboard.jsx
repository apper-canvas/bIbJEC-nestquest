import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { LogOut, Heart, Search, Settings, UserIcon, Bookmark } from 'lucide-react';
import { selectUser, clearUser } from '../store/userSlice';
import { fetchUserFavorites, selectFavorites, selectFavoritesLoading } from '../store/favoriteSlice';
import PropertyCard from '../components/PropertyCard';

function UserDashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const favorites = useSelector(selectFavorites);
  const isLoadingFavorites = useSelector(selectFavoritesLoading);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (user) {
      dispatch(fetchUserFavorites({ userId: user.userId }));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden mb-8"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <UserIcon size={32} />
              </div>
              
              <div className="flex-grow">
                <h1 className="text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-surface-600 dark:text-surface-400 mb-2">
                  {user?.emailAddress}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-full">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors mt-4 md:mt-0"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'favorites' 
                  ? 'border-primary text-primary dark:text-primary-light' 
                  : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart size={18} />
                <span>Favorite Properties</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('searches')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'searches' 
                  ? 'border-primary text-primary dark:text-primary-light' 
                  : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={18} />
                <span>Saved Searches</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'settings' 
                  ? 'border-primary text-primary dark:text-primary-light' 
                  : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span>Account Settings</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'favorites' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Favorite Properties</h2>
              <Link 
                to="/search" 
                className="text-primary dark:text-primary-light font-medium hover:underline flex items-center gap-1"
              >
                <Search size={16} />
                <span>Find More Properties</span>
              </Link>
            </div>
            
            {isLoadingFavorites ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-surface-600 dark:text-surface-400">Loading your favorites...</p>
                </div>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(property => (
                  <PropertyCard key={property.Id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-100 dark:bg-surface-700/30 rounded-lg p-8 text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-surface-200 dark:bg-surface-600 rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-surface-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  Save properties you like by clicking the heart icon.
                </p>
                <Link to="/search" className="btn btn-primary">
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'searches' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Saved Searches</h2>
              <Link 
                to="/search" 
                className="text-primary dark:text-primary-light font-medium hover:underline flex items-center gap-1"
              >
                <Search size={16} />
                <span>New Search</span>
              </Link>
            </div>
            
            <div className="bg-surface-100 dark:bg-surface-700/30 rounded-lg p-8 text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-surface-200 dark:bg-surface-600 rounded-full flex items-center justify-center">
                <Bookmark size={24} className="text-surface-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No saved searches</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                Save your search criteria to get notified about new properties.
              </p>
              <Link to="/search" className="btn btn-primary">
                Start Searching
              </Link>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="font-medium mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-surface-600 dark:text-surface-400 mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={user?.firstName || ''}
                      className="input-field" 
                      disabled 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-surface-600 dark:text-surface-400 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={user?.lastName || ''}
                      className="input-field" 
                      disabled 
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-surface-600 dark:text-surface-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.emailAddress || ''}
                    className="input-field" 
                    disabled 
                  />
                </div>
                
                <div className="text-sm text-surface-500 dark:text-surface-400 italic">
                  To update your profile information, please contact support.
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-800 rounded-lg shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
              <div className="p-6">
                <h3 className="font-medium mb-4">Email Preferences</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded border-surface-300 dark:border-surface-600" checked />
                    <span className="ml-2">Property recommendations</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded border-surface-300 dark:border-surface-600" checked />
                    <span className="ml-2">Price change alerts</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded border-surface-300 dark:border-surface-600" checked />
                    <span className="ml-2">New property alerts matching saved searches</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary rounded border-surface-300 dark:border-surface-600" />
                    <span className="ml-2">NestQuest newsletter</span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <button className="btn btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;