import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import masterDataReducer from './slices/masterDataSlice';
import consultantReducer from './slices/consultantSlice';
import branchReducer from './slices/branchSlice';
import staffReducer from './slices/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    masterData: masterDataReducer,
    consultant: consultantReducer,
    branch: branchReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
