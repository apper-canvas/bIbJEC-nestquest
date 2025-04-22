import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, DollarSign, Home as HomeIcon, Building, Warehouse, Map, List, X, Check } from 'lucide-react'

// Sample locations for autocomplete
const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA"
];

function MainFeature() {
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    propertyType: 'any',
    priceRange: [0, 5000000],
    purpose: 'buy'
  });
  
  // UI state
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [viewMode, setViewMode] = useState('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  
  // Handle location input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });
    
    if (value.length > 1) {
      const filtered = LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Select a location from suggestions
  const selectLocation = (location) => {
    setFormData({ ...formData, location });
    setShowSuggestions(false);
  };
  
  // Handle property type change
  const handlePropertyTypeChange = (type) => {
    setFormData({ ...formData, propertyType: type });
  };
  
  // Handle price range change
  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value) || 0;
    const newRange = [...formData.priceRange];
    newRange[index] = value;
    setFormData({ ...formData, priceRange: newRange });
  };
  
  // Handle purpose change (buy/rent)
  const handlePurposeChange = (purpose) => {
    setFormData({ ...formData, purpose });
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSearchComplete(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setSearchComplete(false);
        setFormData({
          location: '',
          propertyType: 'any',
          priceRange: [0, 5000000],
          purpose: 'buy'
        });
        setActiveStep(1);
      }, 3000);
    }, 1500);
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Advanced Property Search</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Find your perfect property with our powerful search tool. Filter by location, property type, price range, and more.
        </p>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
        {/* Search header with steps */}
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-primary" />
              <h3 className="font-semibold">Property Search</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' 
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md ${viewMode === 'map' 
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                  : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                aria-label="Map view"
              >
                <Map size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex-1 flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    activeStep >= step 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                  }`}
                >
                  {step}
                </div>
                <div 
                  className={`flex-1 h-1 ${
                    step < 3 
                      ? activeStep > step 
                        ? 'bg-primary' 
                        : 'bg-surface-200 dark:bg-surface-700' 
                      : 'hidden'
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Search form */}
        <form onSubmit={handleSearch}>
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h4 className="font-medium mb-4">Where are you looking?</h4>
                
                <div className="relative mb-6">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={handleLocationChange}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (formData.location.length > 1) {
                          setShowSuggestions(true);
                        }
                      }}
                      placeholder="Enter city, neighborhood, or ZIP" 
                      className="input-field pl-10"
                      required
                    />
                  </div>
                  
                  {/* Location suggestions */}
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div 
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 py-2 max-h-60 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {locationSuggestions.map((location, index) => (
                        <div 
                          key={index}
                          className="px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer flex items-center"
                          onClick={() => selectLocation(location)}
                        >
                          <MapPin size={16} className="mr-2 text-surface-400" />
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">I want to:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handlePurposeChange('buy')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        formData.purpose === 'buy'
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                          : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                      }`}
                    >
                      <DollarSign size={20} />
                      <span className="font-medium">Buy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePurposeChange('rent')}
                      className={`flex items-center justify-center gap-2 p-4 rounded-lg border ${
                        formData.purpose === 'rent'
                          ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                          : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                      }`}
                    >
                      <HomeIcon size={20} />
                      <span className="font-medium">Rent</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    disabled={!formData.location}
                    className="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h4 className="font-medium mb-4">Property Type</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange('any')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border ${
                      formData.propertyType === 'any'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    <Search size={24} />
                    <span className="font-medium">Any</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange('house')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border ${
                      formData.propertyType === 'house'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    <HomeIcon size={24} />
                    <span className="font-medium">House</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange('apartment')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border ${
                      formData.propertyType === 'apartment'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    <Building size={24} />
                    <span className="font-medium">Apartment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange('commercial')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border ${
                      formData.propertyType === 'commercial'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    <Warehouse size={24} />
                    <span className="font-medium">Commercial</span>
                  </button>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="btn btn-outline"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
            
            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <h4 className="font-medium mb-4">Price Range</h4>
                
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      Min: {formatPrice(formData.priceRange[0])}
                    </span>
                    <span className="text-sm text-surface-500 dark:text-surface-400">
                      Max: {formatPrice(formData.priceRange[1])}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-surface-500 mb-1 block">Minimum Price</label>
                      <input 
                        type="number" 
                        value={formData.priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        min="0"
                        max={formData.priceRange[1]}
                        step="10000"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-surface-500 mb-1 block">Maximum Price</label>
                      <input 
                        type="number" 
                        value={formData.priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        min={formData.priceRange[0]}
                        step="10000"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-surface-100 dark:bg-surface-700 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Search Summary</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <MapPin size={16} className="text-surface-500" />
                        <span>Location: <strong>{formData.location || 'Not specified'}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <HomeIcon size={16} className="text-surface-500" />
                        <span>Property Type: <strong>{formData.propertyType.charAt(0).toUpperCase() + formData.propertyType.slice(1)}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <DollarSign size={16} className="text-surface-500" />
                        <span>Purpose: <strong>{formData.purpose === 'buy' ? 'Buy' : 'Rent'}</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <DollarSign size={16} className="text-surface-500" />
                        <span>Price Range: <strong>{formatPrice(formData.priceRange[0])} - {formatPrice(formData.priceRange[1])}</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="btn btn-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Search Properties
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        
        {/* Success message */}
        <AnimatePresence>
          {searchComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white dark:bg-surface-800 flex items-center justify-center z-10"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Complete!</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  We found 24 properties matching your criteria.
                </p>
                <button className="btn btn-primary">
                  View Results
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MainFeature