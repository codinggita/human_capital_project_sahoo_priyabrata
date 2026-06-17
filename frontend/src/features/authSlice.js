import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { local } from '../services/storage';

// Async thunk to handle user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;
      // Securely store token + user session via storage utility
      local.setToken(token);
      if (user) local.setUserSession(user);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk to fetch the current authenticated user's profile
export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/me', profileData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

// Async thunk to change password
export const changeUserPassword = createAsyncThunk('auth/changePassword', async (passwords, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/change-password', passwords);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to change password');
  }
});

// Danger Zone Actions
export const exportAccountData = createAsyncThunk('auth/exportData', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/me/export');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to export data');
  }
});

export const createAccountBackup = createAsyncThunk('auth/createBackup', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/me/backup');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create backup');
  }
});

export const deactivateUserAccount = createAsyncThunk('auth/deactivate', async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.post('/auth/me/deactivate');
    dispatch(logout());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to deactivate account');
  }
});

export const deleteUserAccount = createAsyncThunk('auth/delete', async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await api.delete('/auth/me');
    dispatch(logout());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
  }
});

export const revokeSession = createAsyncThunk('auth/revokeSession', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/auth/me/sessions/${sessionId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to revoke session');
  }
});

const initialState = {
  user: local.getUserSession() || null,
  token: local.getToken(),
  isAuthenticated: !!local.getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      local.clearAll(); // Wipes token + session + theme from localStorage
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login flows
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch current user flows
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // If fetching me fails, force logout (token might be expired)
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        local.clearAll();
      })
      // Update profile flow
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        local.setUserSession(action.payload);
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        if (state.user) {
          state.user.sessionsList = action.payload;
          local.setUserSession(state.user);
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
