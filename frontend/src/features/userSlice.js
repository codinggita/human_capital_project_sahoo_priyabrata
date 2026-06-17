import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Fetch users from backend for admin dashboard
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/admin/users');
    return response.data?.data || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

const initialState = {
  usersList: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.usersList = [];
    },
    userAddedRealtime: (state, action) => {
      // Add only if not already exists
      const exists = state.usersList.find(u => (u._id || u.id) === (action.payload._id || action.payload.id));
      if (!exists && state.usersList.length > 0) {
        state.usersList.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsers, userAddedRealtime } = userSlice.actions;
export default userSlice.reducer;
