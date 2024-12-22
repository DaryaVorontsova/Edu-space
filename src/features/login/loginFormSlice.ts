import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './thunks';

interface LoginState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  accessToken:
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken') ||
    null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: state => {
      state.accessToken = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.accessToken = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error while logging in';
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
