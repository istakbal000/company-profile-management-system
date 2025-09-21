import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import companyReducer from './slices/companySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Export types for TypeScript usage
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch