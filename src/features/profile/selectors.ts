import type { RootState } from '../../app/store';

export const selectUserProfile = (state: RootState) => state.profile.user;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;
