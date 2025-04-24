import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import userReducer from './userSlice';
import propertyReducer from './propertySlice';
import favoriteReducer from './favoriteSlice';

// Configure persist for user slice only
const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user', 'isAuthenticated'], // only persist user data and auth status
};

// Root reducer with persistence
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  properties: propertyReducer,
  favorites: favoriteReducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['user.user'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default { store, persistor };