import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import masterDataReducer from './slices/masterDataSlice';
import consultantReducer from './slices/consultantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    masterData: masterDataReducer,
    consultant: consultantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
