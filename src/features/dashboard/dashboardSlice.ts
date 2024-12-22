import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { fetchSubjects } from './thunks';

interface Subject {
  id: string;
  name: string;
  description: string;
  teacherName: string;
}

interface DashboardState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  subjects: [],
  loading: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSubject: (state, action: PayloadAction<Subject>) => {
      const { id, name, description, teacherName } = action.payload;
      const subject = state.subjects.find(subject => subject.id === id);

      if (subject) {
        subject.name = name;
        subject.description = description;
        subject.teacherName = teacherName;
      }
    },
    addSubject: (state, action: PayloadAction<Subject>) => {
      state.subjects.push(action.payload);
    },
    removeSubject: (state, action: PayloadAction<string>) => {
      state.subjects = state.subjects.filter(
        subject => subject.id !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSubjects.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load subjects';
      });
  },
});

export default dashboardSlice.reducer;

export const { updateSubject, addSubject, removeSubject } =
  dashboardSlice.actions;
