import React, { useMemo, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import { fetchCurrentUser } from './features/authSlice';
import { userAddedRealtime } from './features/userSlice';
import { addNotification } from './features/uiSlice';
import { socket } from './services/socket';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeContextProvider } from './context/ThemeContext';

const AppContent = () => {
  const dispatch = useDispatch();
  const { themeMode, appearance } = useSelector((state) => state.ui);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Auto-login: Validates JWT token and fetches user profile on initial mount
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user?.role === 'admin') {
      socket.connect();
      socket.emit('join_admin');

      const handleNewUser = (newUser) => {
        toast.success(`New user ${newUser.name} just joined!`, { icon: '👋', duration: 5000 });
        dispatch(userAddedRealtime(newUser));
        dispatch(addNotification({
          id: Date.now().toString(),
          title: 'New Registration 🎉',
          message: `${newUser.name} (${newUser.email}) just registered as a ${newUser.role}.`,
          read: false,
          time: new Date().toISOString()
        }));
      };

      socket.on('NEW_USER_REGISTERED', handleNewUser);

      return () => {
        socket.off('NEW_USER_REGISTERED', handleNewUser);
        socket.disconnect();
      };
    }
  }, [user, dispatch]);

  const theme = useMemo(() => {
    const isDark = themeMode === 'dark';

    /* ── Palette ──
       Dark  → premium dark neumorphism  (#0f1117 bg / #1a1f2e cards)
       Light → original coral/cyan neumorphism  (#E6ECF5)
    ── */
    const bgDefault      = isDark ? '#0f1117'  : '#E6ECF5';
    // Cards need to be CLEARLY different from bg: #1a1f2e vs #0f1117 = good contrast
    const bgPaper        = isDark ? '#1a1f2e'  : '#E6ECF5';
    const textPrimary    = isDark ? '#f0f4ff'  : '#1E293B';
    const textSecondary  = isDark ? '#8899bb'  : '#475569';
    // Dark: blue-purple accent | Light: original coral-orange
    const primaryColor   = isDark ? '#3b82f6'  : '#FF6038';
    const secondaryColor = isDark ? '#8b5cf6'  : '#00BACF';

    /* ── Shadow system ──
       Dark  → deep black outer + white micro-highlight (more pronounced for visibility)
       Light → original soft beige neumorphic pair
    ── */
    const neuOuter = isDark
      ? '0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '9px 9px 18px #b8c1cf, -9px -9px 18px #ffffff';

    const neuOuterSm = isDark
      ? '0 4px 16px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)'
      : '4px 4px 8px #b8c1cf, -4px -4px 8px #ffffff';

    const neuOuterHover = isDark
      ? '0 16px 48px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
      : '14px 14px 28px #b8c1cf, -14px -14px 28px #ffffff';

    return createTheme({
      palette: {
        mode: themeMode,
        primary:    { main: primaryColor },
        secondary:  { main: secondaryColor },
        success:    { main: '#10b981' },
        warning:    { main: isDark ? '#f59e0b' : '#FF6B35' },
        error:      { main: '#ef4444' },
        info:       { main: '#06b6d4' },
        background: { default: bgDefault, paper: bgPaper },
        text:       { primary: textPrimary, secondary: textSecondary },
        divider:    isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      },
      typography: {
        fontFamily: '"Inter", "Poppins", "Sora", sans-serif',
        h1: { fontWeight: 900, letterSpacing: '-0.04em' },
        h2: { fontWeight: 800, letterSpacing: '-0.03em' },
        h3: { fontWeight: 800, letterSpacing: '-0.025em' },
        h4: { fontWeight: 800, letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, letterSpacing: '-0.015em' },
        h6: { fontWeight: 700, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem' },
        body1: { fontWeight: 400, lineHeight: 1.65 },
        body2: { fontWeight: 400, lineHeight: 1.6 },
        caption: { fontWeight: 600, letterSpacing: '0.02em' },
        button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
      },
      shape: { borderRadius: 20 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: bgDefault,
              transition: 'background-color 0.4s ease, color 0.4s ease',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            },
          },
        },

        /* ── Paper (cards) ── */
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: bgPaper,
              // Border: much more visible in dark mode for card definition
              border: isDark ? '1px solid rgba(255,255,255,0.10)' : 'none',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            },
            elevation0: { boxShadow: 'none' },
            elevation1: { boxShadow: neuOuterSm },
            elevation2: {
              boxShadow: neuOuter,
              '&:hover': {
                boxShadow: neuOuterHover,
                transform: isDark ? 'translateY(-4px) scale(1.005)' : 'translateY(-3px)',
              },
            },
            elevation3: { boxShadow: neuOuterHover },
          },
        },

        /* ── AppBar (topbar) ── */
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: isDark ? 'rgba(15,17,23,0.85)' : 'rgba(230,236,245,0.8)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              // Border: dark only — light has no bottom border (original)
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : 'none',
              boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.5)'
                : '0 4px 30px rgba(31,38,135,0.03)',
            },
          },
        },

        /* ── Drawer (sidebar) ── */
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundImage: 'none',
              backgroundColor: isDark ? '#0d0f14' : '#E6ECF5',
              // No border on light — original style
              borderRight: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none',
              boxShadow: isDark
                ? '4px 0 32px rgba(0,0,0,0.6)'
                : '4px 0 24px #d1d9e6',
            },
          },
        },

        /* ── Buttons ── */
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              padding: '10px 24px',
              fontWeight: 700,
              transition: 'all 0.3s ease',
            },
            contained: {
              // Dark: blue-purple gradient | Light: original coral neumorphic
              ...(isDark ? {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(59,130,246,0.5)',
                  transform: 'translateY(-2px)',
                },
              } : {
                boxShadow: neuOuterSm,
                '&:hover': {
                  boxShadow: neuOuter,
                  transform: 'translateY(-1px)',
                },
              }),
            },
            outlined: {
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : undefined,
              '&:hover': {
                borderColor: primaryColor,
                backgroundColor: isDark ? 'rgba(59,130,246,0.08)' : undefined,
              },
            },
          },
        },

        /* ── Icon Buttons ── */
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: 14,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                transform: 'scale(1.1)',
              },
            },
          },
        },

        /* ── Chip ── */
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              fontWeight: 700,
              fontSize: '0.7rem',
            },
          },
        },

        /* ── Tooltip ── */
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: isDark ? '#1e2330' : '#1e293b',
              color: '#f0f4ff',
              borderRadius: 10,
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
            },
          },
        },

        /* ── Table ── */
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            },
            head: {
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: textSecondary,
            },
          },
        },

        /* ── Linear Progress ── */
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              borderRadius: 4,
              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            },
          },
        },
      },
    });
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={themeMode} style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: '16px',
                background: themeMode === 'dark' ? '#1E293B' : '#FFFFFF',
                color: themeMode === 'dark' ? '#F8FAFC' : '#0F172A',
                boxShadow:
                  appearance.neumorphism !== false
                    ? (themeMode === 'dark'
                      ? '8px 8px 16px #080c16, -8px -8px 16px #16223e'
                      : '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff')
                    : (themeMode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'),
                fontWeight: 600,
                padding: '16px 24px',
              },
            }}
          />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <ThemeContextProvider>
          <AppContent />
        </ThemeContextProvider>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
