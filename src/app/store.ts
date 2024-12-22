import { configureStore } from '@reduxjs/toolkit';
import { errorLoggerMiddleware } from './middleWare/errorLogger';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import loginReducer from '../features/login/loginFormSlice';
import profileReducer from '../features/profile/profileSlice';
import assignmentsReducer from '../features/subjectView/subjectViewSlice';
import permissionsReducer from '../features/permissions/permissionsSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    login: loginReducer,
    profile: profileReducer,
    assignments: assignmentsReducer,
    permissions: permissionsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(errorLoggerMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
