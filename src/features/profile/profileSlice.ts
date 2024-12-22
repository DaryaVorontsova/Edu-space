import { createSlice } from '@reduxjs/toolkit';
import { getProfile } from './thunks';

interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  role: string;
}

interface UserProfileState {
  user: UserProfile;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  user: { firstName: '', lastName: '', middleName: '', email: '', role: '' },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching user profile';
      });
  },
});

export default profileSlice.reducer;
