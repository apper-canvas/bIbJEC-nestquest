import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { propertyService } from '../services/apperService';

// Async thunks
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async ({ filters, pagination }, { rejectWithValue }) => {
    try {
      const response = await propertyService.fetchProperties(filters, pagination);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (propertyId, { rejectWithValue }) => {
    try {
      const property = await propertyService.getPropertyById(propertyId);
      return property;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await propertyService.createProperty(propertyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ propertyId, propertyData }, { rejectWithValue }) => {
    try {
      const response = await propertyService.updateProperty(propertyId, propertyData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(propertyId);
      return propertyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  properties: [],
  totalCount: 0,
  currentProperty: null,
  isLoading: false,
  error: null,
  filters: {
    location: '',
    type: 'any',
    status: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: ''
  },
  pagination: {
    limit: 20,
    offset: 0
  }
};

export const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    },
    clearFilters: (state) => {
      state.filters = {
        location: '',
        type: 'any',
        status: '',
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        minBathrooms: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.properties = action.payload.data || [];
        state.totalCount = action.payload.totalCount || 0;
        state.isLoading = false;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch property by id
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.currentProperty = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.properties = [action.payload, ...state.properties];
        state.isLoading = false;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.properties = state.properties.map(property => 
          property.Id === action.payload.Id ? action.payload : property
        );
        if (state.currentProperty && state.currentProperty.Id === action.payload.Id) {
          state.currentProperty = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(property => property.Id !== action.payload);
        if (state.currentProperty && state.currentProperty.Id === action.payload) {
          state.currentProperty = null;
        }
        state.isLoading = false;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPagination, clearFilters } = propertySlice.actions;

// Selectors
export const selectProperties = (state) => state.properties.properties;
export const selectTotalCount = (state) => state.properties.totalCount;
export const selectCurrentProperty = (state) => state.properties.currentProperty;
export const selectPropertiesLoading = (state) => state.properties.isLoading;
export const selectPropertiesError = (state) => state.properties.error;
export const selectFilters = (state) => state.properties.filters;
export const selectPagination = (state) => state.properties.pagination;

export default propertySlice.reducer;