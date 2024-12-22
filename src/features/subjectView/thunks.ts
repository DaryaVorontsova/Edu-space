import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import type { RootState } from '../../app/store';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';

interface Assignment {
  assignmentId: string;
  title: string;
  description: string;
  deadline: string;
}

interface SubjectData {
  name: string;
  description: string;
  teacherName: string;
  assignments: Assignment[];
}

export const fetchAssignments = createAsyncThunk<
  SubjectData,
  string,
  { state: RootState; rejectValue: string }
>(
  'assignments/fetchAssignments',
  async (subjectId, { getState, rejectWithValue }) => {
    try {
      const accessToken = selectAccessToken(getState());

      const response = await axios.get(`${BASE_API_URL}/subject/${subjectId}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logErrorToService(error, { context: 'fetchSubjectAllAssignments' });

      return rejectWithValue('Failed to fetch subjects');
    }
  },
);
