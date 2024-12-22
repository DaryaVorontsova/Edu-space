import { createSlice } from '@reduxjs/toolkit';
import { fetchPermissions } from './thunks';

export interface Permission {
  StudentList: boolean;
  StudentAddingForm: boolean;
  EditButton: boolean;
  DeleteButton: boolean;
  AssignmentAddingForm: boolean;
  TeacherEvaluation: boolean;
  SubmissionAnswerForm: boolean;
  SubmissionList: boolean;
  DeleteButtonSubject: boolean;
  EditButtonSubject: boolean;
  AddSubject: boolean;
  CreateUser: boolean;
}

interface PermissionsState {
  permissions: Permission;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionsState = {
  permissions: {
    StudentList: false,
    StudentAddingForm: false,
    EditButton: false,
    DeleteButton: false,
    AssignmentAddingForm: false,
    TeacherEvaluation: false,
    SubmissionAnswerForm: false,
    SubmissionList: false,
    DeleteButtonSubject: false,
    EditButtonSubject: false,
    AddSubject: false,
    CreateUser: false,
  },
  loading: false,
  error: null,
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPermissions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load permissions';
      });
  },
});

export default permissionsSlice.reducer;
