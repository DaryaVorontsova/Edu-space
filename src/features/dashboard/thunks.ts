import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import type { RootState } from '../../app/store';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';

interface Subject {
  id: string;
  name: string;
  description: string;
  teacherName: string;
}

export const fetchSubjects = createAsyncThunk<
  Subject[],
  void,
  { state: RootState; rejectValue: string }
>('dashboard/fetchSubjects', async (_, { getState, rejectWithValue }) => {
  try {
    const accessToken = selectAccessToken(getState());

    const response = await axios.get(`${BASE_API_URL}/dashboard`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    return response.data.subjects;
  } catch (error) {
    logErrorToService(error, { context: 'fetchDataSubjects' });

    return rejectWithValue('Failed to fetch subjects');
  }
});
