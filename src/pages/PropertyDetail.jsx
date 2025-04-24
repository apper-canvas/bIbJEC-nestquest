import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Heart, 
  Share, 
  ArrowLeft, 
  DollarSign,
  Building,
  Calendar,
  Phone 
} from 'lucide-react';
import { fetchPropertyById } from '../store/propertySlice';
import { addToFavorites, removeFromFavorites } from '../store/favoriteSlice';
import { selectUser, selectIsAuthenticated } from '../store/userSlice';

function PropertyDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchPropertyById(parseInt(id))).unwrap();
        setProperty(result);
        setIsFavorite(result?.favorite || false);
      } catch (err) {
        setError("Failed to load property. Please try again later.");
        console.error("Error loading property:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [dispatch, id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/property/${id}` } } });
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites({ 
          userId: user.userId,
          propertyId: parseInt(id)
        })).unwrap();
      } else {
        await dispatch(addToFavorites({ 
          userId: user.userId,
          propertyId: parseInt(id)
        })).unwrap();
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatPrice = (price, status) => {
    if (!price) return "N/A";
    return status === "for rent" 
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error Loading Property</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              {error || "Property not found or has been removed."}
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 dark:bg-surface-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Link 
              to="/" 
              className="flex items-center text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Search
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-500' 
                  : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Heart size={18} className={isFavorite ? "fill-red-500" : ""} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <Share size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Property Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          {/* Property Images */}
          <div className="relative aspect-video md:aspect-[3/1] overflow-hidden">
            <img 
              src={property.image} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-md text-sm font-medium text-white ${
              property.status === 'for rent' ? 'bg-secondary' : 'bg-primary'
            }`}>
              {property.status === 'for rent' ? 'For Rent' : 'For Sale'}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Property Info */}
              <div className="md:col-span-2">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
                
                <div className="flex items-center text-surface-600 dark:text-surface-400 mb-4">
                  <MapPin size={18} className="mr-2" />
                  <span>{property.address}</span>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <Bed size={20} className="mr-2 text-primary" />
                    <span><strong>{property.bedrooms}</strong> Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={20} className="mr-2 text-primary" />
                    <span><strong>{property.bathrooms}</strong> Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Maximize size={20} className="mr-2 text-primary" />
                    <span><strong>{property.size.toLocaleString()}</strong> sqft</span>
                  </div>
                  <div className="flex items-center">
                    <Building size={20} className="mr-2 text-primary" />
                    <span><strong>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</strong></span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-surface-600 dark:text-surface-400">
                    Welcome to this beautiful {property.bedrooms} bedroom, {property.bathrooms} bathroom {property.type} 
                    in {property.location}. With {property.size.toLocaleString()} square feet of living space, 
                    this property offers the perfect blend of comfort and style. 
                    {property.status === 'for rent' 
                      ? ` Available for rent at ${formatPrice(property.price, property.status)}.` 
                      : ` Listed for sale at ${formatPrice(property.price, property.status)}.`
                    } 
                    Contact us today to schedule a viewing!
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Modern Kitchen
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Central Air Conditioning
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Hardwood Floors
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Large Windows
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Walk-in Closets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Stainless Steel Appliances
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Sidebar - Price and Contact */}
              <div>
                <div className="bg-surface-50 dark:bg-surface-700/30 p-6 rounded-xl mb-6">
                  <div className="text-3xl font-bold text-primary dark:text-primary-light mb-2">
                    {formatPrice(property.price, property.status)}
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400 mb-6">
                    <Calendar size={16} className="mr-2" />
                    <span>Available Now</span>
                  </div>
                  
                  <button className="btn btn-primary w-full mb-3">
                    Contact Agent
                  </button>
                  
                  <a 
                    href="tel:+1234567890" 
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    <Phone size={18} />
                    <span>Call Agent</span>
                  </a>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-700/30 p-6 rounded-xl">
                  <h3 className="font-semibold mb-4">Mortgage Estimate</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Loan Amount</span>
                      <span className="font-medium">${Math.round(property.price * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Interest Rate</span>
                      <span className="font-medium">3.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-surface-600 dark:text-surface-400">Term</span>
                      <span className="font-medium">30 years</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-surface-200 dark:border-surface-600">
                      <span className="font-medium">Monthly Payment</span>
                      <span className="font-bold text-primary">
                        ${Math.round((property.price * 0.8) * 0.00449).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                  
                  <button className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <DollarSign size={18} />
                    <span>Get Pre-approved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PropertyDetail;