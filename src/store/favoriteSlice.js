import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoriteService } from '../services/apperService';

// Async thunks
export const fetchUserFavorites = createAsyncThunk(
  'favorites/fetchUserFavorites',
  async ({ userId, pagination }, { rejectWithValue }) => {
    try {
      const response = await favoriteService.getUserFavorites(userId, pagination);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async ({ userId, propertyId }, { rejectWithValue }) => {
    try {
      await favoriteService.addFavorite(userId, propertyId);
      return propertyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async ({ userId, propertyId }, { rejectWithValue }) => {
    try {
      await favoriteService.removeFavorite(userId, propertyId);
      return propertyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  favorites: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    limit: 20,
    offset: 0
  }
};

export const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.data || [];
        state.totalCount = action.payload.totalCount || 0;
        state.isLoading = false;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Add to favorites
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        // This will be handled in the property slice to update the UI
        state.isLoading = false;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(
          favorite => favorite.Id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setPagination } = favoriteSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectFavoritesTotalCount = (state) => state.favorites.totalCount;
export const selectFavoritesLoading = (state) => state.favorites.isLoading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectFavoritesPagination = (state) => state.favorites.pagination;

export default favoriteSlice.reducer;