import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import api from '../services/api';
import { local } from '../services/storage';

const getStoredJSON = (key, defaults) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch { return { ...defaults }; }
};

const DEFAULT_NOTIFS = {
  email: true, analytics: true, warnings: true, reports: false,
  aiInsights: true, weeklyDigest: false,
};

const DEFAULT_AIPREFS = {
  predictions: true, recommendations: true,
  autoReports: false, telemetry: true, smartInsights: true,
};

const initialState = {
  themeMode: local.getTheme(),
  sidebarOpen: false,
  appearance: local.getAppearance(),
  notifs: getStoredJSON('hca_notifs', DEFAULT_NOTIFS),
  aiPrefs: getStoredJSON('hca_aiprefs', DEFAULT_AIPREFS),
  notificationsList: [],
};

export const toggleNotifAndSave = createAsyncThunk(
  'ui/toggleNotif',
  async (key, { getState, dispatch }) => {
    dispatch(toggleNotif(key)); // optimistic update
    const state = getState().ui;
    try {
      await api.put('/auth/me/preferences', { notifs: state.notifs });
    } catch (e) {
      console.error("Failed to save preferences", e);
      dispatch(toggleNotif(key)); // revert on fail
    }
    return { key, value: state.notifs[key] };
  }
);

export const toggleAiPrefAndSave = createAsyncThunk(
  'ui/toggleAiPref',
  async (key, { getState, dispatch }) => {
    dispatch(toggleAiPref(key)); // optimistic update
    const state = getState().ui;
    try {
      await api.put('/auth/me/preferences', { aiPrefs: state.aiPrefs });
    } catch (e) {
      console.error("Failed to save preferences", e);
      dispatch(toggleAiPref(key)); // revert on fail
    }
    return { key, value: state.aiPrefs[key] };
  }
);

export const toggleThemeAndSave = createAsyncThunk(
  'ui/toggleTheme',
  async (_, { getState, dispatch }) => {
    const state = getState().ui;
    const newTheme = state.themeMode === 'light' ? 'dark' : 'light';
    dispatch(toggleTheme()); // optimistic update
    if (getState().auth.isAuthenticated) {
      try {
        await api.put('/auth/me/preferences', { appearancePrefs: { themeMode: newTheme } });
      } catch (e) {
        console.error("Failed to save theme", e);
      }
    }
    return newTheme;
  }
);

export const updateAppearanceAndSave = createAsyncThunk(
  'ui/updateAppearance',
  async (payload, { getState, dispatch }) => {
    dispatch(updateAppearance(payload)); // optimistic update
    if (getState().auth.isAuthenticated) {
      const state = getState().ui;
      try {
        await api.put('/auth/me/preferences', { appearancePrefs: { appearance: state.appearance } });
      } catch (e) {
        console.error("Failed to save appearance", e);
      }
    }
    return payload;
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      local.setTheme(state.themeMode);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    updateAppearance: (state, action) => {
      state.appearance = { ...state.appearance, ...action.payload };
      local.setAppearance(state.appearance);
    },
    toggleNotif: (state, action) => {
      state.notifs[action.payload] = !state.notifs[action.payload];
      try { localStorage.setItem('hca_notifs', JSON.stringify(current(state.notifs))); } catch { /* ignore */ }
    },
    toggleAiPref: (state, action) => {
      state.aiPrefs[action.payload] = !state.aiPrefs[action.payload];
      try { localStorage.setItem('hca_aiprefs', JSON.stringify(current(state.aiPrefs))); } catch { /* ignore */ }
    },
    addNotification: (state, action) => {
      state.notificationsList.unshift(action.payload);
      if (state.notificationsList.length > 50) state.notificationsList.pop();
    },
    markAllNotificationsRead: (state) => {
      state.notificationsList.forEach(n => n.read = true);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleNotifAndSave.fulfilled, (state, action) => {
        state.notifs[action.payload.key] = action.payload.value;
        try { localStorage.setItem('hca_notifs', JSON.stringify(current(state.notifs))); } catch { /* ignore */ }
      })
      .addCase(toggleAiPrefAndSave.fulfilled, (state, action) => {
        state.aiPrefs[action.payload.key] = action.payload.value;
        try { localStorage.setItem('hca_aiprefs', JSON.stringify(current(state.aiPrefs))); } catch { /* ignore */ }
      })
      // Sync from auth fetches
      .addCase('auth/login/fulfilled', (state, action) => {
        const prefs = action.payload.user?.preferences;
        if (prefs?.notifs) state.notifs = { ...DEFAULT_NOTIFS, ...prefs.notifs };
        if (prefs?.aiPrefs) state.aiPrefs = { ...DEFAULT_AIPREFS, ...prefs.aiPrefs };
        if (prefs?.appearancePrefs) {
          if (prefs.appearancePrefs.themeMode) {
            state.themeMode = prefs.appearancePrefs.themeMode;
            local.setTheme(state.themeMode);
          }
          if (prefs.appearancePrefs.appearance) {
            state.appearance = { ...state.appearance, ...prefs.appearancePrefs.appearance };
            local.setAppearance(state.appearance);
          }
        }
      })
      .addCase('auth/me/fulfilled', (state, action) => {
        const prefs = action.payload?.preferences;
        if (prefs?.notifs) state.notifs = { ...DEFAULT_NOTIFS, ...prefs.notifs };
        if (prefs?.aiPrefs) state.aiPrefs = { ...DEFAULT_AIPREFS, ...prefs.aiPrefs };
        if (prefs?.appearancePrefs) {
          if (prefs.appearancePrefs.themeMode) {
            state.themeMode = prefs.appearancePrefs.themeMode;
            local.setTheme(state.themeMode);
          }
          if (prefs.appearancePrefs.appearance) {
            state.appearance = { ...state.appearance, ...prefs.appearancePrefs.appearance };
            local.setAppearance(state.appearance);
          }
        }
      });
  }
});

export const {
  toggleTheme, toggleSidebar, setSidebarOpen,
  updateAppearance, toggleNotif, toggleAiPref,
  addNotification, markAllNotificationsRead
} = uiSlice.actions;
export default uiSlice.reducer;
