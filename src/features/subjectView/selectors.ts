import type { RootState } from '../../app/store';

export const selectAssignments = (state: RootState) =>
  state.assignments.assignments;
export const selectAssignmentsLoading = (state: RootState) =>
  state.assignments.loading;
export const selectAssignmentsError = (state: RootState) =>
  state.assignments.error;
export const selectSubjectName = (state: RootState) =>
  state.assignments.subjectName;
export const selectSubjectDescription = (state: RootState) =>
  state.assignments.subjectDescription;
export const selectTeacherName = (state: RootState) =>
  state.assignments.teacherName;
