/**
 * Service for Apper SDK integration
 * Handles all interactions with the Apper backend
 */

const CANVAS_ID = "be554f0f39ff4e9f84c736e9cff7f628";

// Initialize ApperClient with the canvas ID
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

// Property-related methods
export const propertyService = {
  /**
   * Fetch properties with optional filtering
   * @param {Object} filters - Filter criteria
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Property data
   */
  async fetchProperties(filters = {}, pagination = { limit: 20, offset: 0 }) {
    try {
      const apperClient = getApperClient();
      
      const filterConditions = [];
      
      if (filters.location) {
        filterConditions.push({
          field: "location",
          operator: "contains",
          value: filters.location
        });
      }
      
      if (filters.type && filters.type !== 'any') {
        filterConditions.push({
          field: "type",
          operator: "eq",
          value: filters.type
        });
      }
      
      if (filters.status) {
        filterConditions.push({
          field: "status",
          operator: "eq",
          value: filters.status
        });
      }
      
      if (filters.minPrice) {
        filterConditions.push({
          field: "price",
          operator: "gte",
          value: parseFloat(filters.minPrice)
        });
      }
      
      if (filters.maxPrice) {
        filterConditions.push({
          field: "price",
          operator: "lte",
          value: parseFloat(filters.maxPrice)
        });
      }
      
      if (filters.minBedrooms) {
        filterConditions.push({
          field: "bedrooms",
          operator: "gte",
          value: parseInt(filters.minBedrooms)
        });
      }
      
      if (filters.minBathrooms) {
        filterConditions.push({
          field: "bathrooms",
          operator: "gte",
          value: parseFloat(filters.minBathrooms)
        });
      }
      
      const params = {
        fields: [
          "Id", "Name", "title", "address", "price", "type", 
          "status", "bedrooms", "bathrooms", "size", "image", 
          "favorite", "location"
        ],
        pagingInfo: pagination,
        orderBy: [{ field: "CreatedOn", direction: "desc" }],
        filter: filterConditions.length > 0 ? {
          conditionType: "and",
          conditions: filterConditions
        } : undefined
      };
      
      const response = await apperClient.fetchRecords("property", params);
      return response;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  /**
   * Fetch a single property by ID
   * @param {Number} propertyId - Property ID
   * @returns {Promise<Object>} - Property data
   */
  async getPropertyById(propertyId) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          "Id", "Name", "title", "address", "price", "type", 
          "status", "bedrooms", "bathrooms", "size", "image", 
          "favorite", "location"
        ],
        filter: {
          conditionType: "and",
          conditions: [
            {
              field: "Id",
              operator: "eq",
              value: propertyId
            }
          ]
        }
      };
      
      const response = await apperClient.fetchRecords("property", params);
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error fetching property with ID ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Object>} - Created property
   */
  async createProperty(propertyData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        record: {
          Name: propertyData.title,
          title: propertyData.title,
          address: propertyData.address,
          price: propertyData.price,
          type: propertyData.type,
          status: propertyData.status,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          size: propertyData.size,
          image: propertyData.image,
          location: propertyData.location
        }
      };
      
      const response = await apperClient.createRecord("property", params);
      return response.data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  /**
   * Update an existing property
   * @param {Number} propertyId - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Object>} - Updated property
   */
  async updateProperty(propertyId, propertyData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        record: {
          Name: propertyData.title,
          title: propertyData.title,
          address: propertyData.address,
          price: propertyData.price,
          type: propertyData.type,
          status: propertyData.status,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          size: propertyData.size,
          image: propertyData.image,
          location: propertyData.location
        }
      };
      
      const response = await apperClient.updateRecord("property", propertyId, params);
      return response.data;
    } catch (error) {
      console.error(`Error updating property with ID ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a property
   * @param {Number} propertyId - Property ID
   * @returns {Promise<Object>} - Response data
   */
  async deleteProperty(propertyId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord("property", propertyId);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property with ID ${propertyId}:`, error);
      throw error;
    }
  }
};

// Search query related methods
export const searchService = {
  /**
   * Save a search query
   * @param {Object} searchData - Search query data
   * @returns {Promise<Object>} - Saved search
   */
  async saveSearch(searchData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        record: {
          Name: `Search - ${searchData.location || 'All'} - ${new Date().toLocaleString()}`,
          location: searchData.location,
          property_type: searchData.propertyType || 'any',
          min_price: searchData.minPrice || 0,
          max_price: searchData.maxPrice || 0,
          purpose: searchData.purpose || 'buy',
          bedrooms: searchData.bedrooms || 'Any',
          bathrooms: searchData.bathrooms || 'Any',
          view_mode: searchData.viewMode || 'list'
        }
      };
      
      const response = await apperClient.createRecord("search_query1", params);
      return response.data;
    } catch (error) {
      console.error("Error saving search:", error);
      throw error;
    }
  },

  /**
   * Fetch saved searches
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Saved searches
   */
  async getSavedSearches(pagination = { limit: 20, offset: 0 }) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          "Id", "Name", "location", "property_type", "min_price", 
          "max_price", "purpose", "bedrooms", "bathrooms", "view_mode"
        ],
        pagingInfo: pagination,
        orderBy: [{ field: "CreatedOn", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords("search_query1", params);
      return response;
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      throw error;
    }
  }
};

// Favorites related methods
export const favoriteService = {
  /**
   * Fetch user favorites
   * @param {String} userId - User ID
   * @param {Object} pagination - Pagination options
   * @returns {Promise<Object>} - Favorited properties
   */
  async getUserFavorites(userId, pagination = { limit: 20, offset: 0 }) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: ["Id", "Name", "user_id", "property_id", "date_added"],
        pagingInfo: pagination,
        filter: {
          conditionType: "and",
          conditions: [
            {
              field: "user_id",
              operator: "eq",
              value: userId
            }
          ]
        },
        orderBy: [{ field: "date_added", direction: "desc" }]
      };
      
      const response = await apperClient.fetchRecords("user_favorite", params);
      
      // If we have favorites, fetch the associated properties
      if (response.data && response.data.length > 0) {
        const propertyIds = response.data.map(fav => fav.property_id);
        
        const propertyParams = {
          fields: [
            "Id", "Name", "title", "address", "price", "type", 
            "status", "bedrooms", "bathrooms", "size", "image", 
            "location"
          ],
          filter: {
            conditionType: "and",
            conditions: [
              {
                field: "Id",
                operator: "in",
                value: propertyIds
              }
            ]
          }
        };
        
        const propertiesResponse = await apperClient.fetchRecords("property", propertyParams);
        
        // Add a favorite: true flag to each property
        if (propertiesResponse.data) {
          propertiesResponse.data = propertiesResponse.data.map(property => ({
            ...property,
            favorite: true
          }));
        }
        
        return propertiesResponse;
      }
      
      return { data: [] };
    } catch (error) {
      console.error(`Error fetching favorites for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Add a property to favorites
   * @param {String} userId - User ID
   * @param {Number} propertyId - Property ID
   * @returns {Promise<Object>} - Created favorite
   */
  async addFavorite(userId, propertyId) {
    try {
      const apperClient = getApperClient();
      
      // Check if already favorited
      const checkParams = {
        fields: ["Id"],
        filter: {
          conditionType: "and",
          conditions: [
            {
              field: "user_id",
              operator: "eq",
              value: userId
            },
            {
              field: "property_id",
              operator: "eq",
              value: propertyId
            }
          ]
        }
      };
      
      const existingResponse = await apperClient.fetchRecords("user_favorite", checkParams);
      
      if (existingResponse.data && existingResponse.data.length > 0) {
        // Already favorited, return existing
        return existingResponse.data[0];
      }
      
      // Create new favorite
      const params = {
        record: {
          Name: `Favorite - ${userId} - ${propertyId}`,
          user_id: userId,
          property_id: propertyId,
          date_added: new Date().toISOString()
        }
      };
      
      const response = await apperClient.createRecord("user_favorite", params);
      return response.data;
    } catch (error) {
      console.error(`Error adding favorite for user ${userId}, property ${propertyId}:`, error);
      throw error;
    }
  },

  /**
   * Remove a property from favorites
   * @param {String} userId - User ID
   * @param {Number} propertyId - Property ID
   * @returns {Promise<boolean>} - Success status
   */
  async removeFavorite(userId, propertyId) {
    try {
      const apperClient = getApperClient();
      
      // Find the favorite entry
      const checkParams = {
        fields: ["Id"],
        filter: {
          conditionType: "and",
          conditions: [
            {
              field: "user_id",
              operator: "eq",
              value: userId
            },
            {
              field: "property_id",
              operator: "eq",
              value: propertyId
            }
          ]
        }
      };
      
      const existingResponse = await apperClient.fetchRecords("user_favorite", checkParams);
      
      if (existingResponse.data && existingResponse.data.length > 0) {
        // Delete the favorite
        const favoriteId = existingResponse.data[0].Id;
        await apperClient.deleteRecord("user_favorite", favoriteId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error removing favorite for user ${userId}, property ${propertyId}:`, error);
      throw error;
    }
  }
};

// Authentication wrapper around ApperUI
export const authService = {
  setupAuth(targetElement, view, onSuccess, onError) {
    try {
      const { ApperUI } = window.ApperSDK;
      const apperClient = getApperClient();
      
      ApperUI.setup(apperClient, {
        target: targetElement,
        clientId: CANVAS_ID,
        hide: [],
        view: view, // 'login', 'signup', or 'both'
        onSuccess: onSuccess,
        onError: onError
      });
      
      if (view === 'login' || view === 'both') {
        ApperUI.showLogin(targetElement);
      } else if (view === 'signup') {
        ApperUI.showSignup(targetElement);
      }
    } catch (error) {
      console.error("Error setting up authentication:", error);
      throw error;
    }
  }
};

export default {
  propertyService,
  searchService,
  favoriteService,
  authService
};