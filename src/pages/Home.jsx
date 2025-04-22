import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize, Heart, Search, ArrowRight, Filter, X } from 'lucide-react'
import MainFeature from '../components/MainFeature'

// Sample property data
const PROPERTIES = [
  {
    id: 1,
    title: "Modern Lakefront Villa",
    address: "123 Lakeview Drive, Seattle, WA",
    price: 1250000,
    type: "house",
    status: "for sale",
    bedrooms: 4,
    bathrooms: 3,
    size: 2800,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  },
  {
    id: 2,
    title: "Downtown Luxury Apartment",
    address: "456 Urban Center, Portland, OR",
    price: 750000,
    type: "apartment",
    status: "for sale",
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  },
  {
    id: 3,
    title: "Suburban Family Home",
    address: "789 Maple Street, Bellevue, WA",
    price: 850000,
    type: "house",
    status: "for sale",
    bedrooms: 3,
    bathrooms: 2.5,
    size: 2100,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  },
  {
    id: 4,
    title: "Beachfront Condo",
    address: "101 Ocean View, San Diego, CA",
    price: 5500,
    type: "apartment",
    status: "for rent",
    bedrooms: 2,
    bathrooms: 2,
    size: 1100,
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  },
  {
    id: 5,
    title: "Mountain Retreat Cabin",
    address: "222 Alpine Way, Aspen, CO",
    price: 1800000,
    type: "house",
    status: "for sale",
    bedrooms: 5,
    bathrooms: 4,
    size: 3200,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  },
  {
    id: 6,
    title: "Urban Studio Loft",
    address: "333 Downtown Blvd, Chicago, IL",
    price: 2800,
    type: "apartment",
    status: "for rent",
    bedrooms: 1,
    bathrooms: 1,
    size: 850,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    favorite: false
  }
];

function Home() {
  const [properties, setProperties] = useState(PROPERTIES);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const toggleFavorite = (id) => {
    setProperties(properties.map(property => 
      property.id === id 
        ? { ...property, favorite: !property.favorite } 
        : property
    ));
  };
  
  const formatPrice = (price, status) => {
    return status === "for rent" 
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;
  };
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-white"
            >
              Find Your Perfect Home with <span className="text-primary">NestQuest</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-surface-600 dark:text-surface-300 mb-8"
            >
              Discover thousands of properties for sale and rent across the country
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter location, city, or ZIP code" 
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFiltersOpen(true)}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <Filter size={18} />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  <button className="btn btn-primary flex items-center gap-2">
                    <Search size={18} />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-60 h-60 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
      </section>
      
      {/* Filters Modal */}
      {filtersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Advanced Filters</h3>
                <button 
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Property Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['House', 'Apartment', 'Condo', 'Land'].map(type => (
                      <label key={type} className="cursor-pointer">
                        <input type="checkbox" className="peer hidden" />
                        <div className="flex items-center justify-center p-3 rounded-lg border border-surface-200 dark:border-surface-700 
                                      peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10
                                      hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                          <span>{type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-surface-500 mb-1 block">Min Price</label>
                      <input type="number" placeholder="$0" className="input-field" />
                    </div>
                    <div>
                      <label className="text-sm text-surface-500 mb-1 block">Max Price</label>
                      <input type="number" placeholder="No max" className="input-field" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Bedrooms</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Any', '1+', '2+', '3+', '4+', '5+'].map(bed => (
                      <label key={bed} className="cursor-pointer">
                        <input type="radio" name="bedrooms" className="peer hidden" />
                        <div className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 
                                      peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10
                                      hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                          <span>{bed}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Bathrooms</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Any', '1+', '2+', '3+', '4+'].map(bath => (
                      <label key={bath} className="cursor-pointer">
                        <input type="radio" name="bathrooms" className="peer hidden" />
                        <div className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 
                                      peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10
                                      hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                          <span>{bath}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-3">
                  <button 
                    onClick={() => setFiltersOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setFiltersOpen(false)}
                    className="btn btn-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Main Feature Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <MainFeature />
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="py-12 md:py-16 bg-surface-50 dark:bg-surface-800/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Properties</h2>
            <a href="#view-all" className="text-primary dark:text-primary-light font-medium flex items-center gap-1 hover:underline">
              View all
              <ArrowRight size={16} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <motion.div 
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="property-card"
              >
                <div className="property-image-container">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className={`property-badge ${property.status === 'for rent' ? 'rent' : 'sale'}`}>
                    {property.status === 'for rent' ? 'For Rent' : 'For Sale'}
                  </div>
                  <button 
                    className="property-favorite"
                    onClick={() => toggleFavorite(property.id)}
                    aria-label={property.favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart 
                      size={20} 
                      className={property.favorite ? "fill-red-500 text-red-500" : "text-surface-600"} 
                    />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <span className="font-bold text-lg text-primary dark:text-primary-light">
                      {formatPrice(property.price, property.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-surface-500 dark:text-surface-400 mb-3">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm line-clamp-1">{property.address}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-surface-200 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Bed size={16} className="mr-1 text-surface-500 dark:text-surface-400" />
                        <span className="text-sm">{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath size={16} className="mr-1 text-surface-500 dark:text-surface-400" />
                        <span className="text-sm">{property.bathrooms} Baths</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Maximize size={16} className="mr-1 text-surface-500 dark:text-surface-400" />
                      <span className="text-sm">{property.size} sqft</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
              Join thousands of satisfied customers who found their perfect property with NestQuest
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#get-started" className="btn btn-primary px-8 py-3">Get Started</a>
              <a href="#learn-more" className="btn btn-outline px-8 py-3">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home