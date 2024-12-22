import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { BASE_API_URL } from '../../config';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (
    { email, password, rememberMe }: LoginCredentials,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/login`, {
        email,
        password,
      });

      const { access_token } = response.data;

      if (rememberMe) {
        localStorage.setItem('accessToken', access_token);
      } else {
        sessionStorage.setItem('accessToken', access_token);
      }

      return access_token;
    } catch (error) {
      logErrorToService(error, { context: 'loginUser' });

      return rejectWithValue('Authorization error');
    }
  },
);
