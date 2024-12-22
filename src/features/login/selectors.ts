import type { RootState } from '../../app/store';

export const selectAccessToken = (state: RootState) => state.login.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.login.accessToken;
export const selectAuthLoading = (state: RootState) => state.login.loading;
export const selectAuthError = (state: RootState) => state.login.error;
