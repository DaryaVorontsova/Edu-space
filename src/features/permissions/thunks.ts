import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import type { RootState } from '../../app/store';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';

interface Permission {
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

export const fetchPermissions = createAsyncThunk<
  Permission,
  void,
  { state: RootState; rejectValue: string }
>('permissions/fetchPermissions', async (_, { getState, rejectWithValue }) => {
  try {
    const accessToken = selectAccessToken(getState());

    const response = await axios.get(`${BASE_API_URL}/permissions`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    logErrorToService(error, { context: 'fetchDataPermissions' });

    return rejectWithValue('Failed to load permissions');
  }
});
