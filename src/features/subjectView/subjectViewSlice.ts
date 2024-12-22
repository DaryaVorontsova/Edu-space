import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { fetchAssignments } from './thunks';

interface Assignment {
  assignmentId: string;
  title: string;
  description: string;
  deadline: string;
}

interface AssignmentState {
  subjectName: string;
  subjectDescription: string;
  teacherName: string;
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  subjectName: '',
  subjectDescription: '',
  teacherName: '',
  assignments: [],
  loading: false,
  error: null,
};

export const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments.push(action.payload);
    },
    removeAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter(
        assignment => assignment.assignmentId !== action.payload,
      );
    },
    updateAssignment: (
      state,
      action: PayloadAction<{
        assignmentId: string;
        title: string;
        description: string;
        deadline: string;
      }>,
    ) => {
      const { assignmentId, title, description, deadline } = action.payload;
      const assignment = state.assignments.find(
        a => a.assignmentId === assignmentId,
      );

      if (assignment) {
        assignment.title = title;
        assignment.description = description;
        assignment.deadline = deadline;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;

        const { assignments, name, description, teacherName } = action.payload;

        state.loading = false;
        state.assignments = assignments;
        state.subjectName = name;
        state.subjectDescription = description;
        state.teacherName = teacherName;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load assignments';
      });
  },
});

export const { addAssignment, removeAssignment, updateAssignment } =
  assignmentsSlice.actions;

export default assignmentsSlice.reducer;
