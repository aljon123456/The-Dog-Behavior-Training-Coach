import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const getInitialToken = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('dog_coach_token') : null;
  } catch (e) {
    return null;
  }
};

const getInitialAuth = () => {
  // Only authenticate if token exists
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('dog_coach_token') : null;
    return !!token;
  } catch (e) {
    return false;
  }
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  loading: false,
  error: null,
  isAuthenticated: getInitialAuth(),
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    credentials: { email: string; password: string; username: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/signup/', credentials);
      const { token, user } = response.data;
      localStorage.setItem('dog_coach_token', token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/signin/', credentials);
      const { token, user } = response.data;
      localStorage.setItem('dog_coach_token', token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Sign in failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('dog_coach_token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
