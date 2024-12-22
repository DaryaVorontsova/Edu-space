import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { selectAccessToken } from '../login/selectors';
import type { RootState } from '../../app/store';
import { BASE_API_URL } from '../../config';

interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  role: string;
}

export const getProfile = createAsyncThunk<
  UserProfile,
  void,
  { state: RootState; rejectValue: string }
>('profile', async (_, { getState, rejectWithValue }) => {
  try {
    const accessToken = selectAccessToken(getState());

    const response = await axios.get(`${BASE_API_URL}/profile`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    logErrorToService(error, { context: 'fetchDataUserProfile' });

    return rejectWithValue('Error fetching user profile');
  }
});
