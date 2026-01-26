import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import masterDataReducer from './slices/masterDataSlice';
import consultantReducer from './slices/consultantSlice';
import branchReducer from './slices/branchSlice';
import staffReducer from './slices/staffSlice';
import roleReducer from './slices/roleSlice';
import adminReducer from './slices/adminSlice';
import bannerReducer from './slices/bannerSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    masterData: masterDataReducer,
    consultant: consultantReducer,
    branch: branchReducer,
    staff: staffReducer,
    role: roleReducer,
    admin: adminReducer,
    banner: bannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
