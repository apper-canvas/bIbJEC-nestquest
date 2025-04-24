import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Search, Filter, X, ChevronDown, Grid, List as ListIcon } from 'lucide-react';
import { fetchProperties, setFilters, clearFilters, selectProperties, selectPropertiesLoading } from '../store/propertySlice';
import PropertyCard from '../components/PropertyCard';

function PropertySearch() {
  const dispatch = useDispatch();
  const properties = useSelector(selectProperties);
  const isLoading = useSelector(selectPropertiesLoading);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Local form state
  const [searchForm, setSearchForm] = useState({
    location: '',
    type: 'any',
    status: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
  });

  // Load properties on mount
  useEffect(() => {
    dispatch(fetchProperties({ filters: {} }));
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm({
      ...searchForm,
      [name]: value
    });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create filters object from form data
    const filters = {};
    
    if (searchForm.location) filters.location = searchForm.location;
    if (searchForm.type && searchForm.type !== 'any') filters.type = searchForm.type;
    if (searchForm.status) filters.status = searchForm.status;
    if (searchForm.minPrice) filters.minPrice = searchForm.minPrice;
    if (searchForm.maxPrice) filters.maxPrice = searchForm.maxPrice;
    if (searchForm.minBedrooms) filters.minBedrooms = searchForm.minBedrooms;
    if (searchForm.minBathrooms) filters.minBathrooms = searchForm.minBathrooms;
    
    // Update filters in store and fetch properties
    dispatch(setFilters(filters));
    dispatch(fetchProperties({ filters }));
    
    // Close filters drawer if open
    if (filtersOpen) {
      setFiltersOpen(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchForm({
      location: '',
      type: 'any',
      status: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      minBathrooms: '',
    });
    
    dispatch(clearFilters());
    dispatch(fetchProperties({ filters: {} }));
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Property Search</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' 
                ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' 
                ? 'bg-primary/10 dark:bg-primary/20 text-primary' 
                : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              aria-label="List view"
            >
              <ListIcon size={20} />
            </button>
            <button 
              onClick={() => setFiltersOpen(true)}
              className="btn btn-outline flex items-center gap-2"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
              <input 
                type="text" 
                name="location"
                value={searchForm.location}
                onChange={handleInputChange}
                placeholder="Enter location, city, or ZIP code" 
                className="input-field pl-10"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary flex items-center gap-2 min-w-[120px]"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </form>
        
        {/* Filter Drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-surface-800 rounded-t-2xl sm:rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Search Filters</h3>
                  <button 
                    onClick={() => setFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSearch} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['any', 'house', 'apartment', 'commercial'].map(type => (
                        <label key={type} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="type" 
                            value={type} 
                            checked={searchForm.type === type}
                            onChange={handleInputChange}
                            className="peer hidden" 
                          />
                          <div className="flex items-center justify-center p-3 rounded-lg border border-surface-200 dark:border-surface-700 
                                        peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10
                                        hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                            <span className="capitalize">{type === 'any' ? 'All Types' : type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['for sale', 'for rent'].map(status => (
                        <label key={status} className="cursor-pointer">
                          <input 
                            type="radio" 
                            name="status" 
                            value={status} 
                            checked={searchForm.status === status}
                            onChange={handleInputChange}
                            className="peer hidden" 
                          />
                          <div className="flex items-center justify-center p-3 rounded-lg border border-surface-200 dark:border-surface-700 
                                        peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10
                                        hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                            <span className="capitalize">{status}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-surface-500 mb-1 block">Min Price</label>
                        <input 
                          type="number" 
                          name="minPrice"
                          value={searchForm.minPrice}
                          onChange={handleInputChange}
                          placeholder="$0" 
                          className="input-field" 
                        />
                      </div>
                      <div>
                        <label className="text-sm text-surface-500 mb-1 block">Max Price</label>
                        <input 
                          type="number" 
                          name="maxPrice"
                          value={searchForm.maxPrice}
                          onChange={handleInputChange}
                          placeholder="No max" 
                          className="input-field" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <select 
                      name="minBedrooms"
                      value={searchForm.minBedrooms}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <select 
                      name="minBathrooms"
                      value={searchForm.minBathrooms}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-between gap-3">
                    <button 
                      type="button"
                      onClick={handleResetFilters}
                      className="btn btn-outline"
                    >
                      Reset Filters
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Apply Filters
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Properties Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-surface-600 dark:text-surface-400">Loading properties...</p>
            </div>
          </div>
        ) : properties.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
          }>
            {properties.map(property => (
              <motion.div 
                key={property.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-800 rounded-lg p-8 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center">
              <Search size={24} className="text-surface-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              Try adjusting your search filters to find more properties.
            </p>
            <button 
              onClick={handleResetFilters}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertySearch;