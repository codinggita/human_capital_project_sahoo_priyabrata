import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, Chip, Badge, Menu, MenuItem, Divider } from '@mui/material';
import { FiMenu, FiMoon, FiSun, FiLogOut, FiActivity, FiZap, FiBell } from 'react-icons/fi';
import { toggleSidebar, toggleThemeAndSave, markAllNotificationsRead } from '../../features/uiSlice';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Topbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { themeMode, notificationsList } = useSelector((state) => state.ui);
  const { user }      = useSelector((state) => state.auth);
  const isDark = themeMode === 'dark';

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleNotificationClick = (e) => {
    setAnchorEl(e.currentTarget);
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const unreadCount = notificationsList?.filter(n => !n.read).length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: '68px !important', px: { xs: 2, sm: 3 }, gap: 1.5 }}>

        {/* Hamburger — mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ display: { sm: 'none' }, mr: 0.5 }}
        >
          <FiMenu />
        </IconButton>

        {/* ── Brand ── */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {/* Animated logo bubble */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '14px',
                  background: isDark
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : 'linear-gradient(45deg, #FF6038, #FF8C42)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDark
                    ? '0 4px 16px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : '4px 4px 10px #b8c1cf, -4px -4px 10px #ffffff',
                }}
              >
                <FiZap size={18} color="#fff" />
              </Box>
            </motion.div>

            <Box>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  background: isDark
                    ? 'linear-gradient(135deg, #f0f4ff 0%, #a78bfa 50%, #60a5fa 100%)'
                    : 'linear-gradient(45deg, #FF6038, #00E5FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Human Capital Analytics
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: isDark ? '#3b82f6' : '#FF6038',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  mt: 0.2,
                }}
              >
                Enterprise Intelligence Platform
              </Typography>
            </Box>
          </Box>

          {/* Live status chip */}
          <Chip
            label="● LIVE"
            size="small"
            sx={{
              display: { xs: 'none', lg: 'flex' },
              height: 22,
              fontSize: '0.6rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              bgcolor: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.1)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        {/* ── Right controls ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

          {/* User name */}
          <Typography
            variant="caption"
            sx={{
              display: { xs: 'none', md: 'block' },
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            {user?.name || 'Enterprise Admin'}
          </Typography>

          {/* Notification bell */}
          <IconButton
            onClick={handleNotificationClick}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: 38,
              height: 38,
              borderRadius: '14px',
              bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'background.default',
              border: isDark ? '1px solid rgba(255,255,255,0.07)' : 'none',
              boxShadow: isDark
                ? '3px 3px 8px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.04)'
                : '4px 4px 8px #b8c1cf, -4px -4px 8px #ffffff',
              color: 'text.secondary',
            }}
          >
            <Badge badgeContent={unreadCount} color="error" variant="dot" invisible={unreadCount === 0}>
              <FiBell size={16} />
            </Badge>
          </IconButton>

          {/* Notifications Dropdown */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5, width: 320, maxHeight: 400,
                bgcolor: isDark ? '#1a1f2e' : '#E6ECF5',
                backgroundImage: 'none',
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.8)' : '0 8px 24px rgba(149,157,165,0.2)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                borderRadius: 4
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Notifications</Typography>
              {unreadCount > 0 && <Chip size="small" color="primary" label={`${unreadCount} New`} sx={{ height: 20, fontSize: '0.65rem' }}/>}
            </Box>
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}/>
            {(!notificationsList || notificationsList.length === 0) ? (
              <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
              </Box>
            ) : (
              notificationsList.map((notif) => (
                <MenuItem key={notif.id} sx={{ px: 2, py: 1.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: isDark ? '#f0f4ff' : '#1E293B' }}>{notif.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3, whiteSpace: 'normal' }}>{notif.message}</Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.65rem', mt: 1, fontWeight: 700 }}>
                    {new Date(notif.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Typography>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* Theme toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() => dispatch(toggleThemeAndSave())}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: '14px',
                cursor: 'pointer',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'background.default',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : 'none',
                boxShadow: isDark
                  ? '3px 3px 8px rgba(0,0,0,0.5), -2px -2px 5px rgba(255,255,255,0.04)'
                  : '4px 4px 8px #b8c1cf, -4px -4px 8px #ffffff',
                color: isDark ? '#f59e0b' : 'text.secondary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: isDark
                    ? '0 0 16px rgba(245,158,11,0.4), 3px 3px 8px rgba(0,0,0,0.5)'
                    : 'inset 4px 4px 8px #b8c1cf, inset -4px -4px 8px #ffffff',
                },
              }}
            >
              {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </Box>
          </motion.div>

          {/* Logout button */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleLogout}
              startIcon={<FiLogOut size={14} />}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '14px',
                px: 2.5,
                py: 1,
                fontSize: '0.78rem',
                fontWeight: 800,
              }}
            >
              Logout
            </Button>
          </motion.div>

          {/* Mobile logout icon */}
          <IconButton
            color="error"
            onClick={handleLogout}
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <FiLogOut />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
