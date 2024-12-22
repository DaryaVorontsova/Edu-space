import type { RootState } from '../../app/store';

export const selectSubjects = (state: RootState) => state.dashboard.subjects;
export const selectSubjectsLoading = (state: RootState) =>
  state.dashboard.loading;
export const selectSubjectsError = (state: RootState) => state.dashboard.error;
