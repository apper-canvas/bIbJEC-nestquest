import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { addToFavorites, removeFromFavorites } from '../store/favoriteSlice';
import { selectUser } from '../store/userSlice';

function PropertyCard({ property }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(property.favorite || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const formatPrice = (price, status) => {
    return status === "for rent" 
      ? `$${price.toLocaleString()}/mo`
      : `$${price.toLocaleString()}`;
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites({ 
          userId: user.userId,
          propertyId: property.Id
        })).unwrap();
      } else {
        await dispatch(addToFavorites({ 
          userId: user.userId,
          propertyId: property.Id
        })).unwrap();
      }
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        <Link to={`/property/${property.Id}`}>
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </Link>
        <div className={`property-badge ${property.status === 'for rent' ? 'rent' : 'sale'}`}>
          {property.status === 'for rent' ? 'For Rent' : 'For Sale'}
        </div>
        <button 
          className="property-favorite"
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            className={
              isTogglingFavorite 
                ? "animate-pulse text-surface-400" 
                : isFavorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-surface-600"
            } 
          />
        </button>
      </div>
      
      <div className="p-4">
        <Link to={`/property/${property.Id}`}>
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
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;